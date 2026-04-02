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

const backupCodeSchema = z.object({
  code: z.string().min(1),
})

type BackupCodeForm = z.infer<typeof backupCodeSchema>

export function BackupCodeTab(){

    const router = useRouter()
    const form = useForm<BackupCodeForm >({
        resolver: zodResolver(backupCodeSchema),
         defaultValues: {
            code: "",
        },
    })

    const { isSubmitting } = form.formState

    async function handleBackupCodeVerification(data: BackupCodeForm) {
        await authClient.twoFactor.verifyBackupCode(data, {
        onError: error => {
            toast.error(error.error.message || "Failed to verify code")
        },
        onSuccess: () => {
            router.push("/")
        },
        })
    }

    return (
        <form className="" onSubmit={form.handleSubmit(handleBackupCodeVerification)}>
          <FieldGroup>
            <div className="space-y-10 mt-5">
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} >
                  <FieldLabel> Backup Code </FieldLabel>
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