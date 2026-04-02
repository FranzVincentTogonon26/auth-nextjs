"use client"

import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' 
import { toast } from "sonner"
import { authClient } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'
import { Passkey } from '@better-auth/passkey'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button'
import { useState } from 'react'

const passkeySchema = z.object({
  name: z.string().min(1),
})

type PasskeyForm   = z.infer<typeof passkeySchema >

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }){

    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const form = useForm<PasskeyForm>({
        resolver: zodResolver(passkeySchema),
         defaultValues: {
            name: "",
        },
    })

    const { isSubmitting } = form.formState

    async function handleAddPasskey(data: PasskeyForm) {
      await authClient.passkey.addPasskey(data, {
        onError: error => {
          toast.error(error.error.message || "Failed to add passkey")
        },
        onSuccess: () => {
          router.refresh()
          setIsDialogOpen(false)
        },
      })
    }

    function handleDeletePasskey(passkeyId: string) {
      return authClient.passkey.deletePasskey(
        { id: passkeyId },
        { onSuccess: () => router.refresh() }
      )
    }

    return (
      <div className="space-y-6">
        {passkeys.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No passkeys yet</CardTitle>
              <CardDescription>
                Add your first passkey for secure, passwordless authentication.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {passkeys.map(passkey => (
              <Card key={passkey.id}>
                <CardHeader className="flex gap-2 items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>{passkey.name}</CardTitle>
                    <CardDescription>
                      Created {new Date(passkey.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <BetterAuthActionButton
                    requireAreYouSure
                    variant="destructive"
                    size="icon"
                    action={() => handleDeletePasskey(passkey.id)}
                  >
                    <Trash2 />
                  </BetterAuthActionButton>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={o => {
          if (o) form.reset()
          setIsDialogOpen(o)
        }}
      >
        <DialogTrigger asChild>
          <Button className='w-full h-10!'>New Passkey</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Passkey</DialogTitle>
            <DialogDescription>Create a new passkey for secure, passwordless authentication.</DialogDescription>
          </DialogHeader>
          <form className="" onSubmit={form.handleSubmit(handleAddPasskey)}>
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
                      autoComplete="webauthn"
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
                          Adding...
                      </>
                    ) : (
                      <>
                          Add
                      </>
                    )

                    }
                  </Button>
              </div>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    )
}