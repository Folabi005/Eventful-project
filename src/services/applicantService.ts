import { ticketRepo, eventRepo } from '../repositories/store';

export const applicantService = {
  listApplicantsForCreator: (creatorId: string) => {
    const events: any[] = (eventRepo.findByCreator(creatorId) as any[]) || [];
    return events.flatMap((event: any) =>
      (ticketRepo.findByEvent(event.id) as any[]).map((ticket: any) => ({
        ...ticket,
        eventTitle: event.title,
      })),
    );
  },
};
