import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { AlertCircle } from "lucide-react"
import { useId, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/ui/loading-button"
import { PasswordInput } from "@/components/ui/password-input"
import { authClient } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPasswordForm,
  validateSearch: z.object({
    token: z.string().optional()
  })
})

function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const { token } = Route.useSearch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const passwordId = useId()
  const confirmPasswordId = useId()

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
    onSubmit: async ({ value }) => {
      // Validate using Zod
      const result = resetPasswordSchema.safeParse(value)
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          toast.error(issue.message)
        })
        return
      }

      setIsSubmitting(true)
      try {
        const { error } = await authClient.resetPassword({
          newPassword: result.data.password,
          token
        })
        if (error) {
          toast.error(error.message)
        } else {
          toast.success("Password reset successful")
          router.navigate({ to: "/login" })
        }
      } catch {
        toast.error("Password reset failed. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
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
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      {...props}
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
              onChange: ({ value }) => {
                if (!value) return "Password is required"
                if (value.length < 8) return "Password must be at least 8 characters"
                return undefined
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
        <LoadingButton pending={isSubmitting}>Reset password</LoadingButton>
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
