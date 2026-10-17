'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Cpu, Mail, ShieldCheck, KeyRound, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, verifyTotpForReset } = useAuth();

  const [step, setStep] = useState<'identify' | 'totp' | 'success'>('identify');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [resolvedEmail, setResolvedEmail] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [devResetToken, setDevResetToken] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIdentifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailOrPhone.trim()) {
      setError('Please enter your email or registered phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(emailOrPhone.trim());
      setResolvedEmail(res.email || emailOrPhone.trim());
      setStep('totp');
    } catch (err: any) {
      setError(err.message || 'Account not found. Please check your email or phone.');
    } finally {
      setLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (totpCode.trim().length !== 6) {
      setError('Please enter your 6-digit Google Authenticator code');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyTotpForReset(resolvedEmail, totpCode.trim());
      if (res.resetToken) {
        setDevResetToken(res.resetToken);
      }
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Invalid authenticator code. Please check your app.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50 rounded-full translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white mb-4 shadow-lg shadow-slate-900/10">
            <Cpu className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DevMastery</h1>
          <p className="text-sm text-slate-500 mt-1">Account Recovery & Security Verification</p>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-100">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-semibold text-slate-900 flex items-center justify-center gap-2">
              {step === 'identify' && 'Reset Password'}
              {step === 'totp' && (
                <>
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  Authenticator Verification
                </>
              )}
              {step === 'success' && (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Email Sent via AWS SES
                </>
              )}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {step === 'identify' && 'Enter your registered email address or mobile number'}
              {step === 'totp' && 'Security check: verify your Google Authenticator code'}
              {step === 'success' && 'We have sent a secure password reset link to your email'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>{error}</span>
              </div>
            )}

            {step === 'identify' && (
              <form onSubmit={handleIdentifySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">EMAIL OR MOBILE NUMBER</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="alex@example.com or +1234567890"
                      className="pl-10 h-10 border-slate-200 focus:border-slate-900 text-sm"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    We will prompt for your 2FA Google Authenticator before generating a reset link.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking Account...
                    </>
                  ) : (
                    <>
                      Next: Verify Authenticator
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {step === 'totp' && (
              <form onSubmit={handleTotpSubmit} className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-900">Account verified: {resolvedEmail}</p>
                  <p>
                    Open your <strong>Google Authenticator</strong> app and enter the 6-digit code for DevMastery to authorize password reset.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                    6-DIGIT AUTHENTICATOR CODE
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
                      Verifying Code...
                    </>
                  ) : (
                    <>
                      Verify & Send Reset Link
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('identify')}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 pt-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Change email / mobile
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="space-y-4 text-center py-2">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-left space-y-2">
                  <p className="font-semibold text-emerald-900">Reset instructions sent successfully!</p>
                  <p>
                    We sent a secure password reset link to <strong>{resolvedEmail}</strong> via Amazon SES. Please check your inbox and follow the link to reset your password.
                  </p>
                  <p className="text-[11px] text-emerald-600">The link is valid for 15 minutes.</p>
                </div>

                {devResetToken && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left space-y-2">
                    <p className="text-xs font-semibold text-amber-900">Developer Direct Link (Dev Mode):</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/reset-password?token=${devResetToken}&email=${encodeURIComponent(resolvedEmail)}`)}
                      className="w-full text-xs font-medium border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer"
                    >
                      Open Password Reset Screen Directly →
                    </Button>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm cursor-pointer"
                >
                  Back to Sign In
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
            <Link href="/login" className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Return to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
