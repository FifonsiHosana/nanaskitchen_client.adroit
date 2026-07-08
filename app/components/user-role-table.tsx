import { User, UserKey } from "lucide-react"
import React, { useEffect } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { useRolesStore } from "../store/use_roles_store"
import { useNavigate } from "react-router"
import { Button } from "./ui/button"
import { NoPermissionDialog } from "./no-permission-dialog"

const UserRoleTable = () => {
  const { roles, fetchRoles } = useRolesStore();


  useEffect(() => {
    fetchRoles()
  }, [])

  const navigate = useNavigate()
  return (
    <Table>
      <TableCaption>All user roles.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="inline-flex items-end justify-end gap-1">
              <UserKey />
              User Role
            </div>
          </TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell className="uppercase">{role.roleName}</TableCell>
            <TableCell className="text-center">
              <Button
                onClick={() => {
                  navigate(`products/${role.id}`)
                }}
                className="cursor-pointer rounded bg-amber-500 px-4 py-2 text-white"
              >
                Edit
              </Button>
              <NoPermissionDialog>
              <Button className="ml-2 cursor-pointer rounded bg-red-500 px-4 py-2 text-white">
                Delete
              </Button>
              </NoPermissionDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default UserRoleTable
