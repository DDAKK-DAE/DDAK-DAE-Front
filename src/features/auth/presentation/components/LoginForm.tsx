'use client';

import { type FormEvent, useEffect, useState } from 'react';

import { Eye, EyeOff, Loader2, Lock, Mail, Leaf } from 'lucide-react';
import Link from 'next/link';

import { useLogin } from '@/features/auth/application/hooks/useLogin';
import { validateEmail, validatePassword } from '@/features/auth/domain/services/authValidator';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { cn } from '@/shared/utils/cn';

export function LoginForm() {
  const { handleLogin, isLoading, error, clearError } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [shaking, setShaking] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (error) setShaking(true);
  }, [error]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
    <div className="w-full max-w-md relative z-10">
      {/* Decorative background blobs for light theme */}
      <div className="absolute top-[-150px] left-[-100px] w-72 h-72 bg-primary/20 rounded-full blur-[80px] -z-10 animate-float" />
      <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-accent/15 rounded-full blur-[80px] -z-10 animate-float" style={{ animationDelay: '2s' }} />

      {/* Logo Area */}
      <div className="mb-10 text-center animate-slide-up">
        <div className="mx-auto mb-5 relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl rotate-6 animate-float" />
          <div className="absolute inset-0 bg-accent/10 rounded-2xl -rotate-6 animate-float" style={{ animationDelay: '1s' }} />
          <div className="relative bg-surface rounded-2xl w-full h-full flex items-center justify-center shadow-sm border border-border">
            <Leaf className="w-8 h-8 text-primary" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">딱대</h1>
        <p className="mt-2 text-[15px] text-muted">함께 모여 만드는 우리만의 숏폼</p>
      </div>

      {/* Card with dynamic moving gradient border */}
      <div className="relative group">
        <div className="absolute -inset-[2px] rounded-3xl bg-[linear-gradient(45deg,var(--color-primary),var(--color-accent),var(--color-warning),var(--color-primary))] bg-[length:400%_400%] animate-gradient-xy opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl blur-[2px]" />
        
        <div
          className={cn(
            'relative rounded-[22px] bg-surface/90 backdrop-blur-xl p-8 sm:p-10 shadow-xl shadow-primary/5 border border-border',
            shaking && 'animate-shake',
          )}
          onAnimationEnd={() => setShaking(false)}
        >
          <h2 className="mb-8 text-2xl font-bold text-foreground tracking-tight">로그인</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Email */}
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                onBlur={() => handleBlur('email')}
                error={emailError ?? undefined}
                leftIcon={<Mail className="w-5 h-5" />}
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                onBlur={() => handleBlur('password')}
                error={passwordError ?? undefined}
                leftIcon={<Lock className="w-5 h-5" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-muted hover:text-primary transition-colors p-1"
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                autoComplete="current-password"
              />
            </div>

            {/* API Error */}
            {error && (
              <p className="animate-fade-in rounded-2xl bg-error/10 border border-error/20 px-4 py-3 text-[14px] font-medium text-error text-center mt-1">
                {error}
              </p>
            )}

            {/* Submit */}
            <div className="animate-slide-up mt-4" style={{ animationDelay: '200ms' }}>
              <Button type="submit" className="w-full h-13 rounded-2xl text-[16px] font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    로그인 중...
                  </span>
                ) : (
                  '로그인'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-[15px]">
            <span className="text-muted">계정이 없으신가요?</span>
            <Link
              href="/signup"
              className="font-bold text-primary hover:text-primary-dark transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary/30 after:transition-all hover:after:bg-primary"
            >
              크루 합류하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
