export function parseLocalDateTime(input?: string | Date | null): Date {
    if (!input) return new Date();
    if (input instanceof Date) return input;
    // Expecting format: YYYY-MM-DD HH:mm:ss (no timezone). Treat as local time.
    // Replace space with 'T' to make it ISO-like without timezone.
    const normalized = input.replace(' ', 'T');
    // iOS/Safari-safe parsing by splitting
    const [datePart, timePart = '00:00:00'] = normalized.split('T');
    const [y, m, d] = datePart.split('-').map((s) => Number(s));
    const [hh = 0, mm = 0, ss = 0] = timePart.split(':').map((s) => Number(s));
    return new Date(y, (m || 1) - 1, d || 1, hh, mm, ss);
}

export function pad2(n: number) { return n.toString().padStart(2, '0'); }
export function formatDateTime(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}