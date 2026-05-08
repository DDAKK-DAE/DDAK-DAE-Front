'use client';

import { type FormEvent, useEffect, useState } from 'react';

import { Eye, EyeOff, Loader2, Lock, Mail, User, Leaf, ChevronLeft } from 'lucide-react';
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
import { Select } from '@/shared/components/ui/Select';
import { cn } from '@/shared/utils/cn';

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
    <form onSubmit={handleNext} className="flex flex-col gap-5" noValidate>
      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <Input
          type="email"
          placeholder="이메일 주소"
          value={values.email}
          onChange={(e) => onChange({ ...values, email: e.target.value })}
          onBlur={() => touch('email')}
          error={errors.email ?? undefined}
          leftIcon={<Mail className="w-5 h-5" />}
          autoComplete="email"
          autoFocus
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '140ms' }}>
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호 (8자 이상)"
          value={values.password}
          onChange={(e) => onChange({ ...values, password: e.target.value })}
          onBlur={() => touch('password')}
          error={errors.password ?? undefined}
          leftIcon={<Lock className="w-5 h-5" />}
          rightElement={
            <button type="button" tabIndex={-1}
              onClick={() => setShowPassword((p) => !p)}
              className="text-muted hover:text-primary transition-colors p-1"
              aria-label={showPassword ? '숨기기' : '보기'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          autoComplete="new-password"
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '180ms' }}>
        <Input
          type={showConfirm ? 'text' : 'password'}
          placeholder="비밀번호 확인"
          value={values.passwordConfirm}
          onChange={(e) => onChange({ ...values, passwordConfirm: e.target.value })}
          onBlur={() => touch('passwordConfirm')}
          error={errors.passwordConfirm ?? undefined}
          leftIcon={<Lock className="w-5 h-5" />}
          rightElement={
            <button type="button" tabIndex={-1}
              onClick={() => setShowConfirm((p) => !p)}
              className="text-muted hover:text-primary transition-colors p-1"
              aria-label={showConfirm ? '숨기기' : '보기'}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          autoComplete="new-password"
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '220ms' }}>
        <Input
          type="text"
          placeholder="활동할 닉네임"
          value={values.nickname}
          onChange={(e) => onChange({ ...values, nickname: e.target.value })}
          onBlur={() => touch('nickname')}
          error={errors.nickname ?? undefined}
          leftIcon={<User className="w-5 h-5" />}
          autoComplete="nickname"
          maxLength={50}
        />
      </div>

      <div className="animate-slide-up mt-2" style={{ animationDelay: '260ms' }}>
        <Button type="submit" className="w-full h-13 rounded-2xl text-[16px] font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
          다음 단계로
        </Button>
      </div>
    </form>
  );
}

/* ─── BirthdayPicker ────────────────────────────────────── */

function BirthdayPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [y, setY] = useState(value ? value.slice(0, 4) : '');
  const [m, setM] = useState(value ? value.slice(5, 7).replace(/^0/, '') : '');
  const [d, setD] = useState(value ? value.slice(8, 10).replace(/^0/, '') : '');

  const daysInMonth = (y && m) ? new Date(Number(y), Number(m), 0).getDate() : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    if (d && daysInMonth < Number(d)) setD('');
  }, [m, y, daysInMonth, d]);

  useEffect(() => {
    if (y && m && d) {
      onChange(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
    } else {
      onChange('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [y, m, d]);

  return (
    <div className="flex gap-2">
      <Select value={y} onChange={setY} placeholder="년도" options={years.map((yr) => ({ value: String(yr), label: `${yr}년` }))} className="flex-[3]" />
      <Select value={m} onChange={setM} placeholder="월" options={months.map((mo) => ({ value: String(mo), label: `${mo}월` }))} className="flex-[2]" />
      <Select value={d} onChange={setD} placeholder="일" options={days.map((dy) => ({ value: String(dy), label: `${dy}일` }))} className="flex-[2]" />
    </div>
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
    <div className="flex flex-col gap-5">
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 animate-slide-up mb-2">
        <p className="text-[14px] text-primary-dark font-medium leading-relaxed">
          프로필을 더 풍부하게 채워보세요.<br/>
          이 단계의 정보는 모두 <strong className="font-bold">선택 사항</strong>이에요.
        </p>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '60ms' }}>
        <Input
          type="text"
          placeholder="본명 (선택)"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          autoComplete="name"
          maxLength={50}
        />
      </div>

      {/* Custom Birthday Picker */}
      <div className="animate-slide-up flex flex-col gap-1.5" style={{ animationDelay: '100ms' }}>
        <label className="text-sm font-semibold text-foreground ml-1">생년월일 (선택)</label>
        <BirthdayPicker value={values.birthday} onChange={(v) => onChange({ ...values, birthday: v })} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 animate-slide-up" style={{ animationDelay: '140ms' }}>
          <Input
            type="number"
            placeholder="나이 (선택)"
            value={values.age}
            onChange={(e) => onChange({ ...values, age: e.target.value })}
            min={0}
            max={150}
          />
        </div>

        <div className="flex-[2] animate-slide-up" style={{ animationDelay: '180ms' }}>
          <Input
            type="text"
            placeholder="직업 (선택)"
            value={values.job}
            onChange={(e) => onChange({ ...values, job: e.target.value })}
            maxLength={50}
          />
        </div>
      </div>

      {error && (
        <p className="animate-fade-in rounded-2xl bg-error/10 border border-error/20 px-4 py-3 text-[14px] font-medium text-error text-center mt-1">
          {error}
        </p>
      )}

      <div className="animate-slide-up flex gap-3 mt-4" style={{ animationDelay: '220ms' }}>
        <Button 
          variant="secondary" 
          onClick={onBack} 
          className="flex-none w-16 h-13 rounded-2xl shadow-sm hover:shadow-md transition-all p-0 flex items-center justify-center bg-secondary text-foreground hover:bg-secondary/80 border border-border" 
          type="button" 
          disabled={isLoading}
          aria-label="이전 단계로"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button onClick={onSubmit} className="flex-1 h-13 rounded-2xl text-[16px] font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300" type="button" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              크루 합류 준비 중...
            </span>
          ) : (
            '딱대 시작하기'
          )}
        </Button>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="text-[14px] font-medium text-muted hover:text-primary transition-colors text-center disabled:opacity-40 mt-2"
      >
        이 단계 건너뛰기
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

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (error) setShaking(true);
  }, [error]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
    <div className="w-full max-w-md relative z-10">
      {/* Decorative background blobs for light theme */}
      <div className="absolute top-[-150px] right-[-100px] w-72 h-72 bg-accent/20 rounded-full blur-[80px] -z-10 animate-float" />
      <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 bg-primary/15 rounded-full blur-[80px] -z-10 animate-float" style={{ animationDelay: '2s' }} />

      {/* Logo Area */}
      <div className="mb-10 text-center animate-slide-up">
        <div className="mx-auto mb-5 relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl rotate-6 animate-float" />
          <div className="absolute inset-0 bg-accent/10 rounded-2xl -rotate-6 animate-float" style={{ animationDelay: '1s' }} />
          <div className="relative bg-surface rounded-2xl w-full h-full flex items-center justify-center shadow-sm border border-border">
            <Leaf className="w-8 h-8 text-primary" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">계정 만들기</h1>
        <p className="mt-2 text-[15px] text-muted">딱대와 함께 새로운 모임을 시작하세요</p>
      </div>

      {/* Card with dynamic moving gradient border */}
      <div className="relative group">
        <div className="absolute -inset-[2px] rounded-3xl bg-[linear-gradient(45deg,var(--color-primary),var(--color-accent),var(--color-warning),var(--color-primary))] bg-[length:400%_400%] animate-gradient-xy opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl blur-[2px]" />
        
        <div
          className={cn(
            'relative rounded-[22px] bg-surface/90 backdrop-blur-xl p-8 sm:p-10 shadow-xl shadow-primary/5 border border-border transition-all duration-300',
            shaking && 'animate-shake',
          )}
          onAnimationEnd={() => setShaking(false)}
        >
          {/* Header + Step indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                {step === 1 ? '기본 정보 입력' : '추가 프로필'}
              </h2>
              <span className="text-sm font-semibold text-muted bg-secondary px-3 py-1 rounded-full">{step} / 2</span>
            </div>
            <div className="flex gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary-light)] transition-all duration-500" />
              <div className={cn('h-1.5 flex-1 rounded-full transition-all duration-500', step === 2 ? 'bg-primary shadow-[0_0_8px_var(--color-primary-light)]' : 'bg-border')} />
            </div>
          </div>

          {/* Steps */}
          <div className="overflow-hidden relative">
            {/* Wrap in a container to allow smooth transitions if needed, though simple unmount is used here */}
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
          </div>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-[15px]">
            <span className="text-muted">이미 계정이 있으신가요?</span>
            <Link
              href="/login"
              className="font-bold text-primary hover:text-primary-dark transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary/30 after:transition-all hover:after:bg-primary"
            >
              로그인하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
