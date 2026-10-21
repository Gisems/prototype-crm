import { LogOut } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router"

import { useSignOut } from "core/hooks/mutation/use-mutation-auth"
import { useSession } from "core/hooks/query/use-query-auth"
import { useProfile } from "core/hooks/query/use-query-profile"
import { menu } from "router/menu"
import { PATHS } from "router/paths"
import { BrandLogo } from "shared/components/custom/brand-logo"
import { UserAvatar } from "shared/components/custom/user-avatar"
import { Button } from "shared/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "shared/components/ui/sidebar"

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useSession()
  const { data: profile } = useProfile()
  // El perfil trae el nombre que la persona eligió; hasta que carga, el de la sesión.
  const name = profile?.name ?? user?.name ?? ""
  const signOut = useSignOut()
  const { setOpenMobile } = useSidebar()

  async function onSignOut() {
    await signOut()
    await navigate(PATHS.LOGIN, { replace: true })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5 group-data-[collapsible=icon]:px-1">
        <BrandLogo variant="inverse" />
      </SidebarHeader>

      <SidebarContent>
        {menu.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide text-sidebar-foreground/50 uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    {item.soon ? (
                      <SidebarMenuButton disabled tooltip={`${item.label} (próximamente)`} className="opacity-50">
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        render={<Link to={item.href} onClick={() => setOpenMobile(false)} />}
                        isActive={location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)}
                        tooltip={item.label}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 group-data-[collapsible=icon]:px-1">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
          <Link
            to={PATHS.MY_ACCOUNT}
            onClick={() => setOpenMobile(false)}
            title="Mi cuenta"
            aria-current={location.pathname === PATHS.MY_ACCOUNT ? "page" : undefined}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg py-1 pr-1 pl-2 transition-colors outline-none group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:px-1 hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring aria-[current=page]:bg-sidebar-accent"
          >
            <UserAvatar name={name} tone={profile?.avatarColor ?? "primary"} className="size-9 text-sm" />
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold">{name}</p>
              {profile && (
                <p className="flex items-center gap-1.5 text-xs text-sidebar-foreground/70">
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${profile.status === "available" ? "bg-success" : "bg-sidebar-foreground/40"}`}
                  />
                  {profile.status === "available" ? "Disponible" : "Ausente"}
                </p>
              )}
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void onSignOut()}
            aria-label="Cerrar sesión"
            className="ml-auto text-sidebar-foreground group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
