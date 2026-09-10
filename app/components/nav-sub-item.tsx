import { NavLink } from "react-router";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import type { NavSubGroupData } from "./nav-sub-group";

export interface NavLeaf {
  title: string;
  url: string;
  groups?: NavLeaf[];
}

export function NavSubItem({ item }: { item: NavLeaf }) {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <NavLink to={item.url}>{item.title}</NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
