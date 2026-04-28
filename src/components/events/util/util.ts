export function normalizeEventRouteId(id: string) {
  return id.trim().toLowerCase().replace(/\s+/g, "-");
}

export function formatEventDate(eventDate?: string) {
  if (!eventDate) return "Date not available";

  const parsed = new Date(eventDate);
  if (Number.isNaN(parsed.getTime())) return eventDate;

  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function resolveImage(imageUrl?: string | string[]) {
  if (Array.isArray(imageUrl)) {
    return imageUrl[0] || "/assets/Image/event1.jpeg";
  }

  return imageUrl || "/assets/Image/event1.jpeg";
}