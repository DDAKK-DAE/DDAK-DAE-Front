'use client';

import { type FormEvent, useEffect, useState } from 'react';

import Link from 'next/link';

import { useSignup } from '@/features/auth/application/hooks/useSignup';
import {
  validateEmail,
  validateNickname,
  validatePassword,
} from '@/features/auth/domain/services/authValidator';
import type {
  SignupStep1Values,
  SignupStep2Values,
} from '@/features/auth/presentation/types/AuthFormTypes';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { cn } from '@/shared/utils/cn';

/* ─── Icon helpers ─────────────────────────────────────── */

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
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
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

/* ─── Step 1 ────────────────────────────────────────────── */

interface Step1Props {
  values: SignupStep1Values;
  onChange: (values: SignupStep1Values) => void;
  onNext: () => void;
}

function Step1({ values, onChange, onNext }: Step1Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, passwordConfirm: false, nickname: false });
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    email: (touched.email || submitted) && !validateEmail(values.email)
      ? '올바른 이메일 형식을 입력해주세요.' : null,
    password: (touched.password || submitted) && !validatePassword(values.password)
      ? '비밀번호는 8자 이상이어야 해요.' : null,
    passwordConfirm: (touched.passwordConfirm || submitted) && values.password !== values.passwordConfirm
      ? '비밀번호가 일치하지 않아요.' : null,
    nickname: (touched.nickname || submitted) && !validateNickname(values.nickname)
      ? '닉네임은 1~50자 사이여야 해요.' : null,
  };

  const handleNext = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    if (!validateEmail(values.email) || !validatePassword(values.password) ||
        values.password !== values.passwordConfirm || !validateNickname(values.nickname)) return;
    onNext();
  };

  const touch = (field: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  return (
    <form onSubmit={handleNext} className="flex flex-col gap-4" noValidate>
      <div className="animate-fade-in" style={{ animationDelay: '60ms' }}>
        <Input
          type="email"
          placeholder="이메일"
          value={values.email}
          onChange={(e) => onChange({ ...values, email: e.target.value })}
          onBlur={() => touch('email')}
          error={errors.email ?? undefined}
          leftIcon={<EnvelopeIcon />}
          autoComplete="email"
          autoFocus
        />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 (8자 이상)"
          value={values.password}
          onChange={(e) => onChange({ ...values, password: e.target.value })}
          onBlur={() => touch('password')}
          error={errors.password ?? undefined}
          leftIcon={<LockIcon />}
          rightElement={
            <button type="button" tabIndex={-1}
              onClick={() => setShowPassword((p) => !p)}
              className="text-muted hover:text-foreground transition-colors"
              aria-label={showPassword ? '숨기기' : '보기'}
            >
              <EyeIcon off={showPassword} />
            </button>
          }
          autoComplete="new-password"
        />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '140ms' }}>
        <Input
          type={showConfirm ? 'text' : 'password'}
          placeholder="비밀번호 확인"
          value={values.passwordConfirm}
          onChange={(e) => onChange({ ...values, passwordConfirm: e.target.value })}
          onBlur={() => touch('passwordConfirm')}
          error={errors.passwordConfirm ?? undefined}
          leftIcon={<LockIcon />}
          rightElement={
            <button type="button" tabIndex={-1}
              onClick={() => setShowConfirm((p) => !p)}
              className="text-muted hover:text-foreground transition-colors"
              aria-label={showConfirm ? '숨기기' : '보기'}
            >
              <EyeIcon off={showConfirm} />
            </button>
          }
          autoComplete="new-password"
        />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '180ms' }}>
        <Input
          type="text"
          placeholder="닉네임"
          value={values.nickname}
          onChange={(e) => onChange({ ...values, nickname: e.target.value })}
          onBlur={() => touch('nickname')}
          error={errors.nickname ?? undefined}
          leftIcon={<UserIcon />}
          autoComplete="nickname"
          maxLength={50}
        />
      </div>

      <div className="animate-fade-in mt-2" style={{ animationDelay: '220ms' }}>
        <Button type="submit" className="w-full">다음</Button>
      </div>
    </form>
  );
}

/* ─── Step 2 ────────────────────────────────────────────── */

