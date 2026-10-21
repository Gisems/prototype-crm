import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  AVATAR_COLORS,
  type AvatarColor,
  type Profile,
  type ProfileFormInput,
  type ProfileFormValues,
  profileFormSchema,
  toProfileFormInput,
} from "core/models/profile"
import { avatarToneClass } from "shared/components/custom/user-avatar"
import { Button } from "shared/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form"
import { Input } from "shared/components/ui/input"

interface ProfileCardProps {
  profile: Profile
  /** Resuelve `true` si se guardó; entonces el formulario toma esos valores como los nuevos "sin cambios". */
  onSave: (values: ProfileFormValues) => Promise<boolean>
  onAvatarColorChange: (color: AvatarColor) => void
}

export function ProfileCard({ profile, onSave, onAvatarColorChange }: Readonly<ProfileCardProps>) {
  const form = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: toProfileFormInput(profile),
  })
  const { isDirty, isSubmitting } = form.formState

  return (
    <section className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-bold">Datos personales</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            if (await onSave(values)) form.reset(values)
          })}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
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
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={!isDirty || isSubmitting} className="self-start" variant="accent">
            {isSubmitting ? "Guardando…" : "Guardar datos"}
          </Button>
        </form>
      </Form>

      <fieldset className="flex flex-col gap-3 border-t pt-5">
        <legend className="mb-3 text-sm font-medium">Color del avatar</legend>
        <div className="flex gap-3">
          {AVATAR_COLORS.map((color) => {
            const isSelected = profile.avatarColor === color

            return (
              <button
                key={color}
                type="button"
                aria-label={`Color ${color}`}
                aria-pressed={isSelected}
                onClick={() => onAvatarColorChange(color)}
                className={`flex size-9 items-center justify-center rounded-full transition-transform hover:scale-110 ${avatarToneClass(color)} ${
                  isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
              >
                {isSelected && <Check className="size-4" />}
              </button>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}
