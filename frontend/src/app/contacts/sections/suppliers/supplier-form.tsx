import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  emptySupplierFormInput,
  type SupplierFormInput,
  type SupplierFormValues,
  supplierFormSchema,
} from "core/models/supplier"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"
import { Textarea } from "shared/components/ui/textarea"

interface SupplierFormProps {
  /** Los valores del proveedor que se edita; sin ellos el formulario empieza vacío, para crear. */
  initial?: SupplierFormInput
  submitLabel: string
  submittingLabel: string
  /** Resuelve `true` si se guardó; entonces el formulario se cierra. */
  onSubmit: (values: SupplierFormValues) => Promise<boolean>
  onCancel: () => void
}

export function SupplierForm({
  initial = emptySupplierFormInput,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
}: Readonly<SupplierFormProps>) {
  const form = useForm<SupplierFormInput, unknown, SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: initial,
  })
  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          if (await onSubmit(values)) onCancel()
        })}
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="Ej: Textiles del Plata" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ruc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUC</FormLabel>
                <FormControl>
                  <Input inputMode="numeric" maxLength={12} autoComplete="off" placeholder="12 dígitos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rubro</FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="Ej: Telas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Persona de contacto</FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="Ej: Laura Benítez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input type="tel" autoComplete="off" placeholder="+598 2 900 1100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="off" placeholder="ventas@empresa.uy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Días de entrega, pedido mínimo…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="action" disabled={isSubmitting} onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="accent">
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
