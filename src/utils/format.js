import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getYear, getMonth } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatDate(dateStr) {
  return format(parseISO(dateStr), 'M月d日 EEEE', { locale: zhCN });
}

export function formatShortDate(dateStr) {
  return format(parseISO(dateStr), 'M/d');
}

export function formatMonth(dateStr) {
  return format(parseISO(dateStr), 'yyyy年M月', { locale: zhCN });
}

export function formatAmount(amount) {
  return Number(amount).toFixed(2);
}

export function getMonthRange(year, month) {
  const d = new Date(year, month);
  return {
    start: format(startOfMonth(d), 'yyyy-MM-dd'),
    end: format(endOfMonth(d), 'yyyy-MM-dd'),
  };
}

export function isCurrentMonth(year, month) {
  const now = new Date();
  return getYear(now) === year && getMonth(now) === month;
}
