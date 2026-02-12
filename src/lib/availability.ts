export type AvailabilityBlock = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
};

export function buildSlots({
  availability,
  date,
  slotMinutes = 30,
}: {
  availability: AvailabilityBlock[];
  date: Date;
  slotMinutes?: number;
}) {
  const day = date.getDay();
  const blocks = availability.filter((block) => block.dayOfWeek === day);
  const slots: { start: Date; end: Date }[] = [];

  for (const block of blocks) {
    const [startHour, startMinute] = block.startTime.split(':').map(Number);
    const [endHour, endMinute] = block.endTime.split(':').map(Number);
    const start = new Date(date);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(date);
    end.setHours(endHour, endMinute, 0, 0);

    for (let current = new Date(start); current < end; ) {
      const next = new Date(current.getTime() + slotMinutes * 60000);
      if (next <= end) {
        slots.push({ start: new Date(current), end: next });
      }
      current = next;
    }
  }

  return slots;
}
