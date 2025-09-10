import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { AlertCircle } from "lucide-react"
import { useId } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { SubmitButton } from "@/components/ui/submit-button"
import { authClient } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"

const resetPasswordSchema = z.object({
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password")
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPasswordForm,
  validateSearch: z.object({
    token: z.string().optional()
  })
})

function ResetPasswordForm() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()

  const resetPassword = async (data: ResetPasswordFormData) => {
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords don't match")
    }

    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  }

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successful")
      navigate({ to: "/login" })
    },
    onError: (error) => {
      toast.error(error.message || "Password reset failed. Please try again.")
    }
  })

  const passwordId = useId()
  const confirmPasswordId = useId()

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: ""
    } as ResetPasswordFormData,
    validators: {
      onSubmit: ({ value }) => {
        const result = resetPasswordSchema.safeParse(value)
        if (!result.success) {
          const fieldErrors: Record<string, string> = {}
          result.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof ResetPasswordFormData
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
      await resetPasswordMutation.mutateAsync(value)
    }
  })

  // Show error if token is missing
  if (!token) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h1 className="font-bold text-2xl">Invalid reset link</h1>
          <p className="text-balance text-muted-foreground text-sm">The password reset token is missing or invalid.</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This reset link is invalid or has expired. Please request a new password reset.
          </AlertDescription>
        </Alert>
        <div className="grid gap-2">
          <Button asChild className="w-full">
            <Link to="/forgot-password">Request new reset link</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Back to login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      className={cn("flex flex-col gap-6")}
      onSubmit={(e) => {
        e.preventDefault()

        form.handleSubmit()
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl">Reset your password</h1>
        <p className="text-balance text-muted-foreground text-sm">
          Enter new password and confirm it to reset your password
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor={passwordId}>New password</Label>
          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) => {
                const result = resetPasswordSchema.shape.password.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              }
            }}
          >
            {(field) => (
              <div>
                <PasswordInput
                  id={passwordId}
                  placeholder="Enter new password"
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
          <Label htmlFor={confirmPasswordId}>Confirm password</Label>
          <form.Field
            name="confirmPassword"
            validators={{
              onBlur: ({ value, fieldApi }) => {
                const result = resetPasswordSchema.shape.confirmPassword.safeParse(value)
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
                <PasswordInput
                  id={confirmPasswordId}
                  placeholder="Confirm new password"
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
        <SubmitButton isSubmitting={resetPasswordMutation.isPending}>Reset password</SubmitButton>
      </div>

      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link className="underline underline-offset-4" to="/login">
          Back to login
        </Link>
      </div>
    </form>
  )
}
