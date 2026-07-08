import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "~/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { NavLink } from "react-router"
import { NavSubItem, type NavLeaf } from "./nav-sub-item"
import { NavSubGroup, type NavSubGroupData } from "./nav-sub-group"

export interface NavMainItem {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: NavLeaf[]
  groups?: NavSubGroupData[]
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                {isCollapsed ? (
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <NavLink to={item.url}>
                      {item.icon}
                      <span className="hidden">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon}
                    <span>{item.title}</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.groups?.map((group) => (
                    <NavSubGroup key={group.title} group={group} />
                  ))}
                  {item.items?.map((subItem) => (
                    <NavSubItem key={subItem.title} item={subItem} />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
