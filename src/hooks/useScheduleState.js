import { useMemo } from 'react';
import { useWorkSchedule } from './useWorkSchedule';

const SETTINGS = {
  startTime: '08:00',
  endTime: '18:00'
};

export const useScheduleState = () => {
  // Destructure isWorkingDay (aliased as checkIsWorkingDay) from the hook
  // This ensures we use the logic that matches the actual data structure of 'schedule'
  const { schedule, toggleDay, setStandardSchedule, loading, isWorkingDay: checkIsWorkingDay } = useWorkSchedule();

  // Determine if a specific date is a working day
  // We delegate this to the useWorkSchedule hook which knows if schedule is a Map or Array
  const isWorkingDay = (date) => {
    if (typeof checkIsWorkingDay === 'function') {
      return checkIsWorkingDay(date);
    }
    // Fallback safety: if schedule isn't loaded or helper is missing, default to false
    return false;
  };

  // Adapter for toggleDay to match expected signature (date -> toggle)
  const updateDayStatus = (date) => {
    if (!date) return;
    // Pass the Date object directly to toggleDay, as expected by useWorkSchedule
    toggleDay(date);
  };

  const value = useMemo(() => ({
    schedule: {
      ...SETTINGS,
      days: schedule
    },
    isWorkingDay,
    updateDayStatus,
    updateSchedule: () => console.warn("Global schedule update not implemented"),
    resetSchedule: setStandardSchedule,
    isLocked: false,
    loading
  }), [schedule, loading, setStandardSchedule, checkIsWorkingDay, toggleDay]);

  return value;
};