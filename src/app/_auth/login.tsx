import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useId } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { authClient } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters")
})

type LoginFormData = z.infer<typeof loginSchema>

export const Route = createFileRoute("/_auth/login")({
  component: LoginForm
})

function LoginForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const login = async (data: LoginFormData) => {
    const { error, data: response } = await authClient.signIn.email({
      email: data.email,
      password: data.password
    })

    if (error) {
      throw new Error(error.message)
    }

    return response
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      toast.success(`Hey ${response.user.name}, welcome back!`)

      queryClient.resetQueries()
      navigate({ to: "/dashboard" })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to login. Please try again.")
    }
  })

  const emailId = useId()
  const passwordId = useId()

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    } as LoginFormData,
    validators: {
      onSubmit: ({ value }) => {
        const result = loginSchema.safeParse(value)
        if (!result.success) {
          const fieldErrors: Record<string, string> = {}
          result.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof LoginFormData
            if (field) {
              fieldErrors[field] = issue.message
            }
          })
          return fieldErrors
        }
        return undefined
      }
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value)
    }
  })

  return (
    <form
      className={cn("flex flex-col gap-6")}
      onSubmit={(e) => {
        e.preventDefault()

        form.handleSubmit()
      }}
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
              onBlur: ({ value }) => {
                const result = loginSchema.shape.email.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
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
              onBlur: ({ value }) => {
                const result = loginSchema.shape.password.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
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
        <SubmitButton isSubmitting={loginMutation.isPending}>Login</SubmitButton>
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
