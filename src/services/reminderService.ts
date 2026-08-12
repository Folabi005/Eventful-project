import { eventRepo, reminderRepo } from '../repositories/store';

const unitMs = {
  minute: 60 * 1000,
  minutes: 60 * 1000,
  hour: 60 * 60 * 1000,
  hours: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  weeks: 7 * 24 * 60 * 60 * 1000,
};

function normalizeReminderTime(eventStartsAt: string, reminderValue: string): string {
  const trimmed = reminderValue.trim();

  if (!trimmed) {
    throw new Error('Reminder value is required');
  }

  const explicitDate = new Date(trimmed);
  if (!Number.isNaN(explicitDate.getTime())) {
    return explicitDate.toISOString();
  }

  const relativeMatch = trimmed.match(/^(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks)\s+before$/i);
  if (relativeMatch) {
    const amount = Number(relativeMatch[1]);
    const unit = relativeMatch[2].toLowerCase();
    const baseTime = new Date(eventStartsAt).getTime();
    const reminderTime = new Date(baseTime - amount * unitMs[unit as keyof typeof unitMs]);
    return reminderTime.toISOString();
  }

  const eventStart = new Date(eventStartsAt);
  if (Number.isNaN(eventStart.getTime())) {
    throw new Error('Event start time is invalid');
  }

  return eventStart.toISOString();
}

export const reminderService = {
  createReminder: (userId: string, eventId: string, remindAt: string) => {
    const event = eventRepo.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const normalized = normalizeReminderTime(event.startsAt, remindAt);
    return reminderRepo.create(userId, eventId, normalized);
  },
  listUserReminders: (userId: string) => reminderRepo.findByUser(userId),
  listEventReminders: (eventId: string) => reminderRepo.findByEvent(eventId),
  listUpcoming: () => {
    const now = new Date().toISOString();
    const reminders: any[] = (reminderRepo.findAll() as any[]) || [];
    return reminders
      .filter((reminder: any) => reminder.remindAt >= now)
      .sort((a: any, b: any) => a.remindAt.localeCompare(b.remindAt));
  },
  defaultOptions: () => ['1 day before', '1 week before', '2 hours before', '30 minutes before'],
};