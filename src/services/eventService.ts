import { eventRepo, Event } from '../repositories/store';
import { cacheService } from './cacheService';

const ALL_EVENTS_CACHE_KEY = 'all_events';

export const eventService = {
  createEvent: (creatorId: string, event: Omit<Event, 'id' | 'creatorId' | 'shareUrl'>) => {
    const created = eventRepo.create(creatorId, event);
    cacheService.clear(ALL_EVENTS_CACHE_KEY);
    return created;
  },
  listEvents: () => {
    const cached = cacheService.get<Event[]>(ALL_EVENTS_CACHE_KEY);
    if (cached) return cached;
    const events = eventRepo.findAll();
    cacheService.set(ALL_EVENTS_CACHE_KEY, events, 15_000);
    return events;
  },
  listCreatorEvents: (creatorId: string) => eventRepo.findByCreator(creatorId),
  getEvent: (eventId: string) => eventRepo.findById(eventId),
};
