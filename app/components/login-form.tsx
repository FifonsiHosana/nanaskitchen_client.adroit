import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import logo from "~/assets/nanaslogo.png"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { api } from "../lib/axios"
import { useAuthStore } from "../store/use_auth_store"
import { useEffect, type SyntheticEvent } from "react"
import { useLocation, useNavigate } from "react-router"
import logoDark from "~/assets/nana-logo-dark.png"

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export interface Admin {
  email: string
  password: string
}

type FormValues = z.infer<typeof formSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { register, setValue, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const { loginUser, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  // redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (token) navigate("/portal", { replace: true })
  }, [])

  async function onSubmit(data: FormValues) {
    await loginUser({ email: data.email, password: data.password })
    const token = localStorage.getItem("userToken")
    if (token) {
      navigate("/portal", { replace: true })
    }
  }

  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (token && location.pathname !== "/portal")
      navigate("/portal", { replace: true })
    // console.log("pass")
  }, [location.pathname])

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("validation errors:", errors)
      )}
      {...props}
    >
      {" "}
      <div className="mx-4 flex items-center justify-center">
        <div className="object-contain">
          <img
            draggable={false}
            className="h-15"
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
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input
            {...register("password")}
            id="password"
            type="password"
            required
          />
        </Field>
        <Field>
          <Button className="cursor-pointer" type="submit">
            {isLoading ? "login in..." : "Login"}
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
  )
}
