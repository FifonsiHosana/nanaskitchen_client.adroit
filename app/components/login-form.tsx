import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import logo from "~/assets/nanaslogo.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "../lib/axios";
import { useAuthStore } from "../store/use_auth_store";
import { useEffect, useState, type SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import logoDark from "~/assets/nana-logo-dark.png";
import { Eye, EyeIcon, EyeOff, EyeOffIcon, InfoIcon } from "lucide-react";
import { usePermissionsStore } from "../store/v2/use-permissions-store";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export interface Admin {
  email: string;
  password: string;
}

type FormValues = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { loginUser, isLoading, error, isAuthenticated } = useAuthStore();
  const { fetchPermissions } = usePermissionsStore();
  const navigate = useNavigate();

  const [viewPassword, setViewPassword] = useState(false);

  // Already logged in? Skip the form.
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/portal", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function onSubmit(data: FormValues) {
    const success = await loginUser({
      email: data.email,
      password: data.password,
    });
    if (!success) return;

    await fetchPermissions();
    navigate("/portal", { replace: true });
  }

  return (
    <form
      className={cn("flex flex-col gap-6 text-2xl", className)}
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("validation errors:", errors),
      )}
      {...props}
    >
      {" "}
      <div className="mx-4  flex items-center justify-center">
        <div className="object-contain">
          <img
            draggable={false}
            className="h-18"
            src={logoDark}
            alt="Nana Logo"
          />
        </div>
      </div>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            {...register("email")}
            id="email"
            placeholder="m@example.com"
            required
            className="h-11 text-base py-0"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-group-url">Password</FieldLabel>
          {/* Apply h-12 directly to the outer container and reset inner input styling */}
          <InputGroup className="h-11 items-center">
            <InputGroupInput
              {...register("password")}
              className="h-full text-base py-0 placeholder:tracking-widest"
              id="password"
              type={viewPassword ? "text" : "password"}
              required
              placeholder="•••••••"
            />
            <InputGroupAddon></InputGroupAddon>
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() => setViewPassword(!viewPassword)}
            >
              {viewPassword ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <Button className="cursor-pointer h-11 font-bold uppercase text-xs" type="submit">
            {isLoading ? "login in..." :  "Login"}
          </Button>
        </Field>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <a
          href="https://adroit360.com/"
          className="m-auto text-sm underline-offset-4 hover:underline"
        >
          Forgot your password? contact support
        </a>
      </FieldGroup>
    </form>
  );
}
