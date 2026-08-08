import { reminderRepo, ticketRepo } from '../repositories/store';

export const reminderService = {
  createReminder: (userId: string, eventId: string, remindAt: string) => {
    return reminderRepo.create(userId, eventId, remindAt);
  },
  listUserReminders: (userId: string) => reminderRepo.findByUser(userId),
  listEventReminders: (eventId: string) => reminderRepo.findByEvent(eventId),
  listUpcoming: () => {
    const now = new Date().toISOString();
    return reminderRepo.findByEvent('')
      .filter((reminder) => reminder.remindAt >= now)
      .sort((a, b) => a.remindAt.localeCompare(b.remindAt));
  },
  defaultOptions: () => ['1 day before', '1 week before', '2 hours before'],
};