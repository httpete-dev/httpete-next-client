'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import Image  from "next/image"

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    // TODO: Implement actual password reset logic here
    // This is a placeholder to simulate the process

    setIsLoading(false)
    setMessage('If an account exists for this email, you will receive a password reset link shortly.')
  }

  return (
    <>
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
    <Image style={{}} src="https://utfs.io/f/5VzIfIO6yTtGnHrN3BtGQJcDXfzP96NBie4G3S2vqupKLw58" alt="HttPete Logo" width={300} height={40} className="mr-4" />
      <Card className="w-full max-w-md bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Forgot Password</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Button
                type="submit"
                className="w-full bg-red-500 text-white shadow-md hover:text-black hover:bg-white hover:shadow-lg transition-shadow"
                disabled={isLoading}
                >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </form>
            {message && (
                <p className="mt-4 text-sm text-green-400 text-center">{message}</p>
            )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-coral-500 hover:underline">
              Back to Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
    </>

  )
}