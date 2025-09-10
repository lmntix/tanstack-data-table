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

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password")
})

type SignUpFormData = z.infer<typeof signUpSchema>

export const Route = createFileRoute("/_auth/register")({
  component: RegisterForm
})

function RegisterForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const signUp = async (data: SignUpFormData) => {
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords don't match")
    }

    const { error, data: response } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name
    })

    if (error) {
      throw new Error(error.message)
    }

    return response
  }

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Your account has been created. Check your email for a verification link.")

      queryClient.resetQueries()
      navigate({ to: "/login" })
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.")
    }
  })

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
    } as SignUpFormData,
    validators: {
      onSubmit: ({ value }) => {
        const result = signUpSchema.safeParse(value)
        if (!result.success) {
          const fieldErrors: Record<string, string> = {}
          result.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof SignUpFormData
            if (field) {
              fieldErrors[field] = issue.message
            }
          })
          return fieldErrors
        }
        // Additional check for password match
        if (value.password !== value.confirmPassword) {
          return { confirmPassword: "Passwords don't match" }
        }
        return undefined
      }
    },
    onSubmit: async ({ value }) => {
      await signUpMutation.mutateAsync(value)
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
        <h1 className="font-bold text-2xl">Create an account</h1>
        <p className="text-balance text-muted-foreground text-sm">Enter your details below to create your account</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor={nameId}>Name</Label>
          <form.Field
            name="name"
            validators={{
              onBlur: ({ value }) => {
                const result = signUpSchema.shape.name.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
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
              onBlur: ({ value }) => {
                const result = signUpSchema.shape.email.safeParse(value)
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
          <Label htmlFor={passwordId}>Password</Label>
          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) => {
                const result = signUpSchema.shape.password.safeParse(value)
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
              onBlur: ({ value, fieldApi }) => {
                const result = signUpSchema.shape.confirmPassword.safeParse(value)
                if (!result.success) {
                  return result.error.issues[0]?.message
                }
                const password = fieldApi.form.getFieldValue("password")
                if (password && value !== password) {
                  return "Passwords don't match"
                }
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
        <SubmitButton isSubmitting={signUpMutation.isPending}>Sign up</SubmitButton>
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
