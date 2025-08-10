'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { z } from 'zod'

// Zod validation schema
const registerSchema = z.object({
    name: z.string()
      .min(1, "Name must be at least 1 character")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, apostrophes, and hyphens"),
    username: z.string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"),
    email: z.string().email("Please enter a valid email").max(100),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password must include upper, lower, and a number"),
    confirmPassword: z.string()
  }).refine(d => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });
  

const Register = () => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');
      
        const formData = {
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
          password
        };
      
        // validate client-side
        try {
          registerSchema.parse({ ...formData, confirmPassword });
        } catch (error) {
          if (error instanceof z.ZodError) {
            const errorMap: Record<string, string> = {};
            for (const err of error.errors) {
              const key = err.path?.[0];
              if (typeof key === 'string') errorMap[key] = err.message;
            }
            setErrors(errorMap);
            return;
          }
        }
      
        setLoading(true);
        try {
          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData),
            cache: 'no-store'
          });
      
          const data = await res.json().catch(() => ({}));
      
          if (!res.ok) {
            // handle field errors array or { error }
            if (Array.isArray(data)) {
              const errMap: Record<string, string> = {};
              for (const i of data) {
                const key = i.path?.[0];
                if (typeof key === 'string') errMap[key] = i.message ?? 'Invalid value';
              }
              setErrors(errMap);
            } else if (data?.error) {
              setErrors({ general: data.error });
            } else {
              setErrors({ general: 'Registration failed. Please try again.' });
            }
            return;
          }
      
          setSuccess('Account created successfully! You can now sign in.');
          setName(''); setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
        } catch {
          setErrors({ general: 'Registration failed. Please try again.' });
        } finally {
          setLoading(false);
        }
      };

    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4'>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card Container */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-orange-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="text-5xl mr-3">♔</div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                StrataChess
                            </h1>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                        <p className="text-gray-600">Join the chess community and start your journey</p>
                    </div>

                    {/* Error/Success Messages */}
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
                            {errors.general}
                        </div>
                    )}
                    
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder='Enter your full name' 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none bg-white/50 backdrop-blur-sm placeholder-gray-500 text-black ${
                                        errors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-400'
                                    }`}
                                    disabled={loading}
                                />
                                <div className="absolute right-3 top-3 text-gray-400">
                                    👤
                                </div>
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Username Field */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder='Enter your username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none bg-white/50 backdrop-blur-sm placeholder-gray-500 text-black ${
                                        errors.username ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-400'
                                    }`}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    placeholder='Enter your email' 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none bg-white/50 backdrop-blur-sm placeholder-gray-500 text-black ${
                                        errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-400'
                                    }`}
                                    disabled={loading}
                                />
                                <div className="absolute right-3 top-3 text-gray-400">
                                    📧
                                </div>
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Create a strong password' 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none bg-white/50 backdrop-blur-sm placeholder-gray-500 text-black ${
                                        errors.password ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-400'
                                    }`}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-orange-500 transition-colors"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password ? (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            ) : (
                                <div className="mt-1 text-xs text-gray-500">
                                    Must contain uppercase, lowercase, number, and be at least 8 characters
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder='Confirm your password' 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none bg-white/50 backdrop-blur-sm placeholder-gray-500 text-black ${
                                        errors.confirmPassword ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-400'
                                    }`}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-orange-500 transition-colors"
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Register Button */}
                        <button 
                            type="submit"
                            disabled={loading}
                            className='w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        {/* Sign In Link */}
                        <Link 
                            href="/api/auth/signin" 
                            className="block w-full py-3 text-center border-2 border-orange-300 text-orange-600 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white hover:border-transparent transition-all duration-300 hover:shadow-lg"
                        >
                            Sign In Instead
                        </Link>
                    </form>

                    {/* Terms */}
                    <p className="mt-6 text-xs text-gray-500 text-center">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-orange-600 hover:text-orange-700 underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-orange-600 hover:text-orange-700 underline">Privacy Policy</a>
                    </p>
                </div>

                {/* Additional Chess Elements */}
                <div className="absolute -top-6 -right-6 text-6xl opacity-20 rotate-12">♛</div>
                <div className="absolute -bottom-6 -left-6 text-6xl opacity-20 -rotate-12">♜</div>
            </div>
        </div>
    )
}

export default Register