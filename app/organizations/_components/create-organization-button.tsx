"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

const createOrganizationSchema = z.object({
  name: z.string().min(1),
})

type CreateOrganizationForm = z.infer<typeof createOrganizationSchema>

export function CreateOrganizationButton() {
  const [open, setOpen] = useState(false)
  const form = useForm<CreateOrganizationForm>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    },
  })

  const { isSubmitting } = form.formState

  async function handleCreateOrganization(data: CreateOrganizationForm) {
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
    const res = await authClient.organization.create({
      name: data.name,
      slug,
    })

    if (res.error) {
      toast.error(res.error.message || "Failed to create organization")
    } else {
      form.reset()
      setOpen(false)
      await authClient.organization.setActive({ organizationId: res.data.id })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10">Create Organization</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to collaborate with your team.
          </DialogDescription>
        </DialogHeader>
        <form className="" onSubmit={form.handleSubmit(handleCreateOrganization)}>
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
                    <Button type="submit" disabled={isSubmitting} className='w-full h-10'>
                    { isSubmitting ? (
                        <>
                            <div className='w-4 h-4 border-2 border-black border-t-white/2 rounded-full animate-spin' />
                            Creating...
                        </>
                    ) : (
                        <>
                            Create
                        </>
                    )

                    }
                    </Button>
                </div>
            </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}