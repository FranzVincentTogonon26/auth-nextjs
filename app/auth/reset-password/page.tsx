"use client"

import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' 
import { authClient } from '@/lib/auth/auth-client'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

const resetPasswordSchema = z.object({
    password: z.string().min(6),
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export default  function ResetPasswordPage(){

    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    const form = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
        }
    })
    
    const { isSubmitting } = form.formState

    async function handleResetPassword(data: ResetPasswordForm) {
        if (token == null) return

        await authClient.resetPassword(
        {
            newPassword: data.password,
            token,
        },
        {
            onError: error => {
                toast.error(error.error.message || "Failed to reset password")
            },
            onSuccess: () => {
                toast.success("Password reset successful", {
                    description: "Redirection to login...",
                })

                setTimeout(() => {
                    router.push("/auth/login")
                }, 1000)
            },
        }
        )
    }

    if (token == null || error != null) {
        return (
        <div className="flex items-center justify-center min-h-screen ">
            <Card className="w-full max-w-md mx-auto p-10 space-y-4">
            <CardHeader>
                <CardTitle className='text-2xl'>Invalid Reset Link</CardTitle>
                <CardDescription>
                The password reset link is invalid or has expired.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full h-11" asChild>
                <Link href="/auth/login">Back to Login</Link>
                </Button>
            </CardContent>
            </Card>
        </div>
        )
    }
    

    return (
        <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg mx-auto px-5">
            <CardHeader>
                <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="" onSubmit={form.handleSubmit(handleResetPassword)}>
                <FieldGroup>
                    <div className="space-y-7 mt-5">
                    <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} >
                        <FieldLabel> Password </FieldLabel>
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
                    </div>
                    <div className="py-4">
                        <Button type="submit" disabled={isSubmitting} className='w-full h-11'>
                        { isSubmitting ? (
                            <>
                                <div className='w-4 h-4 border-2 border-black border-t-white/2 rounded-full animate-spin' />
                                Resetting..
                            </>
                        ) : (
                            <>
                                Reset Password
                            </>
                        )

                        }
                        </Button>
                    </div>
                </FieldGroup>
                </form>
            </CardContent>
      </Card>
    </div>
    )
}