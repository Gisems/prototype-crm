import type { MemberFormValues } from "./form"

export interface CreateMemberDto {
  name: string
  email: string
  role: string
}

export function toCreateMemberDto({ name, email, role }: MemberFormValues): CreateMemberDto {
  return { name, email, role }
}
