import React from 'react';
import InteractiveCalendar from './InteractiveCalendar';

// Wrapper component to maintain compatibility or simple export
const CalendarView = (props) => {
  // Pass all props through to the new component
  // Map old props to new props if necessary
  // Old: onCellClick, isWorkingDay, schedule
  // New: onDayClick, isWorkingDay
  
  return (
    <InteractiveCalendar 
      onDayClick={props.onCellClick}
      isWorkingDay={props.isWorkingDay}
      // Assuming existing CalendarView usage might not pass these, but CalendarModal will
      {...props}
    />
  );
};

export default CalendarView;