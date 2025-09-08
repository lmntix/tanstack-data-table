import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { useId, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/ui/loading-button"
import { authClient } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const Route = createFileRoute("/_auth/login")({
  component: LoginForm
})

function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [pendingCredentials, setPendingCredentials] = useState(false)
  const emailId = useId()
  const passwordId = useId()

  const router = useRouter()

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    onSubmit: async ({ value }) => {
      // Validate using Zod
      const result = loginSchema.safeParse(value)
      if (!result.success) {
        // Handle validation errors
        result.error.issues.forEach((issue) => {
          toast.error(issue.message)
        })
        return
      }

      setPendingCredentials(true)
      try {
        await authClient.signIn.email(
          {
            email: result.data.email,
            password: result.data.password
          },
          {
            onSuccess: async () => {
              toast.success("Login successful")
              router.navigate({ to: "/dashboard" })
            },
            onError: async (ctx) => {
              toast.error(ctx.error.message ?? "Something went wrong.")
            }
          }
        )
      } catch {
        toast.error("Login failed. Please try again.")
      } finally {
        setPendingCredentials(false)
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
        <h1 className="font-bold text-2xl">Login to your account</h1>
        <p className="text-balance text-muted-foreground text-sm">Enter your email below to login to your account</p>
      </div>
      <div className="grid gap-6">
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
                  placeholder="m@example.com"
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
          <div className="flex items-center">
            <Label htmlFor={passwordId}>Password</Label>
            <Link className="ml-auto text-sm underline-offset-4 hover:underline" to="/forgot-password">
              Forgot your password?
            </Link>
          </div>
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
                  autoComplete="current-password"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-destructive text-sm">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <LoadingButton pending={pendingCredentials}>Login</LoadingButton>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link className="underline underline-offset-4" to="/register">
          Sign up
        </Link>
      </div>
    </form>
  )
}
