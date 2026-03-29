"use client"

import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' 
import { authClient } from '@/lib/auth/auth-client'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const forgotPasswordSchema = z.object({
  email: z.email().min(1),
})

type ForgotPasswordForm  = z.infer<typeof forgotPasswordSchema>

export function ForgotPassword(
  { openSignInTab } : { openSignInTab: () => void }
){

    const form = useForm<ForgotPasswordForm >({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        }
    })

    async function handleForgotPassword(data: ForgotPasswordForm) {
        await authClient.requestPasswordReset(
            {
                ...data,
                redirectTo: "/auth/reset-password",
            },
            {
                onError: error => {
                toast.error(
                    error.error.message || "Failed to send password reset email"
                )
                },
                onSuccess: () => {
                toast.success("Password reset email sent")
                },
            }
        )
    }
    
    const { isSubmitting } = form.formState

    return (
        <form className="" onSubmit={form.handleSubmit(handleForgotPassword)}>
          <FieldGroup>
            <div className="space-y-5 mt-5">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} >
                  <FieldLabel> Email </FieldLabel>
                  <Input
                    {...field}
                    className='h-10 border-0'
                    type='email'
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            </div>
            <div className="flex w-full gap-2 py-1">
                <Button
                    type="button"
                    variant="outline"
                    onClick={openSignInTab}
                    className="w-1/2 h-11"
                >
                    Back
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 h-11"
                >
                    {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black border-t-white/2 rounded-full animate-spin" />
                        Sending..
                    </div>
                    ) : (
                    'Send Reset Email'
                    )}
                </Button>
            </div>
          </FieldGroup>
        </form>
    )
}