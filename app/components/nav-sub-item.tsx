import { NavLink } from "react-router"
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"

export interface NavLeaf {
  title: string
  url: string
}

export function NavSubItem({ item }: { item: NavLeaf }) {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <NavLink to={item.url}>{item.title}</NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}
