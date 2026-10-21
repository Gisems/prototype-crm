import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  CUSTOMER_CHANNELS,
  CUSTOMER_STAGES,
  type CustomerFormInput,
  type CustomerFormValues,
  customerFormSchema,
  emptyCustomerFormInput,
  NO_ASSIGNEE,
} from "core/models/customer"
import type { TeamMember } from "core/models/team"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select"

import { CHANNEL_LABELS, STAGE_LABELS } from "./customer-visuals"

interface CustomerFormProps {
  /** Los valores del cliente que se edita; sin ellos el formulario empieza vacío, para crear. */
  initial?: CustomerFormInput
  /** A quién se puede asignar el cliente. */
  members: TeamMember[]
  submitLabel: string
  submittingLabel: string
  /** Resuelve `true` si se guardó; entonces el formulario se cierra. */
  onSubmit: (values: CustomerFormValues) => Promise<boolean>
  onCancel: () => void
}

export function CustomerForm({
  initial = emptyCustomerFormInput,
  members,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
}: Readonly<CustomerFormProps>) {
  const form = useForm<CustomerFormInput, unknown, CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: initial,
  })
  const { isSubmitting } = form.formState
  const assigneeItems: Record<string, string> = {
    [NO_ASSIGNEE]: "Sin asignar",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Ej: Camila Suárez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canal</FormLabel>
                <Select value={field.value} items={CHANNEL_LABELS} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CUSTOMER_CHANNELS.map((channel) => (
                      <SelectItem key={channel} value={channel}>
                        {CHANNEL_LABELS[channel]}
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input type="tel" autoComplete="off" placeholder="+598 99 123 456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="whatsappId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID de WhatsApp</FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Ej: 59899123456" {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground">Opcional.</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiquetas</FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Lead, VIP" {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground">Separadas por coma.</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etapa</FormLabel>
                <Select value={field.value} items={STAGE_LABELS} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CUSTOMER_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {STAGE_LABELS[stage]}
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
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (UYU)</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="decimal" min={0} step="any" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  <SelectItem value={NO_ASSIGNEE}>Sin asignar</SelectItem>
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
