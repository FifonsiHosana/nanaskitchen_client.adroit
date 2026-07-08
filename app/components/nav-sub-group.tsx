import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { NavSubItem, type NavLeaf } from "./nav-sub-item"

export interface NavSubGroupData {
  title: string
  items: NavLeaf[]
}

export function NavSubGroup({ group }: { group: NavSubGroupData }) {
  return (
    <Collapsible className="group/subcollapsible">
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton>
            <span>{group.title}</span>
            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {group.items.map((item) => (
              <NavSubItem key={item.title} item={item} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  )
}
