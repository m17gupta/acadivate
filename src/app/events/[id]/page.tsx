import { notFound } from 'next/navigation';
import { getEventByIdOrSlug } from '@/src/lib/events';
import { Events } from '@/src/components/sections/Events';

function normalizeEventRouteId(id: string) {
  return id.trim().toLowerCase().replace(/\s+/g, '-');
}

function formatEventDate(eventDate?: string) {
  if (!eventDate) return 'Date not available';

  const parsed = new Date(eventDate);
  if (Number.isNaN(parsed.getTime())) return eventDate;

  return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function resolveImage(imageUrl?: string | string[]) {
  if (Array.isArray(imageUrl)) {
    return imageUrl[0] || '/assets/Image/event1.jpeg';
  }

  return imageUrl || '/assets/Image/event1.jpeg';
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (normalizeEventRouteId(id) === 'all-events') {
    return {
      title: 'All Events',
      description: 'Browse all upcoming academic events and conferences.',
    };
  }

  const event = await getEventByIdOrSlug(id);

  if (!event) {
    return {
      title: 'Event not found',
      description: 'The requested event could not be found.',
    };
  }

  return {
    title: event.title || 'Event Details',
    description: event.description || 'View the full event details.',
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (normalizeEventRouteId(id) === 'all-events') {
    return <Events />;
  }

  const event = await getEventByIdOrSlug(id);

  if (!event) {
    notFound();
  }

  const image = resolveImage(event.imageUrl);
  const dateLabel = formatEventDate(event.eventDate);

  return (
    <main className="bg-app-bg px-6 py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-text-subtle">
            Event Details
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            {event.title || 'Untitled Event'}
          </h1>
          <p className="text-base leading-8 text-text-muted">
            {event.description || 'No description available for this event.'}
          </p>
          <div className="rounded-2xl border border-border-light bg-white p-5 shadow-sh-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-text-subtle">Date</p>
            <p className="mt-2 text-lg font-semibold text-navy">{dateLabel}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-border-light bg-white shadow-sh-lg">
          <div className="relative aspect-[4/3] w-full">
            <img
              src={image}
              alt={event.title || 'Event image'}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-2 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-text-subtle">Event ID</p>
            <p className="break-all text-sm text-text-muted">{String(event._id ?? id)}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
