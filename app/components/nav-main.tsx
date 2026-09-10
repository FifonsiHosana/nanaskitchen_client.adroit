// import { useEffect, useState } from "react";
import { ChevronRightIcon } from "lucide-react";
// import { Link, matchPath, useLocation } from "react-router";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  // SidebarGroupLabel,
  SidebarMenu,
  // SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "~/components/ui/sidebar";
// import { ChevronRightIcon } from "lucide-react"
import { NavLink } from "react-router";
// import { NavSubItem, type NavLeaf } from "./nav-sub-item";
// import { NavSubGroup, type NavSubGroupData } from "./nav-sub-group";

export interface NavNode {
  title: string;
  url?: string; // omit for a pure grouping label (non-clickable header)
  icon?: React.ReactNode; // only meaningful at depth 0
  isActive?: boolean;
  children?: NavNode[];
}

export function NavMain({ items }: { items: NavNode[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <NavTreeItem key={item.title} node={item} depth={0} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavTreeItem({ node, depth }: { node: NavNode; depth: number }) {
  const { state } = useSidebar();
  const isCollapsed = depth === 0 && state === "collapsed";
  const hasChildren = !!node.children?.length;

  if (!hasChildren) {
    if (depth === 0) {
      return (
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip={node.title} asChild>
            <NavLink to={node.url!}>
              {node.icon}
              <span>{node.title}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
    return (
      <SidebarMenuSubItem>
        {/* Changed: Added size="sm" to reduce sub-item height */}
        <SidebarMenuSubButton asChild>
          <NavLink to={node.url!}>
            <span>{node.title}</span>
          </NavLink>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  // Collapsed rail: icon+link only regardless of depth.
  if (isCollapsed) {
    return (
      <SidebarMenuItem>
        {/* Changed: Added size="sm" to keep collapsed icons consistent */}
        <SidebarMenuButton size="lg" tooltip={node.title} asChild>
          <NavLink to={node.url ?? node.children![0].url ?? "#"}>
            {node.icon}
            <span className="hidden">{node.title}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Expanded, depth 0, branch node: static label, children always shown.
  if (depth === 0) {
    return (
      <SidebarMenuItem>
        {/* Changed: Adjusted py-1.5 to py-1 to make the static header shorter */}
        <div className="flex items-center gap-2 px-2 py-1 text-sidebar-foreground/70 text-xs font-medium pt-9">
          {node.icon}
          <span>{node.title}</span>
        </div>
        <SidebarMenuSub>
          {node.children!.map((child) => (
            <NavTreeItem key={child.title} node={child} depth={depth + 1} />
          ))}
        </SidebarMenuSub>
      </SidebarMenuItem>
    );
  }

  // Nested branch nodes (price-group groupings etc.) keep collapsible behavior.
  return (
    <Collapsible defaultOpen={node.isActive} className="group/collapsible">
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          {/* Changed: Added size="sm" to reduce nested folder button height */}
          <SidebarMenuSubButton size="md">
            <span>{node.title}</span>
            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {node.children!.map((child) => (
              <NavTreeItem key={child.title} node={child} depth={depth + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  );
}
