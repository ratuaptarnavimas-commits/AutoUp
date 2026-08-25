import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useWorkSchedule = () => {
  const [schedule, setSchedule] = useState({}); // Map: 'YYYY-MM-DD' -> boolean
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const formatDate = (date) => {
    // Format to YYYY-MM-DD using local time
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const fetchWorkSchedule = useCallback(async (currentDate = new Date()) => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0-11

      // Calculate start and end of the month
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0); // Last day of month

      // Format for DB query
      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);

      const { data, error } = await supabase
        .from('work_schedule')
        .select('scheduled_date, is_working')
        .gte('scheduled_date', startDateStr)
        .lte('scheduled_date', endDateStr);

      if (error) throw error;

      // Convert array to map for O(1) lookup
      const scheduleMap = {};
      data.forEach(item => {
        scheduleMap[item.scheduled_date] = item.is_working;
      });
      
      setSchedule(prev => ({ ...prev, ...scheduleMap }));
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError(err);
      toast({
        title: "Klaida",
        description: "Nepavyko užkrauti grafiko.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const checkIsWorkingDay = useCallback((date) => {
    if (!date) return false;
    const dateStr = formatDate(date);
    
    // Check if we have an explicit override in the DB
    if (schedule.hasOwnProperty(dateStr)) {
      return schedule[dateStr];
    }
    
    // Fallback default rule: Mon-Fri (1-5) are working, Sat-Sun (0,6) are off
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }, [schedule]);

  const toggleDay = async (date) => {
    if (!date) return;
    const dateStr = formatDate(date);
    const currentStatus = checkIsWorkingDay(date);
    const newStatus = !currentStatus;

    // Optimistic update
    setSchedule(prev => ({
      ...prev,
      [dateStr]: newStatus
    }));

    try {
      const { error } = await supabase
        .from('work_schedule')
        .upsert(
          { 
            scheduled_date: dateStr, 
            is_working: newStatus,
            updated_at: new Date()
          }, 
          { onConflict: 'scheduled_date' }
        );

      if (error) throw error;
      
      // Silent success or subtle toast
    } catch (err) {
      console.error('Error updating day:', err);
      // Revert on error
      setSchedule(prev => ({
        ...prev,
        [dateStr]: currentStatus
      }));
      toast({
        title: "Klaida",
        description: "Nepavyko atnaujinti dienos statuso.",
        variant: "destructive"
      });
    }
  };

  const setStandardSchedule = async () => {
    // This function might be less relevant with specific dates,
    // but we can implement it as "Reset current month to defaults" if needed.
    // For now, since the default fallback IS the standard schedule, 
    // we could technically delete overrides for the visible range, 
    // but the prompt implies we just need the hook to support the calendar.
    // We'll leave it as a placeholder or perform a "soft reset" by clearing local state overrides if we were deleting rows.
    // Given the prompt "toggle individual dates", let's keep it simple.
    toast({
      title: "Info",
      description: "Standartinis grafikas (I-V) yra taikomas pagal nutylėjimą.",
    });
  };

  return {
    schedule,
    loading,
    error,
    toggleDay, // Now accepts Date object
    isWorkingDay: checkIsWorkingDay, // Exposed helper
    setStandardSchedule,
    fetchWorkSchedule
  };
};