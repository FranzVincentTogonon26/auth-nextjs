'use client'

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {

  const [hasAdminPermission, setHasAdminPermission] = useState(false)
  const { data: session, isPending: loading } = authClient.useSession()

  useEffect(() => {
    authClient.admin
      .hasPermission({ permissions: { user: ["list"] } })
      .then(({ data }) => {
        setHasAdminPermission(data?.success ?? false)
      })
  }, [])

  if (loading) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>
  }

  return (
    <div className="flex justify-center items-center my-6 max-w-7xl mx-auto">
      <div className="text-center space-y-6">
        { session == null ? (
          <>
            <h1 className="text-3xl font-bold">Welcome to our App</h1>
            <Button asChild size="lg" className="h-10 px-8">
              <Link href="/auth/login">Sign In / Sign Up</Link>
            </Button>
          </>
        ) : (
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold">Welcome { session.user.name }</h1>
            <div className="space-x-2">
              <Button asChild size="lg" className="h-10 px-8">
                <Link href="/profile">Profile</Link>
              </Button>
              <Button asChild size="lg" className="h-10 px-8">
                <Link href="/organizations">Organizations</Link>
              </Button>
              {hasAdminPermission && (
                <Button asChild size="lg" className="h-10 px-8">
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <BetterAuthActionButton 
                size="lg" 
                className="h-10 px-8" 
                variant="destructive" 
                action = { () => authClient.signOut() }
              >
                Sign Out
              </BetterAuthActionButton>
            </div>
          </div>
        ) }
      </div>
    </div>
  );
}
