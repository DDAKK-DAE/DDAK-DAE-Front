'use client';

import { useState, useEffect } from 'react';
import { Select } from './Select';

interface DatePickerProps {
  value: string; // 'YYYY-MM-DD'
  onChange: (value: string) => void;
  min?: string; // 'YYYY-MM-DD' — 이 날짜 이전 년도/월/일은 비활성
}

function getDaysInMonth(year: string, month: string): number {
  if (!year || !month) return 31;
  return new Date(Number(year), Number(month), 0).getDate();
}

export function DatePicker({ value, onChange, min }: DatePickerProps) {
  const [y, setY] = useState(value ? value.slice(0, 4) : '');
  const [m, setM] = useState(value ? value.slice(5, 7).replace(/^0/, '') : '');
  const [d, setD] = useState(value ? value.slice(8, 10).replace(/^0/, '') : '');

  const minYear = min ? Number(min.slice(0, 4)) : undefined;
  const minMonth = min ? Number(min.slice(5, 7)) : undefined;
  const minDay = min ? Number(min.slice(8, 10)) : undefined;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const months = Array.from({ length: 12 }, (_, i) => i + 1).filter((month) => {
    if (!minYear || !y) return true;
    if (Number(y) > minYear) return true;
    return !minMonth || month >= minMonth;
  });

  const daysInMonth = getDaysInMonth(y, m);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter((day) => {
    if (!minYear || !minMonth || !minDay || !y || !m) return true;
    if (Number(y) > minYear) return true;
    if (Number(y) === minYear && Number(m) > minMonth) return true;
    if (Number(y) === minYear && Number(m) === minMonth) return day >= minDay;
    return true;
  });

  useEffect(() => {
    // 선택된 일이 해당 월 최대일 초과하면 리셋
    if (d && daysInMonth < Number(d)) setD('');
  }, [m, y, daysInMonth, d]);

  useEffect(() => {
    if (y && m && d) {
      const mm = m.padStart(2, '0');
      const dd = d.padStart(2, '0');
      onChange(`${y}-${mm}-${dd}`);
    } else {
      onChange('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [y, m, d]);

  const yearOptions = years.map((year) => ({ value: String(year), label: `${year}년` }));
  const monthOptions = months.map((month) => ({ value: String(month), label: `${month}월` }));
  const dayOptions = days.map((day) => ({ value: String(day), label: `${day}일` }));

  return (
    <div className="flex gap-2">
      <Select value={y} onChange={setY} placeholder="년도" options={yearOptions} className="flex-[3]" />
      <Select value={m} onChange={setM} placeholder="월" options={monthOptions} className="flex-[2]" />
      <Select value={d} onChange={setD} placeholder="일" options={dayOptions} className="flex-[2]" />
    </div>
  );
}
