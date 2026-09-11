import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { AdminsTable } from "@/app/components/users/admin_table";
import { UsersTableSkeleton } from "@/app/components/tables-skeleton";
import { useAdminStore } from "@/app/store/use_admin_store";
import { UserCircle } from "lucide-react";
import { useNavigate } from "react-router";

const users = () => {
  const navigate = useNavigate();
  const { admins, isLoading } = useAdminStore();

  if (isLoading && admins.length === 0) {
    return <UsersTableSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-start gap-4 p-4">
      <Button
        className="self-end cursor-pointer bg-new"
        onClick={() => navigate("/portal/users/create")}
      >
        <UserCircle />
        Create User
      </Button>
      <Card className="w-full max-w-4xl p-4">
        <AdminsTable />
      </Card>
    </div>
  );
};

export default users;
