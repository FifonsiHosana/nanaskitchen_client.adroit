import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePermissionsStore } from "@/app/store/v2/use-permissions-store";
import { useAdminStore } from "@/app/store/use_admin_store";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  roleId: z.coerce.number({ error: "Please select a role" }),
});

type FormValues = z.infer<typeof formSchema>;

interface Role {
  id: number;
  name: string;
}

export function CreateAdminForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const navigate = useNavigate();
  // const [roles, setRoles] = React.useState<Role[]>([]);
  // const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { roles, rolesLoaded, fetchRoles } = usePermissionsStore();
  const { createAdmin, isLoading, error: adminError } = useAdminStore();

  React.useEffect(() => {
    fetchRoles();
  }, []);

  async function onSubmit(data: FormValues) {
    const success = await createAdmin(data);
    if (!success) return;

    navigate("/portal/users");
  }

  return (
    <form
      className={cn("w-full space-y-5", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      {/* Ensure FieldGroup fills full parent width */}
      <FieldGroup className="w-full space-y-4">
        {/* Grid setup without horizontal margin leaks */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <Field className="flex w-full flex-col gap-1.5">
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              {...register("name")}
              id="name"
              placeholder="John Doe"
              className="w-full h-12"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </Field>

          <Field className="flex w-full flex-col gap-1.5">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="m@example.com"
              className="w-full h-12"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </Field>
        </div>

        <Field className="flex w-full flex-col gap-1.5">
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <Controller
            name="roleId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : undefined}
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.roleId && (
            <p className="text-xs font-medium text-destructive">
              {errors.roleId.message}
            </p>
          )}
        </Field>

        <Field className="flex w-full flex-col gap-1.5">
          <FieldLabel htmlFor="password-text">Password</FieldLabel>
          <Input
            {...register("password")}
            id="password-text"
            type="text"
            placeholder="••••••••"
            className="w-full h-12"
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-xs font-medium text-destructive">
              {errors.password.message}
            </p>
          )}
        </Field>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-xs font-medium text-destructive">
            {error}
          </div>
        )}

        <Button
          className="w-full cursor-pointer"
          size="lg"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Admin"}
        </Button>
      </FieldGroup>
    </form>
  );
}
