import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useId, useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/auth-client"

const forgotPasswordSchema = z.object({
  email: z.string().email()
})

export const Route = createFileRoute("/_auth/forgot-password")({
  component: RouteComponent
})

function RouteComponent() {
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
      <div className="flex min-h-screen flex-col">
        <div className="flex grow items-center justify-center px-4">
          <Card className="w-full max-w-[400px]">
            <CardHeader>
              <CardTitle className="text-center font-bold text-2xl">Check your email</CardTitle>
              <CardDescription className="text-center">
                We&apos;ve sent a password reset link to your email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>If you don&apos;t see the email, check your spam folder.</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex grow items-center justify-center px-4">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <CardTitle className="text-center font-bold text-2xl">Forgot password</CardTitle>
            <CardDescription className="text-center">Enter your email to reset your password</CardDescription>
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
              </div>
              <Button className="mt-4 w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Sending..." : "Send reset link"}
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
