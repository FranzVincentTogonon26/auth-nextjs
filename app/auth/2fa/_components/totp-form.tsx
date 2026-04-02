"use client"

import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' 
import { toast } from "sonner"
import { authClient } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const totpSchema = z.object({
  code: z.string().length(1),
})

type TotpForm  = z.infer<typeof totpSchema >

export function TotpForm(){

    const router = useRouter()
    const form = useForm<TotpForm >({
        resolver: zodResolver(totpSchema),
         defaultValues: {
            code: "",
        },
    })

    const { isSubmitting } = form.formState

    async function handleTotpVerification(data: TotpForm) {
        await authClient.twoFactor.verifyTotp(data, {
        onError: error => {
            toast.error(error.error.message || "Failed to verify code")
        },
        onSuccess: () => {
            router.push("/")
        },
        })
    }

    return (
        <form className="" onSubmit={form.handleSubmit(handleTotpVerification)}>
          <FieldGroup>
            <div className="space-y-10 mt-5">
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} >
                  <FieldLabel> Code </FieldLabel>
                  <Input
                    {...field}
                    className='h-10 border-0'
                    type='text'
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
                        Verifiying...
                    </>
                   ) : (
                    <>
                        Verify
                    </>
                   )

                   }
                </Button>
            </div>
          </FieldGroup>
        </form>
    )
}