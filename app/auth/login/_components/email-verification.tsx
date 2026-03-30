"use client"

import { useEffect, useRef, useState } from "react"
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button"
import { authClient } from "@/lib/auth/auth-client"

export function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  function startCountdown(time = 30) {
    // reset timer
    setTimeToNextResend(time)

    // clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // start new interval
    intervalRef.current = setInterval(() => {
      setTimeToNextResend((t) => {
        if (t <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => {
    // start countdown on mount WITHOUT triggering React warning
    const timer = setInterval(() => {
      setTimeToNextResend((t) => {
        if (t <= 1) {
          clearInterval(timer)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-4 ">
      <p className="text-sm text-muted-foreground mt-2">
        We sent you a verification link. Please check your email and click the
        link to verify your account.
      </p>

      <BetterAuthActionButton
        variant="outline"
        className="w-full h-11"
        successMessage="Verification email sent!"
        disabled={timeToNextResend > 0}
        action={async () => {
          const res = await authClient.sendVerificationEmail({
            email,
            callbackURL: "/",
          })
          if (!res.error) startCountdown()
          return res
        }}
      >
        {timeToNextResend > 0
          ? `Resend Email (${timeToNextResend})`
          : "Resend Email"}
      </BetterAuthActionButton>
    </div>
  )
}