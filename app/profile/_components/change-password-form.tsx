"use client"

import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' 
import { authClient } from '@/lib/auth/auth-client'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
  revokeOtherSessions: z.boolean(),
})

type ChangePasswordForm  = z.infer<typeof changePasswordSchema>

export function ChangePasswordForm(){

    const form = useForm<ChangePasswordForm >({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            revokeOtherSessions: true,
        }
    })

     async function handlePasswordChange(data: ChangePasswordForm) {
        await authClient.changePassword(data, {
        onError: error => {
            toast.error(error.error.message || "Failed to change password")
        },
        onSuccess: () => {
            toast.success("Password changed successfully")
            form.reset()
        },
        })
    }
    
    const { isSubmitting } = form.formState

    return (
        <form className="" onSubmit={form.handleSubmit(handlePasswordChange)}>
          <FieldGroup>
            <div className="space-y-5 mt-5">
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} >
                  <FieldLabel> Current Password </FieldLabel>
                  <Input
                    {...field}
                    className='h-10 border-0'
                    type='password'
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} >
                  <FieldLabel> New Password </FieldLabel>
                  <Input
                    {...field}
                    className='h-10 border-0'
                    type='password'
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="revokeOtherSessions"
              control={form.control}
              render={({ field }) => (
                <FieldGroup className="w-full">
                    <Field orientation="horizontal">
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <FieldLabel>Log out other sessions</FieldLabel>
                    </Field>
                </FieldGroup>
              )}
            />
            </div>
            <div className="flex w-full gap-2 py-1">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-black border-t-white/2 rounded-full animate-spin" />
                            Changing..
                        </div>
                    ) : (
                        'Change Password'
                    )}
                </Button>
            </div>
          </FieldGroup>
        </form>
    )
}