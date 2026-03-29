'use client'

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";

export default function Home() {

  const { data: session, isPending: loading } = authClient.useSession()

  if (loading) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>
  }

  return (
    <div className="my-6 max-w-md mx-auto">
      <div className="text-center space-y-6">
        { session == null ? (
          <>
            <h1 className="text-3xl font-bold">Welcome to our App</h1>
            <Button asChild size="lg" className="h-10 px-8">
              <Link href="/auth/login">Sign In / Sign Up</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome { session.user.name }</h1>
            <BetterAuthActionButton 
              size="lg" 
              className="h-10 px-8" 
              variant="destructive" 
              action = { () => authClient.signOut() }
            >
              Sign Out
            </BetterAuthActionButton>
          </>
        ) }
      </div>
    </div>
  );
}
