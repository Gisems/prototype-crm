import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Customer } from "core/models/customer"
import {
  EVENT_TYPES,
  type EventFormInput,
  type EventFormValues,
  emptyEventFormInput,
  eventFormSchema,
  NO_LINK,
} from "core/models/event"
import type { TeamMember } from "core/models/team"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"
import { Textarea } from "shared/components/ui/textarea"

import { EVENT_LABELS } from "./event-visuals"

interface EventFormProps {
  /** Los valores del evento que se edita, o los de uno nuevo en el día que se mira. */
  initial: EventFormInput | undefined
  /** El día que se está mirando: el de un evento nuevo. */
  defaultDate: string
  customers: Customer[]
  members: TeamMember[]
  submitLabel: string
  submittingLabel: string
  /** Resuelve `true` si se guardó; entonces el formulario se cierra. */
  onSubmit: (values: EventFormValues) => Promise<boolean>
  onCancel: () => void
  /** Solo al editar: pide confirmar la eliminación del evento. */
  onDelete?: () => void
}

export function EventForm({
  initial,
  defaultDate,
  customers,
  members,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
  onDelete,
}: Readonly<EventFormProps>) {
  const form = useForm<EventFormInput, unknown, EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initial ?? emptyEventFormInput(defaultDate),
  })
  const { isSubmitting } = form.formState
  const customerItems: Record<string, string> = {
    [NO_LINK]: "Sin contacto",
    ...Object.fromEntries(customers.map((customer) => [String(customer.id), customer.name])),
  }
  const assigneeItems: Record<string, string> = {
    [NO_LINK]: "Sin asignar",
    ...Object.fromEntries(
      members.map((member) => [String(member.id), member.active ? member.name : `${member.name} (inactivo)`]),
    ),
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          if (await onSubmit(values)) onCancel()
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Ej: Llamada de seguimiento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select value={field.value} items={EVENT_LABELS} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {EVENT_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contacto</FormLabel>
              <Select value={field.value} items={customerItems} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NO_LINK}>Sin contacto</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={String(customer.id)}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsable</FormLabel>
              <Select value={field.value} items={assigneeItems} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NO_LINK}>Sin asignar</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {assigneeItems[String(member.id)]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea placeholder="Opcional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap justify-between gap-2">
          <div>
            {onDelete && (
              <Button type="button" variant="destructive" size="action" disabled={isSubmitting} onClick={onDelete}>
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="action" disabled={isSubmitting} onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="accent">
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
