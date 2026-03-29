'use client'

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SignUpTab } from "./_components/sign-up-tab";
import { SignInTab } from "./_components/sign-in-tab";
import { SocialAuthButtons } from "./_components/social-auth-buttons";
import { EmailVerification } from "./_components/email-verification";
import { ForgotPassword } from "./_components/forgot-password";

type Tabs = "signin" | "signup" | "email-verification" | "forgot-password"

export default function LoginPage() {

  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<Tabs>('signin')
  const [email, setEmail] = useState("")

  useEffect(() => {
    authClient.getSession().then(session => {
      if (session.data != null) router.push("/")
    })
  }, [router])

  function openEmailVerificationTab( email: string ){
    setEmail(email)
    setSelectedTab("email-verification")
  }


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
              <SignInTab 
                openEmailVerificationTab={openEmailVerificationTab}
                openForgotPassword={() => setSelectedTab("forgot-password")}
              />
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
              <SignUpTab openEmailVerificationTab={openEmailVerificationTab} />
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-3">
              <SocialAuthButtons />
            </CardFooter>
          </Card>
        </TabsContent>     

        {/* Email Verification */}
        <TabsContent value="email-verification" >
          <Card className="w-full ">
            <CardHeader>
              <CardTitle className="text-2xl py-1">Verify Your Email</CardTitle>
            </CardHeader>
            <CardContent>
              <EmailVerification email={email} />
            </CardContent>
          </Card>
        </TabsContent>     

        {/* Forgot Password */}
        <TabsContent value="forgot-password" >
          <Card className="w-full ">
            <CardHeader>
              <CardTitle className="text-2xl py-1">Forgot Password</CardTitle>
            </CardHeader>
            <CardContent>
              <ForgotPassword openSignInTab={() => setSelectedTab("signin")} />
            </CardContent>
          </Card>
        </TabsContent>   

    </Tabs>
    </div>
  );
}
