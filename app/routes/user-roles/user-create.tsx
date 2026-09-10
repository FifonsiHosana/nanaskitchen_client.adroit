import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { CreateAdminForm } from "@/app/components/users/create_user_form";
import { UserCircle } from "lucide-react";
import { useNavigate } from "react-router";

const UserCreate = () => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-6">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <UserCircle className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Create New Admin
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Fill in the details below to grant administrator access.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <CreateAdminForm className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCreate;
