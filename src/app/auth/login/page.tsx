import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import * as dotenv from 'dotenv';
import {  Env } from "~/model"
import LoginForm from "~/components/login-form"
import Image from "next/image";

// Load environment variables from .env file
dotenv.config();
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

type PageProps = {
  env: Env
}

type TokenVerificationResponse = {
  tokenIsValid: boolean,
}

const LoginPage = async () => {

  const env: Env = {
    NODE_ENV: 'development',
    AUTH_SECRET: 'asdasfas',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? "",
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white overflow-hidden">
      <Image style={{}} src="https://utfs.io/f/5VzIfIO6yTtGnHrN3BtGQJcDXfzP96NBie4G3S2vqupKLw58" alt="HttPete Logo" width={300} height={40} className="mr-4" />
      <Card className="w-full max-w-md bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Login to HttPete</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm env={env} />
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
    </div>
  )
}

export default LoginPage;