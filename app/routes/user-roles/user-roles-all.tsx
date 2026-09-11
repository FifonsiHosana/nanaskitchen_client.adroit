import React from "react"
import UserRoleTable from "../../components/user-role-table"
import { RolesTableSkeleton } from "../../components/tables-skeleton"
import { useRolesStore } from "../../store/use_roles_store"

const UserRolesAll = () => {
  const { roles, isLoading } = useRolesStore()

  if (isLoading && roles.length === 0) {
    return <RolesTableSkeleton />
  }

  return (
    <div className="p-4">
      <UserRoleTable />
    </div>
  )
}

export default UserRolesAll
