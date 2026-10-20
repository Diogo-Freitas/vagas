/**
 * Format a date for display in the chat sidebar (e.g. "Today", "Yesterday", "Oct 19").
 */
export function formatChatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();

    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );
    const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);
    const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );

    if (startOfDay.getTime() === startOfToday.getTime()) {
        return 'Today';
    }

    if (startOfDay.getTime() === startOfYesterday.getTime()) {
        return 'Yesterday';
    }

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        ...(date.getFullYear() === now.getFullYear()
            ? {}
            : { year: 'numeric' as const }),
    }).format(date);
}

/**
 * Format a date and time for message timestamps (e.g. "Oct 19, 02:34 PM").
 */
export function formatMessageTimestamp(iso: string): string {
    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));
}
