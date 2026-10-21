import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  emptyTicketFormInput,
  type TicketFormInput,
  type TicketFormValues,
  ticketFormSchema,
} from "core/models/support"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"
import { Textarea } from "shared/components/ui/textarea"

interface TicketFormProps {
  /** Resuelve `true` si la consulta se envió; entonces el formulario se vacía. */
  onSubmit: (values: TicketFormValues) => Promise<boolean>
}

export function TicketForm({ onSubmit }: Readonly<TicketFormProps>) {
  const form = useForm<TicketFormInput, unknown, TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: emptyTicketFormInput,
  })
  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          if (await onSubmit(values)) form.reset()
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asunto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: No me llegan los mensajes de WhatsApp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Cuéntanos qué necesitas…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="self-center" variant="accent">
          {isSubmitting ? "Enviando…" : "Enviar consulta"}
        </Button>
      </form>
    </Form>
  )
}
