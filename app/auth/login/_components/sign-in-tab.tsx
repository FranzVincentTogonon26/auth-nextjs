"use client"

import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' 
import { authClient } from '@/lib/auth/auth-client'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

const signInSchema = z.object({
    email: z.email().min(1),
    password: z.string().min(6),
})

type SignInForm = z.infer<typeof signInSchema>

export function SignInTab(
  {
    openEmailVerificationTab,
    openForgotPassword
  } : {
    openEmailVerificationTab: (email: string) => void
    openForgotPassword: () => void
  }
){

    const router = useRouter()

    const form = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "", 
        }
    })

    async function handleSignIn(data: SignInForm){
      await authClient.signIn.email(
        { ...data, callbackURL: '/'},
        {
          onError: error => {
            if (error.error.code === "EMAIL_NOT_VERIFIED") {
              openEmailVerificationTab(data.email)
            }
            toast.error( error.error.message || 'Failed to sign in')
          },
          onSuccess: () => {
            router.push("/")
          },
        }
      )
    }
    
    const { isSubmitting } = form.formState

    return (
        <form className="" onSubmit={form.handleSubmit(handleSignIn)}>
          <FieldGroup>
            <div className="space-y-7 mt-5">
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
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} >
                  <div className="flex justify-between">
                    <FieldLabel> Password </FieldLabel>
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={openForgotPassword}
                        className="text-sm hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
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
                        Signing in..
                    </>
                   ) : (
                    <>
                        Sign In
                    </>
                   )

                   }
                </Button>
            </div>
          </FieldGroup>
        </form>
    )
}