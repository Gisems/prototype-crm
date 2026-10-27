import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { useSignIn } from "core/hooks/mutation/use-mutation-auth"
import { type SignInFormInput, type SignInFormValues, signInFormSchema, toSignInDto } from "core/models/auth"
import { PATHS } from "router/paths"
import { BrandLogo } from "shared/components/custom/brand-logo"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const { mutate, isPending } = useSignIn()
  const form = useForm<SignInFormInput, unknown, SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: SignInFormValues) {
    mutate(toSignInDto(values, rememberMe), {
      onSuccess: () => void navigate(PATHS.DASHBOARD.INDEX, { replace: true }),
      // Copia única a propósito: distinguir "correo no existe" de "contraseña incorrecta" revela qué correos tienen cuenta.
      onError: () => toast.error("Correo o contraseña incorrectos"),
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <BrandLogo />

      <div>
        <h1 className="text-xl font-bold">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-muted-foreground">Entrá a tu cuenta para gestionar tus conversaciones</p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => toast.info("El acceso con Google estará disponible pronto")}
      >
        Continuar con Google
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />o con tu email
        <span className="h-px flex-1 bg-border" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="tu@empresa.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="absolute inset-y-0 right-1 my-auto"
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="size-4 accent-primary"
              />
              Recordarme
            </label>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => toast.info("La recuperación de contraseña estará disponible pronto")}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" disabled={isPending} className="mt-3 h-auto w-full py-3.5" variant="accent">
            {isPending ? "Ingresando…" : "Iniciar sesión"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
