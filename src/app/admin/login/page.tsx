'use client';

import React, { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '@/app/actions/admin';
import { Button } from '@/components/ui/Button';
import { Camera, Lock, AlertCircle, Shield, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  async function handleLogin(prevState: unknown, formData: FormData) {
    const result = await adminLoginAction(prevState, formData);
    if (result.success) {
      router.push('/admin');
      router.refresh();
      return { success: true };
    }
    return result;
  }

  const [state, formAction, isPending] = useActionState(handleLogin, null);

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Brand Monogram */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border border-[#C5A059]/40 bg-[#141418] flex items-center justify-center text-[#C5A059] mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <span className="editorial-tag text-xs text-[#C5A059]">Staff Security Portal</span>
          <h1 className="font-serif text-3xl text-[#FAF9F5] font-normal">
            Moments Production Admin
          </h1>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Authorized administrator access for bookings, calendar management, and studio operations.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#121216] border border-[#23232A] p-8 rounded-sm space-y-6">
          {state?.error && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-sm flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1.5 font-medium">
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                required
                defaultValue="admin@momentsproduction.com"
                className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2.5 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] mb-1.5 font-medium">
                Passkey / Password
              </label>
              <input
                type="password"
                name="password"
                required
                defaultValue="Moments@Vadodara2026"
                className="w-full bg-[#1A1A22] border border-[#2B2B36] rounded-sm px-4 py-2.5 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <Button type="submit" isLoading={isPending} className="w-full gap-2">
              <Lock className="w-4 h-4" />
              Authenticate to Studio Dashboard
            </Button>
          </form>

          {/* Quick Credential Hint for User */}
          <div className="pt-4 border-t border-[#1F1F26] text-[11px] text-zinc-400 space-y-1">
            <span className="text-[#C5A059] font-medium flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              Bootstrap Credentials (Pre-filled):
            </span>
            <p className="font-mono text-zinc-300">admin@momentsproduction.com</p>
            <p className="font-mono text-zinc-300">Moments@Vadodara2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
