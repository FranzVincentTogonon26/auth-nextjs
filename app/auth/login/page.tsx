'use client'

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUpTab } from "./_components/sign-up-tab";
import { SignInTab } from "./_components/sign-in-tab";
import { SocialAuthButtons } from "./_components/social-auth-buttons";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

type Tabs = "signin" | "signup" | "email-verification" | "forgot-password"

export default function LoginPage() {

  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<Tabs>('signin')

  useEffect(() => {
    authClient.getSession().then(session => {
      if (session.data != null) router.push("/")
    })
  }, [router])


  return (
    <div className="flex items-center justify-center min-h-screen">
    <Tabs 
      value={selectedTab} 
      onValueChange={ tab => setSelectedTab( tab as Tabs)}
      className="w-full max-w-lg px-6"
    >
      { (selectedTab === 'signin' || selectedTab === 'signup') && (
      <TabsList className="grid grid-cols-2 h-10!">
        <TabsTrigger value={"signin"}>Sign In</TabsTrigger>
        <TabsTrigger value={"signup"}>Sign Up</TabsTrigger>
      </TabsList>
      )}
      
        {/* Sign In */}
        <TabsContent value="signin">
          <Card className="w-full ">
            <CardHeader>
              <CardTitle className="text-2xl py-1">Sign In</CardTitle>
              <CardDescription>
                Welcome Back
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInTab />
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-3">
              <SocialAuthButtons />
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Sign Up */}
        <TabsContent value="signup" >
          <Card className="w-full ">
            <CardHeader>
              <CardTitle className="text-2xl py-1">Sign Up</CardTitle>
              <CardDescription>
                Create an Account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignUpTab />
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-3">
              <SocialAuthButtons />
          </CardFooter>
          </Card>
        </TabsContent>     

    </Tabs>
    </div>
  );
}
