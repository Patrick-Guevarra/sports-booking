export const MOCK_SESSIONS = [
  {
    id: 1,
    coachId: 1,
    coachName: 'Jordan Dasher',
    sport: 'Basketball',
    type: 'one_on_one',
    startTime: '2025-11-01T10:00:00Z',
    endTime: '2025-11-01T11:00:00Z',
    basePriceCents: 5000,
    capacity: 1,
    status: 'open'
  },
  {
    id: 2,
    coachId: 1,
    coachName: 'Jordan Dasher',
    sport: 'Volleyball',
    type: 'group',
    startTime: '2025-11-03T18:00:00Z',
    endTime: '2025-11-03T19:30:00Z',
    basePriceCents: 3000,
    capacity: 6,
    status: 'open'
  }

  
];

export const MOCK_BOOKINGS = [
  {
    id: 101,
    sessionId: 1,
    sport: 'Basketball',
    type: 'one_on_one',
    coachName: 'Jordan Dasher',
    startTime: '2025-11-01T10:00:00Z',
    durationMinutes: 60,
    priceCents: 6000,
    status: 'confirmed' // 'pending' | 'confirmed' | 'completed' | 'canceled'
  },
  {
    id: 102,
    sessionId: 2,
    sport: 'Volleyball',
    type: 'group',
    coachName: 'Jordan Dasher',
    startTime: '2025-11-03T18:00:00Z',
    durationMinutes: 90,
    priceCents: 3000,
    status: 'pending'
  }
];

