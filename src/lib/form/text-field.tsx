import { Eye, EyeOff } from "lucide-react"
import { JSX, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFieldContext } from "@/hooks/form"

type Props = {
  label: string | JSX.Element
  type?: "text" | "email" | "password" | "url"
  required?: boolean
  placeholder?: string
  autoComplete?: string
  helpText?: string
  withPasswordToggle?: boolean
}

export const TextField = ({
  label,
  type = "text",
  required,
  placeholder,
  autoComplete,
  helpText,
  withPasswordToggle
}: Props) => {
  const field = useFieldContext<string>()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={field.name}>
        <div className="flex items-center gap-2">
          {label}
          {required ? " *" : ""}
        </div>
      </Label>
      <div className="relative">
        <Input
          name={field.name}
          id={field.name}
          value={field.state.value ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
          type={type === "password" && withPasswordToggle ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={type === "password" && withPasswordToggle ? "pr-10" : undefined}
        />
        {type === "password" && withPasswordToggle ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((s) => !s)}
            className="-translate-y-1/2 absolute top-1/2 right-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        ) : null}
      </div>
      {helpText ? <p className="text-muted-foreground text-xs">{helpText}</p> : null}
    </div>
  )
}
