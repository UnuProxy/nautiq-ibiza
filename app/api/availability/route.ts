import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { icalUrl, year, month } = await request.json();

    if (!icalUrl) {
      return NextResponse.json({ availability: [] }, { status: 200 });
    }

    const response = await fetch(icalUrl, {
      headers: {
        'User-Agent': 'NautiqIbiza/1.0',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch iCal feed');
    }

    const icalData = await response.text();
    const events = parseICalEvents(icalData);
    const availability = generateMonthAvailability(year, month, events);

    return NextResponse.json({ availability }, { status: 200 });
  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability', availability: [] },
      { status: 500 }
    );
  }
}

function parseICalEvents(icalData: string): Array<{ start: Date; end: Date }> {
  const events: Array<{ start: Date; end: Date }> = [];
  const lines = icalData.split('\n');
  
  let currentEvent: { start?: Date; end?: Date } = {};
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('DTSTART')) {
      const dateStr = trimmed.split(':')[1]?.replace(/[TZ]/g, '');
      if (dateStr) {
        currentEvent.start = parseICalDate(dateStr);
      }
    } else if (trimmed.startsWith('DTEND')) {
      const dateStr = trimmed.split(':')[1]?.replace(/[TZ]/g, '');
      if (dateStr) {
        currentEvent.end = parseICalDate(dateStr);
      }
    } else if (trimmed === 'END:VEVENT') {
      if (currentEvent.start && currentEvent.end) {
        events.push({
          start: currentEvent.start,
          end: currentEvent.end,
        });
      }
      currentEvent = {};
    }
  }
  
  return events;
}

function parseICalDate(dateStr: string): Date {
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  return new Date(year, month, day);
}

function generateMonthAvailability(
  year: number,
  month: number,
  events: Array<{ start: Date; end: Date }>
): Array<{ date: string; available: boolean }> {
  const availability: Array<{ date: string; available: boolean }> = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    
    const isBooked = events.some(event => {
      return date >= event.start && date <= event.end;
    });
    
    availability.push({
      date: dateStr,
      available: !isBooked,
    });
  }
  
  return availability;
}