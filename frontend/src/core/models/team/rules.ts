import type { TeamMember } from "./response"

export const ADMIN_ROLE = "Administrador"

/**
 * Siempre debe quedar al menos un administrador activo: si no, nadie podría volver a gestionar el equipo ni
 * el plan. Por eso al último no se lo puede quitar ni desactivar.
 */
export function isLastActiveAdmin(members: TeamMember[], member: TeamMember) {
  const activeAdmins = members.filter((item) => item.role === ADMIN_ROLE && item.active)

  return member.role === ADMIN_ROLE && member.active && activeAdmins.length === 1
}
