import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  type CardFormInput,
  type CardFormValues,
  cardFormSchema,
  emptyCardFormInput,
  formatCardNumber,
  formatExpiry,
} from "core/models/billing"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"

interface CardFormProps {
  /** Resuelve `true` si la tarjeta se guardó; entonces quien llama cierra el formulario. */
  onSave: (values: CardFormValues) => Promise<boolean>
  onCancel: () => void
}

export function CardForm({ onSave, onCancel }: Readonly<CardFormProps>) {
  const form = useForm<CardFormInput, unknown, CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: emptyCardFormInput,
  })
  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          if (await onSave(values)) onCancel()
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de tarjeta</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                  className="font-mono"
                  {...field}
                  onChange={(event) => field.onChange(formatCardNumber(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vencimiento</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/AA"
                    className="font-mono"
                    {...field}
                    onChange={(event) => field.onChange(formatExpiry(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                    placeholder="123"
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Solo guardamos la marca, los últimos 4 dígitos y el vencimiento de tu tarjeta.
        </p>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="action" disabled={isSubmitting} onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="accent">
            {isSubmitting ? "Guardando…" : "Guardar tarjeta"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
