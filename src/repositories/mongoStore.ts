import { Collection, Document } from 'mongodb';
import bcrypt from 'bcryptjs';
import { getMongoDb } from '../config/database';
import type { Event, Payment, Reminder, Role, Ticket, User } from './store';

export type { Event, Payment, Reminder, Role, Ticket, User } from './store';

const getCollection = <T extends Document>(name: string): Collection<T> | null => {
  const db = getMongoDb();
  return db ? db.collection<T>(name) : null;
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const mongoUserRepo = {
  create: async (email: string, password: string, role: Role) => {
    const collection = getCollection<User>('users');
    if (!collection) return null;

    const existing = await collection.findOne({ email });
    if (existing) throw new Error('Email already in use');

    const passwordHash = bcrypt.hashSync(password, 8);
    const user: User = { id: makeId(), email, passwordHash, role };
    await collection.insertOne(user);
    return user;
  },
  findByEmail: async (email: string) => {
    const collection = getCollection<User>('users');
    return collection ? collection.findOne({ email }) : undefined;
  },
  findById: async (id: string) => {
    const collection = getCollection<User>('users');
    return collection ? collection.findOne({ id }) : undefined;
  },
};

export const mongoEventRepo = {
  create: async (creatorId: string, payload: Omit<Event, 'id' | 'creatorId' | 'shareUrl'>) => {
    const collection = getCollection<Event>('events');
    if (!collection) return null;

    const event: Event = {
      id: makeId(),
      creatorId,
      shareUrl: `https://eventful.example.com/events/${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...payload,
    };

    await collection.insertOne(event);
    return event;
  },
  findById: async (id: string) => {
    const collection = getCollection<Event>('events');
    return collection ? collection.findOne({ id }) : undefined;
  },
  findByCreator: async (creatorId: string) => {
    const collection = getCollection<Event>('events');
    return collection ? collection.find({ creatorId }).toArray() : [];
  },
  findAll: async () => {
    const collection = getCollection<Event>('events');
    return collection ? collection.find({}).toArray() : [];
  },
};

export const mongoTicketRepo = {
  create: async (eventId: string, userId: string, qrCodeData: string) => {
    const collection = getCollection<Ticket>('tickets');
    if (!collection) return null;

    const ticket: Ticket = {
      id: makeId(),
      eventId,
      userId,
      purchasedAt: new Date().toISOString(),
      qrCodeData,
      scanned: false,
    };

    await collection.insertOne(ticket);
    return ticket;
  },
  findByUser: async (userId: string) => {
    const collection = getCollection<Ticket>('tickets');
    return collection ? collection.find({ userId }).toArray() : [];
  },
  findByEvent: async (eventId: string) => {
    const collection = getCollection<Ticket>('tickets');
    return collection ? collection.find({ eventId }).toArray() : [];
  },
  findById: async (id: string) => {
    const collection = getCollection<Ticket>('tickets');
    return collection ? collection.findOne({ id }) : undefined;
  },
  markScanned: async (id: string) => {
    const collection = getCollection<Ticket>('tickets');
    if (!collection) return null;
    const ticket = await collection.findOne({ id });
    if (!ticket) return null;
    const updated = { ...ticket, scanned: true };
    await collection.updateOne({ id }, { $set: { scanned: true } });
    return updated;
  },
};

export const mongoPaymentRepo = {
  create: async (eventId: string, userId: string, amountCents: number, reference: string) => {
    const collection = getCollection<Payment>('payments');
    if (!collection) return null;

    const payment: Payment = {
      id: makeId(),
      eventId,
      userId,
      amountCents,
      status: 'initialized',
      reference,
      initializedAt: new Date().toISOString(),
    };

    await collection.insertOne(payment);
    return payment;
  },
  findByCreator: async (creatorId: string) => {
    const collection = getCollection<Payment>('payments');
    const eventCollection = getCollection<Event>('events');
    if (!collection || !eventCollection) return [];
    const creatorEvents = await eventCollection.find({ creatorId }).project({ id: 1 }).toArray();
    const ids = creatorEvents.map((event) => event.id);
    return collection.find({ eventId: { $in: ids } }).toArray();
  },
  findByUser: async (userId: string) => {
    const collection = getCollection<Payment>('payments');
    return collection ? collection.find({ userId }).toArray() : [];
  },
  findByEvent: async (eventId: string) => {
    const collection = getCollection<Payment>('payments');
    return collection ? collection.find({ eventId }).toArray() : [];
  },
  findByReference: async (reference: string) => {
    const collection = getCollection<Payment>('payments');
    return collection ? collection.findOne({ reference }) : undefined;
  },
  updateStatus: async (reference: string, status: Payment['status']) => {
    const collection = getCollection<Payment>('payments');
    if (!collection) return null;
    const payment = await collection.findOne({ reference });
    if (!payment) return null;
    await collection.updateOne({ reference }, { $set: { status } });
    return { ...payment, status };
  },
};

export const mongoReminderRepo = {
  create: async (userId: string, eventId: string, remindAt: string) => {
    const collection = getCollection<Reminder>('reminders');
    if (!collection) return null;

    const reminder: Reminder = {
      id: makeId(),
      userId,
      eventId,
      remindAt,
    };

    await collection.insertOne(reminder);
    return reminder;
  },
  findByUser: async (userId: string) => {
    const collection = getCollection<Reminder>('reminders');
    return collection ? collection.find({ userId }).toArray() : [];
  },
  findByEvent: async (eventId: string) => {
    const collection = getCollection<Reminder>('reminders');
    return collection ? collection.find({ eventId }).toArray() : [];
  },
  findAll: async () => {
    const collection = getCollection<Reminder>('reminders');
    return collection ? collection.find({}).toArray() : [];
  },
};
