import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useId, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoadingButton from "@/components/ui/loading-button"
import { authClient } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"

const forgotPasswordSchema = z.object({
  email: z.string().email()
})

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordForm
})

function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailId = useId()

  const form = useForm({
    defaultValues: {
      email: ""
    },
    onSubmit: async ({ value }) => {
      // Validate using Zod
      const result = forgotPasswordSchema.safeParse(value)
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          toast.error(issue.message)
        })
        return
      }

      setIsSubmitting(true)
      try {
        const { error } = await authClient.forgetPassword({
          email: result.data.email,
          redirectTo: "/reset-password"
        })
        if (error) {
          toast.error(error.message)
          return
        }
        setIsSubmitted(true)
      } catch {
        console.error("[ForgotPassword] An error occurred")
        toast.error("An error occurred. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  })

  if (isSubmitted) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <h1 className="font-bold text-2xl">Check your email</h1>
          <p className="text-balance text-muted-foreground text-sm">
            We&apos;ve sent a password reset link to your email.
          </p>
        </div>
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>If you don&apos;t see the email, check your spam folder.</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="w-full">
          <Link to="/login">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
          </Link>
        </Button>
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
        <h1 className="font-bold text-2xl">Forgot your password?</h1>
        <p className="text-balance text-muted-foreground text-sm">Enter your email to reset your password</p>
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
        <LoadingButton pending={isSubmitting}>Send reset link</LoadingButton>
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
