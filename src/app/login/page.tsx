'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Cpu, Mail, Lock, Shield, Eye, EyeOff, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, verifyTotpLogin, loginAsDemo } = useAuth();

  const [step, setStep] = useState<'credentials' | 'totp'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.requiresTotpVerification) {
        setStep('totp');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyTotpLogin(email, totpCode);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginAsDemo();
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {/* Background subtle pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50 rounded-full translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white mb-4 shadow-lg shadow-slate-900/10">
            <Cpu className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DevMastery</h1>
          <p className="text-sm text-slate-500 mt-1">Daily Learning & Architecture Platform</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-200 shadow-xl shadow-slate-100">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-semibold text-slate-900 flex items-center justify-center gap-2">
              {step === 'credentials' ? (
                'Welcome Back'
              ) : (
                <>
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Two-Factor Authentication
                </>
              )}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {step === 'credentials'
                ? 'Sign in to continue your learning journey'
                : 'Enter the 6-digit code from Google Authenticator'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>{error}</span>
              </div>
            )}

            {step === 'credentials' ? (
              <form onSubmit={handleCredentialSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">EMAIL ADDRESS</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-10 border-slate-200 focus:border-slate-900 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide">PASSWORD</label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-10 border-slate-200 focus:border-slate-900 text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-1.5" />
                      Sign In
                    </>
                  )}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full h-10 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm cursor-pointer"
                >
                  Try Demo Account
                </Button>
              </form>
            ) : (
              <form onSubmit={handleTotpSubmit} className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-900">Google Authenticator Required</p>
                  <p>Open the app on your mobile device and enter the 6-digit code for <strong>{email}</strong>.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                    6-DIGIT CODE
                  </label>
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className="h-11 text-center font-mono text-lg tracking-widest border-slate-200 focus:border-slate-900"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || totpCode.trim().length !== 6}
                  className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Sign In'
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 pt-1"
                >
                  ← Back to email & password
                </button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-slate-900 hover:underline">
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          Protected by JWT + Google Authenticator 2FA
        </p>
      </div>
    </div>
  );
}
