# core/lib/api

Un cliente HTTP por backend, construido con `createClient` (`core/lib/client`): un `HttpTransport` (axios en producción, un doble en tests), un `unwrap` propio del envelope del backend y un `HttpFailure` tipado (`network | http | decode`) en vez de filtrar errores de axios.
