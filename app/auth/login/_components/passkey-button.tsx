"use client"

import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function PasskeyButton() {
  const router = useRouter()
  const { refetch } = authClient.useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handlePasskeySignIn = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const res = await authClient.signIn.passkey(
        { autoFill: false },
        {
          onSuccess: () => {
            refetch()
            router.push("/")
          },
        }
      )

      if (res.error) {
        console.error("Passkey error:", res.error.message)
      }
    } catch (err) {
      console.error("Passkey exception:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full h-11!"
      onClick={handlePasskeySignIn}
      disabled={isLoading}
    >
      {isLoading ? "Authenticating..." : "Use Passkey"}
    </Button>
  )
}
