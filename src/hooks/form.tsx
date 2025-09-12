import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { SelectField } from "@/lib/form/select-field"
import { SubmitButton } from "@/lib/form/submit-button"
import { TextField } from "@/lib/form/text-field"

export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField
  },
  formComponents: {
    SubmitButton
  },
  fieldContext,
  formContext
})
