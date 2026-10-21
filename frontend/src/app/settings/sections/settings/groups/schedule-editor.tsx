import { type UseFormReturn, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { DAYS, type GroupFormInput, type GroupFormValues, WEEKDAYS_AFTER_MONDAY } from "core/models/group"
import { Button } from "shared/components/ui/button"
import { FormControl, FormField, FormItem, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"

type GroupForm = UseFormReturn<GroupFormInput, unknown, GroupFormValues>

/** El horario de atención de un grupo: una fila por día, con su casilla, la hora de apertura y la de cierre. */
export function ScheduleEditor({ form }: Readonly<{ form: GroupForm }>) {
  const schedule = useWatch({ control: form.control, name: "schedule" })

  function copyMonday() {
    const monday = form.getValues("schedule.mon")

    for (const day of WEEKDAYS_AFTER_MONDAY) {
      form.setValue(`schedule.${day}`, { ...monday }, { shouldDirty: true })
    }

    toast.success("Horario del lunes copiado a martes–viernes")
  }

  return (
    <div className="flex flex-col gap-2">
      {DAYS.map(({ key, label }) => (
        <div key={key} className="grid grid-cols-[7.5rem_1fr_auto_1fr] items-start gap-2">
          <FormField
            control={form.control}
            name={`schedule.${key}.active`}
            render={({ field }) => (
              <label className="flex h-8 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="size-4 accent-primary"
                />
                {label}
              </label>
            )}
          />

          <FormField
            control={form.control}
            name={`schedule.${key}.from`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="time"
                    aria-label={`${label}: hora de apertura`}
                    disabled={!schedule[key].active}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <span className="flex h-8 items-center text-sm text-muted-foreground">a</span>

          <FormField
            control={form.control}
            name={`schedule.${key}.to`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="time"
                    aria-label={`${label}: hora de cierre`}
                    disabled={!schedule[key].active}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" className="mt-1 self-start" onClick={copyMonday}>
        Copiar horario del lunes a martes–viernes
      </Button>
    </div>
  )
}
