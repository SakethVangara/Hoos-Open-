import { useEffect, useState } from 'react';

function parseTime(timeStr: string): number | null {
  // timeStr examples: '8am', '10:30pm'
  if (!timeStr) return null;

  const matched = timeStr.toLowerCase().match(/(\d{1,2})(:(\d{2}))?(am|pm)/);
  if (!matched) return null;

  let hours = parseInt(matched[1], 10);
  let minutes = matched[3] ? parseInt(matched[3], 10) : 0;
  const modifier = matched[4];

  if (modifier === 'pm' && hours < 12) hours += 12;
  if (modifier === 'am' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function useCurrentOpenStatus(hours: { [weekday: string]: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const today = now.toLocaleString('en-US', { weekday: 'long' });
    const todayHours = hours[today];

    if (!todayHours) {
      setOpen(false);
      return;
    }

    const [openTime, closeTime] = todayHours.split(' - ').map(t => t.trim());

    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const openMinutes = parseTime(openTime);
    const closeMinutes = parseTime(closeTime);

    if (openMinutes === null || closeMinutes === null) {
      setOpen(false);
      return;
    }

    setOpen(nowMinutes >= openMinutes && nowMinutes <= closeMinutes);
  }, [hours]);

  return open;
}
