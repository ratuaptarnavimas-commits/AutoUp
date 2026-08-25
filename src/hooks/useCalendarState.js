import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'autoup_calendar_state_v1';

export const useCalendarState = () => {
  const [calendarState, setCalendarState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const saveState = (newState) => {
    setCalendarState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const isWorkingDay = useCallback((date) => {
    if (!date) return false;
    const dateStr = formatDate(date);
    // If date exists in state, return it. Otherwise default to false (closed).
    // Or we could default to standard M-F. Let's default to false to be safe unless set.
    return calendarState[dateStr] === true;
  }, [calendarState]);

  const toggleDay = useCallback((date) => {
    const dateStr = formatDate(date);
    const currentState = calendarState[dateStr];
    // Toggle: if currently true -> false, if currently false (or undefined) -> true
    const newState = {
      ...calendarState,
      [dateStr]: !currentState
    };
    saveState(newState);
  }, [calendarState]);

  const resetToStandardSchedule = useCallback(() => {
    const newState = {};
    const year = new Date().getFullYear();
    // Generate for current year and next year
    for (let y = year; y <= year + 1; y++) {
      const daysInYear = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
      const startDate = new Date(y, 0, 1);
      
      for (let i = 0; i < daysInYear; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayOfWeek = currentDate.getDay(); // 0 = Sun, 6 = Sat
        const dateStr = formatDate(currentDate);
        
        // Mon (1) to Fri (5) are working days
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          newState[dateStr] = true;
        } else {
          newState[dateStr] = false;
        }
      }
    }
    saveState(newState);
  }, []);

  return {
    calendarState,
    isWorkingDay,
    toggleDay,
    resetToStandardSchedule
  };
};