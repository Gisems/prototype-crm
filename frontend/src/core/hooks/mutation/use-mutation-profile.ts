import { useMutation, useQueryClient } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { UpdateProfileDto } from "core/models/profile"
import { profileService } from "core/services/account/instance"

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => profileService.update(dto),
    onSuccess: (profile) => queryClient.setQueryData([QueryKeysEnum.PROFILE], profile),
  })
}
