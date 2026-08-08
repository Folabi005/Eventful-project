import { ticketRepo, eventRepo } from '../repositories/store';

export const applicantService = {
  listApplicantsForCreator: (creatorId: string) => {
    const events = eventRepo.findByCreator(creatorId);
    return events.flatMap((event) =>
      ticketRepo.findByEvent(event.id).map((ticket) => ({
        ...ticket,
        eventTitle: event.title,
      })),
    );
  },
};
