import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { useId, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { authClient } from "@/lib/auth/auth-client"

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
  component: RouteComponent,
  validateSearch: z.object({
    token: z.string()
  })
})

function RouteComponent() {
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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex grow items-center justify-center px-4">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle className="text-center font-bold text-2xl">Reset password</CardTitle>
            <CardDescription className="text-center">
              Enter new password and confirm it to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
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
                <div className="flex flex-col space-y-1.5">
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
              </div>

              <Button className="mt-4 w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Resetting..." : "Reset password"}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button asChild className="w-full" variant="outline">
                <Link to="/login">Back to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
