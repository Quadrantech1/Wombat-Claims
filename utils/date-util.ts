import { logger } from "./logger-util";

/**
 * Formats a date as either yyyy-MM-dd or MM/dd/yyyy
 * @param date - The date to format (Date object or string parsable by Date)
 * @param format - 'API' for yyyy-MM-dd, 'ORCA' for MM/dd/yyyy
 * @returns The formatted date string
 */
export function formatDate(date: Date | string, format: 'API' | 'ORCA', padZeros: boolean = true): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const rawMonth = d.getMonth() + 1;
    const rawDay = d.getDate();

    let month: string | number = rawMonth;
    let day: string | number = rawDay;

    if (padZeros) {
        month = String(rawMonth).padStart(2, '0');
        day = String(rawDay).padStart(2, '0');
    }

    if (format === 'API') {
        return `${year}-${month}-${day}`;
    } else if (format === 'ORCA') {
        return `${month}/${day}/${year}`;
    } else {
        throw new Error('Unsupported format type');
    }
}

/**
 * Gets yesterday's date in specified format
 * @param format - 'API' for yyyy-MM-dd, 'ORCA' for MM/dd/yyyy (default)
 * @returns Yesterday's date as a string in specified format
 */
export function getYesterdayDate(format: 'API' | 'ORCA' = 'ORCA'): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(yesterday, format);
}

/**
 * Gets tomorrow's date in specified format
 * @param format - 'API' for yyyy-MM-dd, 'ORCA' for MM/dd/yyyy (default)
 * @returns Tomorrow's date as a string in specified format
 */
export function getTomorrowDate(format: 'API' | 'ORCA' = 'ORCA'): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow, format);
}

/**
 * Gets today's date in specified format
 * @param format - 'API' for yyyy-MM-dd, 'ORCA' for MM/dd/yyyy (default)
 * @returns Today's date as a string in specified format
 */
export function getTodayDate(format: 'API' | 'ORCA' = 'ORCA'): string {
    const today = new Date();
    return formatDate(today, format);
}

/**
 * Gets a date from specified number of days ago in specified format
 * @param daysAgo - Number of days to subtract from today
 * @param format - 'API' for yyyy-MM-dd, 'ORCA' for MM/dd/yyyy (default)
 * @returns Date from specified days ago as a string in specified format
 */
export function getDaysAgoDate(daysAgo: number, format: 'API' | 'ORCA' = 'ORCA'): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return formatDate(date, format);
}

/**
 * Gets a date from specified number of years ago in specified format
 * @param yearsAgo - Number of years to subtract from today
 * @param format - 'API' for yyyy-MM-dd, 'ORCA' for MM/dd/yyyy (default)
 * @returns Date from specified years ago as a string in specified format
 */
export function getYearsAgoDate(yearsAgo: number, format: 'API' | 'ORCA' = 'ORCA'): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    return formatDate(date, format);
}

/**
 * Gets a date a specified number of days from today (future or past) in specified format
 * @param daysFromNow - Number of days to add to today (use negative to get past dates)
 * @param format - 'API' for yyyy-MM-dd, 'ORCA' for MM/dd/yyyy (default)
 * @returns Date from specified offset as a string in specified format
 */
export function getDaysFromNow(daysFromNow: number, format: 'API' | 'ORCA' = 'ORCA'): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return formatDate(date, format);
}

/**
 * Gets a date a specified number of years from today (future or past) in specified format
 * @param yearsFromNow - Number of years to add to today (use negative to get past dates)
 * @param format - 'API' for yyyy-MM-dd, 'ORCA' for MM/dd/yyyy (default)
 * @returns Date from specified offset as a string in specified format
 */
export function getYearsFromNow(yearsFromNow: number, format: 'API' | 'ORCA' = 'ORCA', padZeros: boolean = true): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + yearsFromNow);
    return formatDate(date, format, padZeros);
}

export function getMonthsFromNow(monthsFromNow: number, format: 'API' | 'ORCA' = 'ORCA', padZeros: boolean = true): string {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsFromNow);
    return formatDate(date, format, padZeros);
}

/**
 * Gets a date with a specific format and offset in days
 * @param offsetDays - Number of days to add to today
 * @param format - Format string, e.g., 'MM/dd/yyyy' or 'M/d/yyyy'
 * @returns Formatted date string
 */
export function getDateWithSpecificFormat(offsetDays: number, format: string = 'MM/dd/yyyy'): string {
    logger.info(`[date-util.getDateWithSpecificFormat] - Getting formatted date with offset: ${offsetDays}, format: ${format}`);
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);

    const rawMonth = date.getMonth() + 1;
    const rawDay = date.getDate();
    const year = date.getFullYear();

    let month: string | number;
    let day: string | number;

    switch (format) {
        case 'MM/dd/yyyy':
            month = String(rawMonth).padStart(2, '0');
            day = String(rawDay).padStart(2, '0');
            break;
        case 'M/d/yyyy':
            month = rawMonth;
            day = rawDay;
            break;
        default:
            throw new Error(`Format not supported: ${format}`);
    }

    const formatted = `${month}/${day}/${year}`;
    logger.info('[date-util.getDateWithSpecificFormat] - Formatted date: ' + formatted);
    return formatted;
}

/**
* Calculates age in years from a date string in "yyyy-MM-dd" or "yyyy-MM-ddTHH:mm:ss" format.
* @param dateString - The date string representing the birth date.
* @returns Age in years as a number.
*/
export function getAgeFromDateString(dateString: string | number): number {
    if (typeof dateString === 'number') {
        return dateString;
    }
    // Accepts "yyyy-MM-dd" or "yyyy-MM-ddTHH:mm:ss"
    const birthDate = new Date(dateString);
    if (isNaN(birthDate.getTime())) {
        throw new Error('[date-util.getAgeFromDateString] - Invalid date string: ' + dateString);
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

/**
 * Gets the beginning of a specific year (January 1st) in specified format
 * @param yearOffset - Number of years from current year (0 = current year, 1 = next year, -1 = last year)
 * @param format - 'API' for yyyy-MM-dd, 'ORCA' for MM/dd/yyyy, 'ORCA-UI' for M/d/yyyy UI format (default: ORCA)
 * @returns Beginning of year date as a string in specified format
 */
export function getBeginningOfYear(yearOffset: number = 0, format: 'API' | 'ORCA' | 'ORCA-UI' = 'ORCA'): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + yearOffset, 0, 1); // January = 0, day = 1

    if (format === 'ORCA-UI') {
        const year = date.getFullYear();
        return `1/1/${year}`;
    }

    return formatDate(date, format);
}

/**
 * Gets tomorrow's day number with ordinal suffix (1st, 2nd, 3rd, etc.)
 * @returns Tomorrow's day with suffix as a string (e.g., "3rd", "21st")
 */
export function getTomorrowDayWithSuffix(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayNumber = tomorrow.getDate();
    const suffix = dayNumber === 1 || dayNumber === 21 || dayNumber === 31 ? 'st'
        : dayNumber === 2 || dayNumber === 22 ? 'nd'
        : dayNumber === 3 || dayNumber === 23 ? 'rd'
        : 'th';
    return `${dayNumber}${suffix}`;
}

/**
 * Gets tomorrow's day number
 * @returns Tomorrow's day as a number (1-31)
 */
export function getTomorrowDayNumber(): number {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.getDate();
}
