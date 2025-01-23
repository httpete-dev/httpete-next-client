"use client"

import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"
import { BitbucketIcon, GitHubIcon, GoogleIcon } from "~/components/icons/bitbucket"
import axios, { Axios, AxiosHeaders } from "axios"
import { config } from "process"
import { signIn } from "next-auth/react"
import Image from "next/image";

const particleAnimation = `
  @keyframes moveParticle {
    0% { transform: translate(0, 0); }
    100% { transform: translate(var(--move-x), var(--move-y)); }
  }

  @keyframes flash {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
`

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const register = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulating API request
    setIsLoading(false)
  }

  const registerOAuth = (provider: string) => {
    setIsLoading(true)
    signIn(provider)
      .then(res => { 
        console.log('oauth res', res);
      })
      .catch(err => { 
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
      <Image style={{}} src="https://utfs.io/f/5VzIfIO6yTtGnHrN3BtGQJcDXfzP96NBie4G3S2vqupKLw58" alt="HttPete Logo" width={300} height={40} className="mr-4" />
      <Card className="w-full max-w-md bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Sign up to HttPete</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={register} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-white text-black shadow-md hover:shadow-lg transition-shadow"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-white hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => registerOAuth('GitHub')}
                className="bg-white hover:bg-gray-600 text-white"
              >
                <GitHubIcon size={5} />
                <span style={{color: 'black'}} >GitHub</span>
              </Button>
              <Button
                type="button"
                onClick={() => registerOAuth('Bitbucket')}
                className="bg-white hover:bg-gray-600 text-white"
              >
                <BitbucketIcon size={5} />
                <span style={{color: 'black'}} >Bitbucket</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => registerOAuth('Google')}
                className="bg-white hover:bg-gray-600 text-white"
              >
                <GoogleIcon size={5} />
                <span style={{color: 'black'}} >Google</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-coral-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )}
    </div>
  )
}