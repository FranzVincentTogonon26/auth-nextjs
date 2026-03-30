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

const profileUpdateSchema  = z.object({
    name: z.string().min(1),
    email: z.email().min(1),
})

type ProfileUpdateForm  = z.infer<typeof profileUpdateSchema >

export function ProfileUpdateForm(
    { 
        user 
    } : { 
        user: {
            email: string
            name: string
        }
    }){

    const router = useRouter()
    const form = useForm<ProfileUpdateForm >({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: user
    })

    const { isSubmitting } = form.formState

    async function handleProfileUpdate(data: ProfileUpdateForm) {
        const promises = [
            authClient.updateUser({
                name: data.name
            }),
        ]

        if (data.email !== user.email) {
            promises.push(
                authClient.changeEmail({
                    newEmail: data.email,
                    callbackURL: "/profile",
                })
            )
        }

        const res = await Promise.all(promises)

        const updateUserResult = res[0]
        const emailResult = res[1] ?? { error: false }

        if (updateUserResult.error) {
            toast.error(updateUserResult.error.message || "Failed to update profile")
        } else if (emailResult.error) {
            toast.error(emailResult.error.message || "Failed to change email")
        } else {
            if (data.email !== user.email) {
                toast.success("Verify your new email address to complete the change.")
            } else {
                toast.success("Profile updated successfully")
            }

            router.refresh()
            
        }
    }

    return (
        <form className="" onSubmit={form.handleSubmit(handleProfileUpdate)}>
          <FieldGroup>
            <div className="space-y-10 mt-5">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} >
                  <FieldLabel> Name </FieldLabel>
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
            <div className="py-4">
                <Button type="submit" disabled={isSubmitting} className='w-full h-11'>
                   { isSubmitting ? (
                    <>
                        <div className='w-4 h-4 border-2 border-black border-t-white/2 rounded-full animate-spin' />
                        Updating...
                    </>
                   ) : (
                    <>
                        Update Profile
                    </>
                   )

                   }
                </Button>
            </div>
          </FieldGroup>
        </form>
    )
}