import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleLogin } from '@react-oauth/google'
import { Mail, Lock, Github, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onLoginSuccess: (user: any) => void
  error?: string
  onErrorClear?: () => void
}

export function LoginForm({
  className,
  onLoginSuccess,
  error,
  onErrorClear,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log('Google JWT Token:', credentialResponse.credential)
    document.cookie = `google_token=${credentialResponse.credential}; max-age=3600; path=/`
    const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
    console.log('Decoded User Data:', decoded)
    localStorage.setItem('user', JSON.stringify(decoded))
    localStorage.setItem('auth_token', credentialResponse.credential)
    onLoginSuccess(decoded)
  }

  const handleGoogleError = () => {
    if (onErrorClear) onErrorClear()
    alert('Google login failed. Please try again.')
  }

  const handleGitHubLogin = (e: React.MouseEvent) => {
    e.preventDefault()
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=http://localhost:3001/auth/github/callback&scope=user&prompt=consent`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login process
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className={cn("flex flex-col gap-6 min-h-screen items-center justify-center p-4", className)} {...props}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black" />
      
      {/* Floating elements for visual appeal */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-40 w-28 h-28 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500" />
      
      <Card className="relative w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-lg dark:bg-gray-900/80 animate-fade-in-up">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center mb-4 shadow-lg animate-float">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-in slide-in-from-top-2">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-gray-200 focus:border-gray-800 focus:ring-gray-800 transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-gray-800 focus:ring-gray-800 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]" 
                type="button" 
                onClick={handleGitHubLogin}
              >
                <Github className="w-5 h-5 mr-2" />
                Continue with GitHub
              </Button>
            </div>
          </form>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <a href="#" className="text-gray-800 hover:text-gray-600 font-medium transition-colors duration-200">
                Sign up for free
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
