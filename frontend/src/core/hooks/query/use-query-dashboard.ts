import { useQuery } from "@tanstack/react-query"

import { QueryKeysEnum } from "core/hooks/types/query-keys"
import type { DashboardPeriod } from "core/models/dashboard"
import { dashboardService } from "core/services/dashboard/instance"

export function useDashboard(period: DashboardPeriod) {
  return useQuery({
    queryKey: [QueryKeysEnum.DASHBOARD, period],
    queryFn: () => dashboardService.get(period),
  })
}
