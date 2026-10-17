'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Cpu, Mail, Lock, User, Phone, ShieldCheck, Copy, Check, ArrowRight, ArrowLeft, Loader2, KeyRound } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyTotpSetup } = useAuth();

  const [step, setStep] = useState<'form' | 'totp'>('form');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');

  // TOTP setup data from server
  const [totpData, setTotpData] = useState<{
    qrCode: string;
    manualEntryKey: string;
    otpAuthUrl: string;
  } | null>(null);

  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await register(username, email, password, phone || undefined);
      setTotpData(res.totpSetup);
      setStep('totp');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (totpCode.trim().length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await verifyTotpSetup(email, totpCode.trim());
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid authenticator code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (totpData?.manualEntryKey) {
      navigator.clipboard.writeText(totpData.manualEntryKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      {/* Background subtle decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50 rounded-full translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white mb-4 shadow-lg shadow-slate-900/10">
            <Cpu className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DevMastery</h1>
          <p className="text-sm text-slate-500 mt-1">Join thousands of engineers leveling up daily</p>
        </div>

        {/* Card Container */}
        <Card className="border-slate-200 shadow-xl shadow-slate-100">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-semibold text-slate-900 flex items-center justify-center gap-2">
              {step === 'form' ? (
                'Create Your Account'
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Setup Google Authenticator
                </>
              )}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {step === 'form'
                ? 'Get started with personalized roadmaps & real coding'
                : 'Secure your account with 2-Factor Authentication'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>{error}</span>
              </div>
            )}

            {step === 'form' ? (
              /* Step 1: Account Information Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">FULL NAME / USERNAME</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="e.g. Alex Rivera"
                      className="pl-10 h-10 border-slate-200 focus:border-slate-900 text-sm"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">EMAIL ADDRESS</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="alex@example.com"
                      className="pl-10 h-10 border-slate-200 focus:border-slate-900 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Used for login, session recovery & notifications via AWS SES</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">
                    PHONE NUMBER <span className="text-slate-400 font-normal">(OPTIONAL)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="tel"
                      placeholder="+1 555-0199 or 9876543210"
                      className="pl-10 h-10 border-slate-200 focus:border-slate-900 text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="At least 8 characters"
                      className="pl-10 h-10 border-slate-200 focus:border-slate-900 text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">CONFIRM PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Re-enter your password"
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
                  className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm mt-2 transition-colors cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Continue to Authenticator Setup
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              /* Step 2: Google Authenticator QR Code Setup */
              <div className="space-y-5">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
                  <p className="font-semibold text-slate-900">How to set up Google Authenticator:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Install <strong>Google Authenticator</strong> from App Store or Play Store</li>
                    <li>Open app and tap <strong>"+"</strong> → <strong>"Scan a QR code"</strong></li>
                    <li>Scan the code below or enter key manually</li>
                  </ol>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                  {totpData?.otpAuthUrl ? (
                    <QRCodeSVG
                      value={totpData.otpAuthUrl}
                      size={170}
                      level="M"
                      includeMargin={true}
                    />
                  ) : (
                    <div className="w-[170px] h-[170px] bg-slate-100 flex items-center justify-center rounded text-xs text-slate-400">
                      Loading QR...
                    </div>
                  )}
                  <span className="text-[11px] text-slate-400 mt-2">Scan with Google Authenticator</span>
                </div>

                {/* Manual Entry Key */}
                {totpData?.manualEntryKey && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Can't scan? Enter Key Manually
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 break-all select-all">
                        {totpData.manualEntryKey}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyKey}
                        className="h-8 px-2.5 text-xs text-slate-700"
                      >
                        {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>
                )}

                {/* 6-Digit Verification Code Input */}
                <form onSubmit={handleVerifyTotp} className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                      ENTER 6-DIGIT CODE FROM APP
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
                        Verifying & Activating...
                      </>
                    ) : (
                      <>
                        Verify & Complete Registration
                        <Check className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 pt-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to details
                  </button>
                </form>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-slate-900 hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
