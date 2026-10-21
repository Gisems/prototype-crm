import { create, isAxiosError, type CreateAxiosDefaults } from "axios"

import { HttpFailure } from "./failure"

export interface HttpRequest {
  method: "get" | "post" | "put" | "patch" | "delete"
  url: string
  body?: unknown
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

/** Una página tal como la entrega `getPaginated`, ya fuera del envelope del backend. */
export interface Paginated<T> {
  data: T[]
  meta: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

interface HttpResponse {
  status: number
  body: unknown
}

/**
 * Seam interno: en producción es axios, en los tests es una función que devuelve respuestas fijas.
 * No es un punto de extensión público — el transporte es un detalle del cliente (ADR-0002).
 */
export type HttpTransport = (request: HttpRequest) => Promise<HttpResponse>

interface ClientConfig {
  /** Solo lo usa el transporte axios: quien inyecta el suyo —los tests y `createBrowserClient`— trae su propia base. */
  baseURL?: string
  headers?: CreateAxiosDefaults["headers"]
  /**
   * Saca el payload del envelope propio de este backend. Cada backend declara el suyo y no se
   * intenta ningún otro: si la respuesta no tiene esa forma, la llamada falla (ADR-0002).
   */
  unwrap: (body: unknown) => unknown
  /**
   * Igual que `unwrap`, para `getPaginated`: saca `{ data, meta }`. Va aparte para que `get` entregue siempre `data`
   * y el tipo de una llamada no dependa de si la respuesta trajo `meta`. Solo lo declara el backend que pagina.
   */
  unwrapPaginated?: (body: unknown) => Paginated<unknown>
  /** Solo lo declara el backend que se sale de la norma; ver `HttpFailure.opaqueMessage`. */
  opaqueErrorMessages?: boolean
  /**
   * Se resuelve en cada petición, no al construir el cliente: el token aparece con el login y el
   * cliente ya existe desde el arranque del módulo. Sin token la petición sale sin `Authorization`
   * y es el backend quien responde 401.
   */
  getToken?: () => string | null | Promise<string | null>
  transport?: HttpTransport
}

interface RequestOptions<T> {
  params?: Record<string, unknown>
  headers?: Record<string, string>
  /** Valida y tipa el payload. Lanza si el backend rompió su contrato. */
  decode?: (payload: unknown) => T
}

function createAxiosTransport(baseURL?: string, headers?: CreateAxiosDefaults["headers"]): HttpTransport {
  const instance = create({ baseURL, headers })

  return async ({ method, url, body, params, headers: requestHeaders }) => {
    const { status, data } = await instance.request({ method, url, data: body, params, headers: requestHeaders })

    return { status, body: data }
  }
}

function toFailure(error: unknown, opaqueMessage: boolean): HttpFailure {
  if (error instanceof HttpFailure) return error

  if (isAxiosError(error)) {
    // Sin `response` la petición nunca salió: no hay nada que el backend haya dicho.
    if (!error.response) {
      return new HttpFailure("The request never reached the backend", { kind: "network", cause: error })
    }

    // Tanto Cal.com como loki mandan el detalle en `error.message`; el resto, en `message`.
    const body = error.response.data as { error?: { message?: string }; message?: string } | undefined
    return new HttpFailure(`The backend responded with ${error.response.status}`, {
      kind: "http",
      status: error.response.status,
      backendMessage: body?.error?.message ?? body?.message,
      opaqueMessage,
      cause: error,
    })
  }

  return new HttpFailure("The request failed", { kind: "network", cause: error })
}

export function createClient({
  baseURL,
  headers,
  unwrap,
  unwrapPaginated,
  opaqueErrorMessages = false,
  getToken,
  transport,
}: ClientConfig) {
  const send = transport ?? createAxiosTransport(baseURL, headers)

  async function authorize(requestHeaders?: Record<string, string>) {
    const token = await getToken?.()

    if (!token) return requestHeaders

    // El header explícito de la llamada gana: así un caso puntual puede mandar otra credencial.
    return { Authorization: `Bearer ${token}`, ...requestHeaders }
  }

  async function request<T>(
    method: HttpRequest["method"],
    url: string,
    body: unknown,
    { params, headers: requestHeaders, decode }: RequestOptions<T> = {},
    extract: (body: unknown) => unknown = unwrap,
  ): Promise<T> {
    let response: HttpResponse

    try {
      response = await send({ method, url, body, params, headers: await authorize(requestHeaders) })
    } catch (error) {
      throw toFailure(error, opaqueErrorMessages)
    }

    const payload = extract(response.body)

    if (!decode) return payload as T

    try {
      return decode(payload)
    } catch (error) {
      // Un fallo de decode siempre es un contrato nuestro equivocado, nunca un resultado esperado.
      console.error(`[http] no se pudo parsear la respuesta de ${method.toUpperCase()} ${url}`, error)

      throw new HttpFailure("The backend returned a payload we cannot parse", { kind: "decode", cause: error })
    }
  }

  return {
    get: <T>(url: string, options?: RequestOptions<T>) => request<T>("get", url, undefined, options),
    /** `decode` recibe la página entera, `{ data, meta }`, para que el schema valide también `meta`. */
    getPaginated: <T extends Paginated<unknown>>(url: string, options?: RequestOptions<T>) => {
      if (!unwrapPaginated) throw new Error(`getPaginated ${url}: this backend declares no unwrapPaginated`)

      return request<T>("get", url, undefined, options, unwrapPaginated)
    },
    post: <T>(url: string, body?: unknown, options?: RequestOptions<T>) => request<T>("post", url, body, options),
    put: <T>(url: string, body?: unknown, options?: RequestOptions<T>) => request<T>("put", url, body, options),
    patch: <T>(url: string, body?: unknown, options?: RequestOptions<T>) => request<T>("patch", url, body, options),
    delete: <T>(url: string, options?: RequestOptions<T>) => request<T>("delete", url, undefined, options),
  }
}

export type HttpClient = ReturnType<typeof createClient>
