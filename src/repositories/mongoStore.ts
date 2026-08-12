import type { Event, Payment, Reminder, Role, Ticket, User } from './store';
import { eventRepo, paymentRepo, reminderRepo, ticketRepo, userRepo } from './store';

export type { Event, Payment, Reminder, Role, Ticket, User } from './store';

export const mongoUserRepo = {
  create: userRepo.create,
  findByEmail: userRepo.findByEmail,
  findById: userRepo.findById,
};

export const mongoEventRepo = {
  create: eventRepo.create,
  findById: eventRepo.findById,
  findByCreator: eventRepo.findByCreator,
  findAll: eventRepo.findAll,
};

export const mongoTicketRepo = {
  create: ticketRepo.create,
  findByUser: ticketRepo.findByUser,
  findByEvent: ticketRepo.findByEvent,
  findById: ticketRepo.findById,
  markScanned: ticketRepo.markScanned,
};

export const mongoPaymentRepo = {
  create: paymentRepo.create,
  findByCreator: paymentRepo.findByCreator,
  findByUser: paymentRepo.findByUser,
  findByEvent: paymentRepo.findByEvent,
  findByReference: paymentRepo.findByReference,
  updateStatus: paymentRepo.updateStatus,
};

export const mongoReminderRepo = {
  create: reminderRepo.create,
  findByUser: reminderRepo.findByUser,
  findByEvent: reminderRepo.findByEvent,
  findAll: reminderRepo.findAll,
};
