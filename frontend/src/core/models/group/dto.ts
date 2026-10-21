import type { GroupFormValues } from "./form"
import type { Schedule } from "./schedule"

export interface SaveGroupDto {
  name: string
  memberIds: number[]
  schedule: Schedule
}

export function toSaveGroupDto({ name, memberIds, schedule }: GroupFormValues): SaveGroupDto {
  return { name, memberIds, schedule }
}