interface Step2Props {
  values: SignupStep2Values;
  onChange: (values: SignupStep2Values) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

function Step2({ values, onChange, onBack, onSubmit, isLoading, error }: Step2Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted animate-fade-in">
        아래 정보는 모두 선택이에요. 나중에 프로필에서도 수정할 수 있어요.
      </p>

      <div className="animate-fade-in" style={{ animationDelay: '60ms' }}>
        <Input
          type="text"
          placeholder="이름 (선택)"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          autoComplete="name"
          maxLength={50}
        />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Input
          type="date"
          placeholder="생년월일 (선택)"
          value={values.birthday}
          onChange={(e) => onChange({ ...values, birthday: e.target.value })}
          autoComplete="bday"
        />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '140ms' }}>
        <Input
          type="number"
          placeholder="나이 (선택)"
          value={values.age}
          onChange={(e) => onChange({ ...values, age: e.target.value })}
          min={0}
          max={150}
        />
      </div>

      <div className="animate-fade-in" style={{ animationDelay: '180ms' }}>
        <Input
          type="text"
          placeholder="직업 (선택)"
          value={values.job}
          onChange={(e) => onChange({ ...values, job: e.target.value })}
          maxLength={50}
        />
      </div>

      {error && (
        <p className="animate-fade-in rounded-xl bg-error/10 border border-error/20 px-4 py-2.5 text-sm text-error text-center">
          {error}
        </p>
      )}

      <div className="animate-fade-in flex gap-3 mt-2" style={{ animationDelay: '220ms' }}>
        <Button variant="secondary" onClick={onBack} className="flex-1" type="button" disabled={isLoading}>
          이전
        </Button>
        <Button onClick={onSubmit} className="flex-1" type="button" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <SpinnerIcon />
              처리 중...
            </span>
          ) : (
            '완성'
          )}
        </Button>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="text-sm text-muted hover:text-foreground transition-colors text-center disabled:opacity-40"
      >
        건너뛰기
      </button>
    </div>
  );
}

/* ─── SignupForm (컨테이너) ─────────────────────────────── */

export function SignupForm() {
  const { handleSignup, isLoading, error, clearError } = useSignup();
  const [step, setStep] = useState<1 | 2>(1);
  const [shaking, setShaking] = useState(false);

  const [step1Values, setStep1Values] = useState<SignupStep1Values>({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });

  const [step2Values, setStep2Values] = useState<SignupStep2Values>({
    name: '',
    birthday: '',
    age: '',
    job: '',
  });

  useEffect(() => {
    if (error) setShaking(true);
  }, [error]);

  const goToStep2 = () => {
    clearError();
    setStep(2);
  };

  const goToStep1 = () => {
    clearError();
    setStep(1);
  };

  const submitSignup = async () => {
    await handleSignup({
      email: step1Values.email,
      password: step1Values.password,
      nickname: step1Values.nickname,
      name: step2Values.name || undefined,
      birthday: step2Values.birthday || undefined,
      age: step2Values.age ? Number(step2Values.age) : undefined,
      job: step2Values.job || undefined,
    });
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 mb-4">
          <span className="text-3xl">🎬</span>
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">딱대</h1>
        <p className="mt-1.5 text-sm text-muted">함께 찍을 크루를 만들어보세요</p>
      </div>

      {/* Card */}
      <div className="p-px rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-accent/15">
        <div
          className={cn(
            'rounded-3xl bg-surface/80 backdrop-blur-2xl p-8',
            shaking && 'animate-shake',
          )}
          onAnimationEnd={() => setShaking(false)}
        >
          {/* Header + Step indicator */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-foreground">
                {step === 1 ? '계정 만들기' : '조금 더 알아볼게요'}
              </h2>
              <span className="text-xs text-muted">{step} / 2</span>
            </div>
            <div className="flex gap-2">
              <div className="h-1 flex-1 rounded-full bg-primary transition-all duration-500" />
              <div className={cn('h-1 flex-1 rounded-full transition-all duration-500', step === 2 ? 'bg-primary' : 'bg-border')} />
            </div>
          </div>

          {/* Steps */}
          {step === 1 && (
            <Step1
              key="step1"
              values={step1Values}
              onChange={setStep1Values}
              onNext={goToStep2}
            />
          )}
          {step === 2 && (
            <Step2
              key="step2"
              values={step2Values}
              onChange={setStep2Values}
              onBack={goToStep1}
              onSubmit={submitSignup}
              isLoading={isLoading}
              error={error}
            />
          )}

          <p className="mt-6 text-center text-sm text-muted">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-light transition-colors"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
