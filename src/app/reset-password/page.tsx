'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Cpu, Lock, CheckCircle2, ArrowRight, Loader2, KeyRound } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resetToken) {
      setError('Invalid or missing password reset token. Please request a new link.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50 rounded-full translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white mb-4 shadow-lg shadow-slate-900/10">
            <Cpu className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DevMastery</h1>
          <p className="text-sm text-slate-500 mt-1">Set New Password</p>
        </div>

        <Card className="border-slate-200 shadow-xl shadow-slate-100">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-semibold text-slate-900 flex items-center justify-center gap-2">
              {success ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Password Updated!
                </>
              ) : (
                <>
                  <KeyRound className="w-5 h-5 text-slate-700" />
                  Create New Password
                </>
              )}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {success
                ? 'Your password has been securely reset'
                : email
                ? `Resetting password for ${email}`
                : 'Enter your new credentials below'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="space-y-4 text-center py-2">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-left space-y-1">
                  <p className="font-semibold text-emerald-900">Success!</p>
                  <p>Your password has been changed. You can now log in using your new password and your Google Authenticator app.</p>
                </div>

                <Button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm cursor-pointer"
                >
                  Proceed to Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">NEW PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="At least 8 characters"
                      className="pl-10 h-10 border-slate-200 focus:border-slate-900 text-sm"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">CONFIRM NEW PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      className="pl-10 h-10 border-slate-200 focus:border-slate-900 text-sm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
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
                      Updating Password...
                    </>
                  ) : (
                    'Save New Password'
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
            <Link href="/login" className="text-xs text-slate-500 hover:text-slate-900">
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-sm text-slate-500">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
