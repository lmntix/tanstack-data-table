import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useId, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/ui/loading-button"
import { authClient } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })

export const Route = createFileRoute("/_auth/register")({
  component: RegisterForm
})

function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [pending, setPending] = useState(false)
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: async ({ value }) => {
      // Validate using Zod
      const result = signUpSchema.safeParse(value)
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          toast.error(issue.message)
        })
        return
      }

      setPending(true)
      try {
        await authClient.signUp.email(
          {
            email: result.data.email,
            password: result.data.password,
            name: result.data.name,
            callbackURL: "/auth/login"
          },
          {
            onSuccess: async () => {
              toast.info("Your account has been created. Check your email for a verification link.")
            },
            onError: async (ctx) => {
              toast.error(ctx.error.message ?? "Something went wrong.")
            }
          }
        )
      } catch {
        toast.error("Registration failed. Please try again.")
      } finally {
        setPending(false)
      }
    }
  })

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl">Create an account</h1>
        <p className="text-balance text-muted-foreground text-sm">Enter your details below to create your account</p>
      </div>
      <div className="grid gap-2">
        <div className="grid gap-2">
          <Label htmlFor={nameId}>Name</Label>
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "Name is required"
                if (value.length < 2) return "Name must be at least 2 characters"
                return undefined
              }
            }}
          >
            {(field) => (
              <div>
                <Input
                  id={nameId}
                  placeholder="Enter your name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="name"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-destructive text-sm">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <div className="grid gap-2">
          <Label htmlFor={emailId}>Email</Label>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "Email is required"
                const emailResult = z.string().email().safeParse(value)
                return emailResult.success ? undefined : "Please enter a valid email"
              }
            }}
          >
            {(field) => (
              <div>
                <Input
                  id={emailId}
                  placeholder="Enter your email"
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="email"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-destructive text-sm">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <div className="grid gap-2">
          <Label htmlFor={passwordId}>Password</Label>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "Password is required"
                if (value.length < 8) return "Password must be at least 8 characters"
                return undefined
              }
            }}
          >
            {(field) => (
              <div>
                <Input
                  id={passwordId}
                  placeholder="Enter your password"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="new-password"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-destructive text-sm">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <div className="grid gap-2">
          <Label htmlFor={confirmPasswordId}>Confirm Password</Label>
          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value, fieldApi }) => {
                if (!value) return "Please confirm your password"
                const password = fieldApi.form.getFieldValue("password")
                if (password && value !== password) return "Passwords don't match"
                return undefined
              }
            }}
          >
            {(field) => (
              <div>
                <Input
                  id={confirmPasswordId}
                  placeholder="Confirm your password"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="new-password"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-destructive text-sm">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <LoadingButton pending={pending}>Sign up</LoadingButton>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link className="underline underline-offset-4" to="/login">
          Login
        </Link>
      </div>
    </form>
  )
}
