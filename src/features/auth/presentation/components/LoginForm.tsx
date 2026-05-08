'use client';

import { type FormEvent, useEffect, useState } from 'react';

import Link from 'next/link';

import { useLogin } from '@/features/auth/application/hooks/useLogin';
import { validateEmail, validatePassword } from '@/features/auth/domain/services/authValidator';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { cn } from '@/shared/utils/cn';

function EnvelopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ off }: { off?: boolean }) {
  if (off) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function LoginForm() {
  const { handleLogin, isLoading, error, clearError } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (error) setShaking(true);
  }, [error]);

  const emailError =
    (touched.email || hasSubmitted) && !validateEmail(email)
      ? '올바른 이메일 형식을 입력해주세요.'
      : null;

  const passwordError =
    (touched.password || hasSubmitted) && !validatePassword(password)
      ? '비밀번호는 8자 이상이어야 해요.'
      : null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setHasSubmitted(true);
    if (!validateEmail(email) || !validatePassword(password)) return;
    await handleLogin(email, password);
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 mb-4">
          <span className="text-3xl">🎬</span>
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">딱대</h1>
        <p className="mt-1.5 text-sm text-muted">챌린지 크루를 찾아보세요</p>
      </div>

      {/* Card with gradient border */}
      <div className="p-px rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-accent/15">
        <div
          className={cn(
            'rounded-3xl bg-surface/80 backdrop-blur-2xl p-8',
            shaking && 'animate-shake',
          )}
          onAnimationEnd={() => setShaking(false)}
        >
          <h2 className="mb-7 text-xl font-semibold text-foreground">로그인</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Email */}
            <div className="animate-fade-in" style={{ animationDelay: '60ms' }}>
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                onBlur={() => handleBlur('email')}
                error={emailError ?? undefined}
                leftIcon={<EnvelopeIcon />}
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="animate-fade-in" style={{ animationDelay: '120ms' }}>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                onBlur={() => handleBlur('password')}
                error={passwordError ?? undefined}
                leftIcon={<LockIcon />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-muted hover:text-foreground transition-colors"
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    tabIndex={-1}
                  >
                    <EyeIcon off={showPassword} />
                  </button>
                }
                autoComplete="current-password"
              />
            </div>

            {/* API Error */}
            {error && (
              <p className="animate-fade-in rounded-xl bg-error/10 border border-error/20 px-4 py-2.5 text-sm text-error text-center">
                {error}
              </p>
            )}

            {/* Submit */}
            <div className="animate-fade-in mt-2" style={{ animationDelay: '180ms' }}>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <SpinnerIcon />
                    로그인 중...
                  </span>
                ) : (
                  '로그인'
                )}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="font-medium text-primary hover:text-primary-light transition-colors"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
