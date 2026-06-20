import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Lock, 
  Mail, 
  Building, 
  GraduationCap, 
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'
import apiClient from '../config/axios'
import { setAuthToken } from '../utils/auth'

function Login() {
  const navigate = useNavigate()
  const [activeRole, setActiveRole] = useState('applicant')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [generalError, setGeneralError] = useState('')

  // Live validation
  useEffect(() => {
    if (!email) {
      setEmailError('')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }, [email])

  useEffect(() => {
    if (!password) {
      setPasswordError('')
      return
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
    } else {
      setPasswordError('')
    }
  }, [password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear any previous errors
    setGeneralError('')
    
    // Final validation before submit
    let isValid = true
    if (!email) {
      setEmailError('Email is required')
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address')
      isValid = false
    }
    
    if (!password) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    }
    
    if (!isValid) return
    
    try {
      setIsLoading(true)
      
      // Simulate API call (since we don't have backend yet, but the structure is there!)
      // In real implementation: const response = await apiClient.post('/auth/login', { email, password, role: activeRole })
      
      // Simulating successful login
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate a dummy token for simulation
      const dummyToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiVzIiwicm9sZSI6IiVzIiwiaWF0IjoxNzE3OTYwMDAwLCJleHAiOjE3MTg1NjQ4MDB9.dummy_signature`
      setAuthToken(dummyToken)
      
      // Redirect to dashboard
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Login failed:', error)
      if (error.response) {
        setGeneralError(error.response.data.message || 'Login failed. Please check your credentials.')
      } else {
        setGeneralError('Network error. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Panel - Branding */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex flex-col justify-between text-white hidden lg:flex">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur p-3 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PM Internship Scheme</h1>
              <p className="text-blue-100 text-sm">AI-Based Smart Allocation Engine</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <GraduationCap className="h-16 w-16 text-white/90" />
              <h2 className="text-4xl font-extrabold">Transform Your Career</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of successful interns matched with top corporate partners using our AI-powered allocation system.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <p className="text-3xl font-black">50K+</p>
                <p className="text-sm text-blue-100">Applicants</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <p className="text-3xl font-black">2K+</p>
                <p className="text-sm text-blue-100">Companies</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <p className="text-3xl font-black">95%</p>
                <p className="text-sm text-blue-100">Match Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="p-8 lg:p-12">
          <div className="mb-8 text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">PM Internship Scheme</h1>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please sign in to continue to your account</p>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{generalError}</p>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div className="flex mb-8 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => {
                setActiveRole('applicant')
                setGeneralError('')
                setEmailError('')
                setPasswordError('')
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeRole === 'applicant'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              <span>Applicant Login</span>
            </button>
            <button
              onClick={() => {
                setActiveRole('corporate')
                setGeneralError('')
                setEmailError('')
                setPasswordError('')
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeRole === 'corporate'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building className="h-5 w-5" />
              <span>Corporate Access</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${emailError ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`Enter your ${activeRole === 'applicant' ? 'student' : 'corporate'} email`}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 disabled:opacity-50 ${
                    emailError
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${passwordError ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition-all duration-300 disabled:opacity-50 ${
                    passwordError
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => navigate('/register')}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
