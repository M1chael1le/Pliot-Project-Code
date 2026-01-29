import { ADUser } from '@/types';

export const mockUsers: ADUser[] = [
  // Executive Level
  {
    id: 'user-001',
    displayName: 'Margaret Chen',
    email: 'mchen@sevenhills.org',
    department: 'Executive',
    title: 'CEO',
    managerId: null,
    directReports: ['user-002', 'user-003', 'user-004'],
  },

  // Department Heads
  {
    id: 'user-002',
    displayName: 'David Rodriguez',
    email: 'drodriguez@sevenhills.org',
    department: 'Information Technology',
    title: 'IT Director',
    managerId: 'user-001',
    directReports: ['user-005', 'user-006', 'user-007'],
  },
  {
    id: 'user-003',
    displayName: 'Sarah Thompson',
    email: 'sthompson@sevenhills.org',
    department: 'Human Resources',
    title: 'HR Director',
    managerId: 'user-001',
    directReports: ['user-008', 'user-009'],
  },
  {
    id: 'user-004',
    displayName: 'Michael Johnson',
    email: 'mjohnson@sevenhills.org',
    department: 'Operations',
    title: 'Operations Director',
    managerId: 'user-001',
    directReports: ['user-010', 'user-011', 'user-012'],
  },

  // IT Department
  {
    id: 'user-005',
    displayName: 'Jennifer Liu',
    email: 'jliu@sevenhills.org',
    department: 'Information Technology',
    title: 'Systems Administrator',
    managerId: 'user-002',
    directReports: [],
  },
  {
    id: 'user-006',
    displayName: 'Robert Kim',
    email: 'rkim@sevenhills.org',
    department: 'Information Technology',
    title: 'Network Engineer',
    managerId: 'user-002',
    directReports: [],
  },
  {
    id: 'user-007',
    displayName: 'Amanda Foster',
    email: 'afoster@sevenhills.org',
    department: 'Information Technology',
    title: 'Help Desk Technician',
    managerId: 'user-002',
    directReports: [],
  },

  // HR Department
  {
    id: 'user-008',
    displayName: 'James Wilson',
    email: 'jwilson@sevenhills.org',
    department: 'Human Resources',
    title: 'HR Specialist',
    managerId: 'user-003',
    directReports: [],
  },
  {
    id: 'user-009',
    displayName: 'Patricia Garcia',
    email: 'pgarcia@sevenhills.org',
    department: 'Human Resources',
    title: 'Recruiter',
    managerId: 'user-003',
    directReports: [],
  },

  // Operations Department
  {
    id: 'user-010',
    displayName: 'Christopher Brown',
    email: 'cbrown@sevenhills.org',
    department: 'Operations',
    title: 'Operations Manager',
    managerId: 'user-004',
    directReports: ['user-013', 'user-014', 'user-015'],
  },
  {
    id: 'user-011',
    displayName: 'Nancy Martinez',
    email: 'nmartinez@sevenhills.org',
    department: 'Operations',
    title: 'Facilities Manager',
    managerId: 'user-004',
    directReports: ['user-016', 'user-017'],
  },
  {
    id: 'user-012',
    displayName: 'Daniel Lee',
    email: 'dlee@sevenhills.org',
    department: 'Operations',
    title: 'Quality Assurance Manager',
    managerId: 'user-004',
    directReports: ['user-018', 'user-019'],
  },

  // Operations Staff
  {
    id: 'user-013',
    displayName: 'Elizabeth Taylor',
    email: 'etaylor@sevenhills.org',
    department: 'Operations',
    title: 'Operations Coordinator',
    managerId: 'user-010',
    directReports: [],
  },
  {
    id: 'user-014',
    displayName: 'William Anderson',
    email: 'wanderson@sevenhills.org',
    department: 'Operations',
    title: 'Logistics Specialist',
    managerId: 'user-010',
    directReports: [],
  },
  {
    id: 'user-015',
    displayName: 'Karen White',
    email: 'kwhite@sevenhills.org',
    department: 'Operations',
    title: 'Inventory Analyst',
    managerId: 'user-010',
    directReports: [],
  },

  // Facilities Staff
  {
    id: 'user-016',
    displayName: 'Steven Harris',
    email: 'sharris@sevenhills.org',
    department: 'Operations',
    title: 'Maintenance Technician',
    managerId: 'user-011',
    directReports: [],
  },
  {
    id: 'user-017',
    displayName: 'Lisa Clark',
    email: 'lclark@sevenhills.org',
    department: 'Operations',
    title: 'Safety Coordinator',
    managerId: 'user-011',
    directReports: [],
  },

  // QA Staff
  {
    id: 'user-018',
    displayName: 'Mark Robinson',
    email: 'mrobinson@sevenhills.org',
    department: 'Operations',
    title: 'QA Analyst',
    managerId: 'user-012',
    directReports: [],
  },
  {
    id: 'user-019',
    displayName: 'Michelle Lewis',
    email: 'mlewis@sevenhills.org',
    department: 'Operations',
    title: 'Compliance Specialist',
    managerId: 'user-012',
    directReports: [],
  },

  // Additional Staff
  {
    id: 'user-020',
    displayName: 'Kevin Walker',
    email: 'kwalker@sevenhills.org',
    department: 'Finance',
    title: 'Accountant',
    managerId: 'user-001',
    directReports: [],
  },
  {
    id: 'user-021',
    displayName: 'Emily Hall',
    email: 'ehall@sevenhills.org',
    department: 'Finance',
    title: 'Financial Analyst',
    managerId: 'user-001',
    directReports: [],
  },
  {
    id: 'user-022',
    displayName: 'Jason Young',
    email: 'jyoung@sevenhills.org',
    department: 'Marketing',
    title: 'Marketing Coordinator',
    managerId: 'user-001',
    directReports: [],
  },
  {
    id: 'user-023',
    displayName: 'Rebecca King',
    email: 'rking@sevenhills.org',
    department: 'Client Services',
    title: 'Case Manager',
    managerId: 'user-004',
    directReports: [],
  },
  {
    id: 'user-024',
    displayName: 'Thomas Scott',
    email: 'tscott@sevenhills.org',
    department: 'Client Services',
    title: 'Program Coordinator',
    managerId: 'user-004',
    directReports: [],
  },
  {
    id: 'user-025',
    displayName: 'Angela Green',
    email: 'agreen@sevenhills.org',
    department: 'Client Services',
    title: 'Support Specialist',
    managerId: 'user-004',
    directReports: [],
  },
];

// Helper function to get user by ID
export function getUserById(id: string): ADUser | undefined {
  return mockUsers.find(user => user.id === id);
}

// Helper function to get direct reports for a manager
export function getDirectReports(managerId: string): ADUser[] {
  return mockUsers.filter(user => user.managerId === managerId);
}

// Helper function to get all subordinates (recursive)
export function getAllSubordinates(managerId: string): ADUser[] {
  const directReports = getDirectReports(managerId);
  const allSubordinates: ADUser[] = [...directReports];

  directReports.forEach(report => {
    allSubordinates.push(...getAllSubordinates(report.id));
  });

  return allSubordinates;
}

// Current logged-in user (mock - simulating a manager)
export const currentUser = mockUsers.find(u => u.id === 'user-004')!; // Operations Director
