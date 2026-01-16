// types/recruitment.ts

// ============= USER ROLES & AUTH =============

export type UserRole = 'RH' | 'Manager' | 'CO' | 'Direction';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department?: Department;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'hiring_request' | 'candidate_update' | 'interview_scheduled' | 'position_update' | 'status_change';
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: 'jobRequest' | 'candidate' | 'position' | 'interview';
  isRead: boolean;
  createdAt: Date;
  createdBy: string;
}

export type InterviewType = 
  | 'Entretien RH'
  | 'Entretien Technique'
  | 'Entretien Manager'
  | 'Entretien Final';

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  type: InterviewType;
  scheduledDate: Date;
  duration: number; // en minutes
  location?: string;
  interviewers: string[]; // User IDs
  status: 'Planifié' | 'Confirmé' | 'Terminé' | 'Annulé' | 'Reporté';
  notes?: string;
  result?: 'Favorable' | 'Defavorable' | 'A revoir';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============= REFERENCE DATA TYPES =============

export type Recruiter = 
  | 'SAADANI HIBA'
  | 'MOHAMED AYMEN BACOUCHE'
  | 'zoubaier berrebeh';

export type Department = 
  | 'RH'
  | 'Production'
  | 'Méthode & Indus'
  | 'Finance'
  | 'supply chain'
  | 'Maintenance'
  | 'HSE'
  | 'Qualité'
  | 'groupe'
  | 'achat';

export type RecruitmentSource = 
  | 'Site officiel'
  | 'LinkedIn'
  | 'Cabinet de recrutement'
  | 'Référence interne'
  | 'Salon emploi'
  | 'E-Mail'
  | 'Autres';

export type PositionStatus = 
  | 'Vacant'
  | 'En cours de traitement'
  | 'En cours'
  | 'Suspendu'
  | 'Annulé'
  | 'Embauché'
  | 'Terminé';

export type RecruitmentMode = 'Interne' | 'Externe';

export type WorkSite = 'TT' | 'TTG';

export type Gender = 'Homme' | 'Femme';

export type CandidateStatus = 
  | 'Nouveau'
  | 'Traitement de dossier'
  | 'Entretien RH'
  | 'Entretien Technique'
  | 'Entretien Manager'
  | 'Entretien Final'
  | 'En attente de décision'
  | 'Offre envoyée'
  | 'Embauché'
  | 'Refus candidat'
  | 'Refus entreprise'
  | 'stand by';

export type Opinion = 
  | 'Favorable'
  | 'Defavorable'
  | 'Prioritaire'
  | 'Passable'
  | 'stand by';

export type EducationLevel = 
  | 'Bac/ BTP'
  | 'Bac+2 / BTS'
  | 'Bac+3'
  | 'Bac+4'
  | 'Bac+5 / Ingénieur'
  | 'Doctorat';

// ============= INTERFACES =============

export interface RecruiterInfo {
  id: string;
  name: Recruiter;
  department: Department;
}

export interface DepartmentInfo {
  id: string;
  name: Department;
  recruiter?: Recruiter;
  activePositions: number;
}

export type PositionNature = 'creation' | 'remplacement';

export interface JobRequest {
  id: string;
  department: Department;
  jobTitle: string;
  requestDate: Date;
  site?: WorkSite;
  positionNature?: PositionNature;
  justification?: string;
  positionCharacteristics?: string;
  candidateRequirements?: string;
  status: PositionStatus;
  closureDate?: Date;
  recruitmentDeadline: number;
  createdBy: string; // User ID (CO)
  assignedTo?: string; // User ID (RH)
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: string;
  jobRequestId?: string;
  department: Department;
  jobTitle: string;
  recruiter: Recruiter;
  source: RecruitmentSource;
  status: PositionStatus;
  mode?: RecruitmentMode;
  workSite?: WorkSite;
  budget: number;
  assignedCandidates: string[]; // Array of candidate IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id: string;
  positionId: string;
  department: Department;
  name: string;
  educationLevel: EducationLevel;
  familySituation?: string;
  studySpecialty?: string;
  yearsOfExperience: number;
  gender: Gender;
  source: RecruitmentSource;
  hrOpinion: Opinion;
  managerOpinion: Opinion;
  currentSalary?: number;
  salaryExpectation?: number;
  noticePeriod?: string;
  status: CandidateStatus;
  hiringCost: number;
  recruitmentMode: RecruitmentMode;
  recruiter: Recruiter;
  workSite?: WorkSite;
  createdAt: Date;
  updatedAt: Date;
}

// ============= SAMPLE USERS =============

export const users: User[] = [
  {
    id: 'user-1',
    name: 'SAADANI HIBA',
    email: 'hiba.saadani@company.com',
    role: 'RH',
    department: 'RH',
    phone: '+216 98 123 456',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-2',
    name: 'MOHAMED AYMEN BACOUCHE',
    email: 'aymen.bacouche@company.com',
    role: 'Manager',
    department: 'Production',
    phone: '+216 98 234 567',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-3',
    name: 'zoubaier berrebeh',
    email: 'zoubaier.berrebeh@company.com',
    role: 'CO',
    department: 'Méthode & Indus',
    phone: '+216 98 345 678',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-4',
    name: 'Ahmed Ben Ali',
    email: 'ahmed.benali@company.com',
    role: 'CO',
    department: 'Finance',
    phone: '+216 98 456 789',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-5',
    name: 'Leila Mansouri',
    email: 'leila.mansouri@company.com',
    role: 'Manager',
    department: 'Qualité',
    phone: '+216 98 567 890',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-6',
    name: 'Karim Trabelsi',
    email: 'karim.trabelsi@company.com',
    role: 'Direction',
    department: 'Direction Générale',
    phone: '+216 98 678 901',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// ============= NOTIFICATIONS =============

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'hiring_request',
    title: 'Nouvelle demande d\'embauche',
    message: 'zoubaier berrebeh a créé une demande pour Ingénieur Méthodes',
    relatedId: 'req-14',
    relatedType: 'jobRequest',
    isRead: false,
    createdAt: new Date('2025-01-05T10:30:00'),
    createdBy: 'user-3'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'hiring_request',
    title: 'Nouvelle demande d\'embauche',
    message: 'Ahmed Ben Ali a créé une demande pour Comptable',
    relatedId: 'req-5',
    relatedType: 'jobRequest',
    isRead: false,
    createdAt: new Date('2025-01-04T14:20:00'),
    createdBy: 'user-4'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'hiring_request',
    title: 'Nouvelle demande d\'embauche',
    message: 'MOHAMED AYMEN BACOUCHE a créé une demande pour Chef d\'équipe',
    relatedId: 'req-3',
    relatedType: 'jobRequest',
    isRead: true,
    createdAt: new Date('2025-01-02T09:15:00'),
    createdBy: 'user-2'
  }
];

// ============= REFERENCE DATA =============

export const recruiters: RecruiterInfo[] = [
  { id: '1', name: 'SAADANI HIBA', department: 'RH' },
  { id: '2', name: 'MOHAMED AYMEN BACOUCHE', department: 'Production' },
  { id: '3', name: 'zoubaier berrebeh', department: 'Méthode & Indus' }
];

export const departments: Department[] = [
  'RH', 'Production', 'Méthode & Indus', 'Finance', 
  'supply chain', 'Maintenance', 'HSE', 'Qualité', 'groupe', 'achat'
];

export const sources: RecruitmentSource[] = [
  'Site officiel', 'LinkedIn', 'Cabinet de recrutement',
  'Référence interne', 'Salon emploi', 'E-Mail', 'Autres'
];

export const candidateStatuses: CandidateStatus[] = [
  'Nouveau',
  'Traitement de dossier',
  'Entretien RH',
  'Entretien Technique',
  'Entretien Manager',
  'Entretien Final',
  'En attente de décision',
  'Offre envoyée',
  'Embauché',
  'Refus candidat',
  'Refus entreprise',
  'stand by'
];

export const positionStatuses: PositionStatus[] = [
  'Vacant',
  'En cours de traitement',
  'En cours',
  'Suspendu',
  'Annulé',
  'Embauché',
  'Terminé'
];

export const educationLevels: EducationLevel[] = [
  'Bac/ BTP', 'Bac+2 / BTS', 'Bac+3', 'Bac+4', 'Bac+5 / Ingénieur', 'Doctorat'
];

// ============= SAMPLE DATA =============

export const interviews: Interview[] = [
  {
    id: 'int-1',
    candidateId: '1',
    candidateName: 'Amine Ben Salem',
    type: 'Entretien RH',
    scheduledDate: new Date('2025-01-20T10:00:00'),
    duration: 60,
    location: 'Bureau RH - Salle A',
    interviewers: ['user-1'],
    status: 'Planifié',
    notes: 'Premier entretien de screening',
    createdBy: 'user-1',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  }
];

export const jobRequests: JobRequest[] = [
  {
    id: 'req-1',
    department: 'RH',
    jobTitle: 'Chargé de Recrutement',
    requestDate: new Date('2025-01-05'),
    status: 'En cours',
    closureDate: new Date('2026-01-05'),
    recruitmentDeadline: 365,
    createdBy: 'user-3',
    assignedTo: 'user-1',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05')
  },
  {
    id: 'req-2',
    department: 'RH',
    jobTitle: 'Chargé de Recrutement',
    requestDate: new Date('2025-01-06'),
    status: 'Embauché',
    closureDate: new Date('2026-01-06'),
    recruitmentDeadline: 365,
    createdBy: 'user-4',
    assignedTo: 'user-1',
    createdAt: new Date('2025-01-06'),
    updatedAt: new Date('2025-01-06')
  },
  {
    id: 'req-3',
    department: 'Production',
    jobTitle: 'Chef d\'équipe',
    requestDate: new Date('2025-01-02'),
    status: 'En cours de traitement',
    closureDate: new Date('2026-01-02'),
    recruitmentDeadline: 365,
    createdBy: 'user-2',
    assignedTo: 'user-1',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02')
  }
];

export const positions: Position[] = [
  {
    id: 'pos-1',
    jobRequestId: 'req-1',
    department: 'RH',
    jobTitle: 'Chargé de Recrutement',
    recruiter: 'SAADANI HIBA',
    source: 'Site officiel',
    status: 'Vacant',
    mode: 'Interne',
    workSite: 'TT',
    budget: 5000,
    assignedCandidates: ['1', '2'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'pos-2',
    jobRequestId: 'req-3',
    department: 'Production',
    jobTitle: 'Chef d\'équipe',
    recruiter: 'MOHAMED AYMEN BACOUCHE',
    source: 'LinkedIn',
    status: 'En cours',
    mode: 'Externe',
    workSite: 'TTG',
    budget: 8000,
    assignedCandidates: ['3'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'pos-3',
    jobRequestId: 'req-14',
    department: 'Méthode & Indus',
    jobTitle: 'Ingénieur Méthodes',
    recruiter: 'zoubaier berrebeh',
    source: 'Cabinet de recrutement',
    status: 'Vacant',
    mode: 'Externe',
    budget: 10000,
    assignedCandidates: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'pos-4',
    department: 'Finance',
    jobTitle: 'Comptable',
    recruiter: 'SAADANI HIBA',
    source: 'LinkedIn',
    status: 'Vacant',
    mode: 'Externe',
    budget: 6000,
    assignedCandidates: ['4'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

export const candidates: Candidate[] = [
  {
    id: '1',
    positionId: 'pos-1',
    department: 'RH',
    name: 'Amine Ben Salem',
    educationLevel: 'Bac+4',
    familySituation: 'Célibataire',
    studySpecialty: 'Gestion RH',
    yearsOfExperience: 10,
    gender: 'Homme',
    source: 'Cabinet de recrutement',
    hrOpinion: 'Passable',
    managerOpinion: 'Passable',
    currentSalary: 1800,
    salaryExpectation: 2200,
    noticePeriod: '1 mois',
    status: 'Entretien RH',
    hiringCost: 0,
    recruitmentMode: 'Externe',
    recruiter: 'SAADANI HIBA',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    positionId: 'pos-1',
    department: 'RH',
    name: 'Sarah Mansour',
    educationLevel: 'Bac+4',
    familySituation: 'Mariée',
    studySpecialty: 'Psychologie du travail',
    yearsOfExperience: 10,
    gender: 'Femme',
    source: 'Référence interne',
    hrOpinion: 'Favorable',
    managerOpinion: 'Favorable',
    currentSalary: 2000,
    salaryExpectation: 2400,
    noticePeriod: 'Immédiat',
    status: 'Embauché',
    hiringCost: 2400,
    recruitmentMode: 'Interne',
    recruiter: 'SAADANI HIBA',
    workSite: 'TT',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '3',
    positionId: 'pos-2',
    department: 'Production',
    name: 'Omar Dridi',
    educationLevel: 'Bac+4',
    familySituation: 'Marié',
    studySpecialty: 'Génie Industriel',
    yearsOfExperience: 8,
    gender: 'Homme',
    source: 'LinkedIn',
    hrOpinion: 'Favorable',
    managerOpinion: 'Prioritaire',
    currentSalary: 2200,
    salaryExpectation: 2600,
    noticePeriod: 'Immédiat',
    status: 'Entretien Technique',
    hiringCost: 0,
    recruitmentMode: 'Externe',
    recruiter: 'MOHAMED AYMEN BACOUCHE',
    workSite: 'TTG',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: '4',
    positionId: 'pos-2',
    department: 'Production',
    name: 'Fatma Mejri',
    educationLevel: 'Bac+3',
    familySituation: 'Célibataire',
    studySpecialty: 'Gestion de Production',
    yearsOfExperience: 5,
    gender: 'Femme',
    source: 'Salon emploi',
    hrOpinion: 'Defavorable',
    managerOpinion: 'Defavorable',
    currentSalary: 1500,
    salaryExpectation: 1900,
    noticePeriod: '2 mois',
    status: 'Traitement de dossier',
    hiringCost: 0,
    recruitmentMode: 'Externe',
    recruiter: 'MOHAMED AYMEN BACOUCHE',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-02-01')
  }
];

// ============= UTILITY FUNCTIONS =============

// User & Auth functions
export const getUserById = (userId: string): User | undefined => {
  return users.find(u => u.id === userId);
};

export const getUsersByRole = (role: UserRole): User[] => {
  return users.filter(u => u.role === role);
};

export const getRHUsers = (): User[] => {
  return getUsersByRole('RH');
};

export const getActiveUsers = (): User[] => {
  return users.filter(u => u.isActive);
};

export const createUser = (
  userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  creatorId: string
): User => {
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  users.push(newUser);
  
  // Notify RH and Direction
  const rhAndDirection = users.filter(u => u.role === 'RH' || u.role === 'Direction');
  const creator = getUserById(creatorId);
  
  rhAndDirection.forEach(user => {
    if (user.id !== creatorId) {
      createNotification({
        userId: user.id,
        type: 'candidate_update',
        title: 'Nouvel utilisateur créé',
        message: `${creator?.name} a créé un compte pour ${newUser.name} (${newUser.role})`,
        relatedId: newUser.id,
        relatedType: 'candidate',
        isRead: false,
        createdBy: creatorId
      });
    }
  });
  
  return newUser;
};

export const updateUser = (
  userId: string,
  updates: Partial<User>,
  updaterId: string
): User | null => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  return users[userIndex];
};

export const deleteUser = (userId: string): boolean => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return false;
  
  users.splice(userIndex, 1);
  return true;
};

export const toggleUserStatus = (userId: string): User | null => {
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  
  user.isActive = !user.isActive;
  user.updatedAt = new Date();
  return user;
};

// Interview functions
export const createInterview = (
  interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>,
  creatorId: string
): Interview => {
  const newInterview: Interview = {
    ...interview,
    id: `int-${Date.now()}`,
    createdBy: creatorId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  interviews.push(newInterview);
  
  // Update candidate status based on interview type
  const candidate = candidates.find(c => c.id === interview.candidateId);
  if (candidate) {
    candidate.status = interview.type as CandidateStatus;
    candidate.updatedAt = new Date();
  }
  
  // Notify interviewers
  interview.interviewers.forEach(interviewerId => {
    createNotification({
      userId: interviewerId,
      type: 'interview_scheduled',
      title: 'Entretien planifié',
      message: `Un ${interview.type} est planifié avec ${interview.candidateName}`,
      relatedId: newInterview.id,
      relatedType: 'interview',
      isRead: false,
      createdBy: creatorId
    });
  });
  
  return newInterview;
};

export const updateInterviewStatus = (
  interviewId: string,
  status: Interview['status'],
  result?: Interview['result']
): void => {
  const interview = interviews.find(i => i.id === interviewId);
  if (interview) {
    interview.status = status;
    if (result) interview.result = result;
    interview.updatedAt = new Date();
  }
};

export const getInterviewsByCandidate = (candidateId: string): Interview[] => {
  return interviews.filter(i => i.candidateId === candidateId);
};

export const getUpcomingInterviews = (): Interview[] => {
  const now = new Date();
  return interviews.filter(i => 
    i.scheduledDate > now && 
    (i.status === 'Planifié' || i.status === 'Confirmé')
  );
};

// Notification functions
export const createNotification = (
  notification: Omit<Notification, 'id' | 'createdAt'>
): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    createdAt: new Date()
  };
  notifications.push(newNotification);
  return newNotification;
};

export const getNotificationsByUser = (userId: string): Notification[] => {
  return notifications.filter(n => n.userId === userId);
};

export const getUnreadNotifications = (userId: string): Notification[] => {
  return notifications.filter(n => n.userId === userId && !n.isRead);
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

export const markAllNotificationsAsRead = (userId: string): void => {
  notifications
    .filter(n => n.userId === userId && !n.isRead)
    .forEach(n => n.isRead = true);
};

// Job Request functions with notifications
export const createJobRequest = (
  request: Omit<JobRequest, 'id' | 'createdAt' | 'updatedAt'>,
  creatorId: string
): JobRequest => {
  const newRequest: JobRequest = {
    ...request,
    id: `req-${Date.now()}`,
    createdBy: creatorId,
    status: 'En cours',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  jobRequests.push(newRequest);
  
  // Notify all RH users
  const rhUsers = getRHUsers();
  const creator = getUserById(creatorId);
  
  rhUsers.forEach(rhUser => {
    createNotification({
      userId: rhUser.id,
      type: 'hiring_request',
      title: 'Nouvelle demande d\'embauche',
      message: `${creator?.name || 'Un utilisateur'} a créé une demande pour ${newRequest.jobTitle}`,
      relatedId: newRequest.id,
      relatedType: 'jobRequest',
      isRead: false,
      createdBy: creatorId
    });
  });
  
  return newRequest;
};

export const updateJobRequestStatus = (
  requestId: string,
  status: PositionStatus,
  updaterId: string
): void => {
  const request = jobRequests.find(jr => jr.id === requestId);
  if (request) {
    const oldStatus = request.status;
    request.status = status;
    request.updatedAt = new Date();
    
    // Notify creator of status change
    const updater = getUserById(updaterId);
    createNotification({
      userId: request.createdBy,
      type: 'position_update',
      title: 'Mise à jour de demande',
      message: `Votre demande "${request.jobTitle}" est passée de "${oldStatus}" à "${status}" par ${updater?.name}`,
      relatedId: requestId,
      relatedType: 'jobRequest',
      isRead: false,
      createdBy: updaterId
    });
  }
};

export const getJobRequestsByDepartment = (department: Department): JobRequest[] => {
  return jobRequests.filter(jr => jr.department === department);
};

export const getJobRequestsByStatus = (status: PositionStatus): JobRequest[] => {
  return jobRequests.filter(jr => jr.status === status);
};

export const getJobRequestsByCreator = (userId: string): JobRequest[] => {
  return jobRequests.filter(jr => jr.createdBy === userId);
};

export const getActiveJobRequests = (): JobRequest[] => {
  return jobRequests.filter(jr => 
    jr.status === 'En cours' || jr.status === 'Vacant' || jr.status === 'En cours de traitement'
  );
};

// Candidate functions
export const updateCandidateStatus = (
  candidateId: string,
  status: CandidateStatus,
  updaterId: string
): void => {
  const candidate = candidates.find(c => c.id === candidateId);
  if (candidate) {
    const oldStatus = candidate.status;
    candidate.status = status;
    candidate.updatedAt = new Date();
    
    // Notify relevant users
    const updater = getUserById(updaterId);
    const rhUsers = getRHUsers();
    
    rhUsers.forEach(rhUser => {
      if (rhUser.id !== updaterId) {
        createNotification({
          userId: rhUser.id,
          type: 'status_change',
          title: 'Changement de statut candidat',
          message: `Le statut de ${candidate.name} est passé de "${oldStatus}" à "${status}" par ${updater?.name}`,
          relatedId: candidateId,
          relatedType: 'candidate',
          isRead: false,
          createdBy: updaterId
        });
      }
    });
  }
};

export const getCandidatesByDepartment = (department: Department): Candidate[] => {
  return candidates.filter(c => c.department === department);
};

export const getCandidatesByStatus = (status: CandidateStatus): Candidate[] => {
  return candidates.filter(c => c.status === status);
};

export const getHiredCandidates = (): Candidate[] => {
  return candidates.filter(c => c.status === 'Embauché');
};

// Position functions
export const assignCandidateToPosition = (
  positionId: string,
  candidateId: string,
  assignerId: string
): void => {
  const position = positions.find(p => p.id === positionId);
  const candidate = candidates.find(c => c.id === candidateId);
  
  if (position && candidate && !position.assignedCandidates.includes(candidateId)) {
    position.assignedCandidates.push(candidateId);
    position.updatedAt = new Date();
    
    candidate.positionId = positionId;
    candidate.updatedAt = new Date();
    
    // Notify RH
    const rhUsers = getRHUsers();
    const assigner = getUserById(assignerId);
    
    rhUsers.forEach(rh => {
      if (rh.id !== assignerId) {
        createNotification({
          userId: rh.id,
          type: 'candidate_update',
          title: 'Candidat assigné à un poste',
          message: `${candidate.name} a été assigné au poste "${position.jobTitle}" par ${assigner?.name}`,
          relatedId: positionId,
          relatedType: 'position',
          isRead: false,
          createdBy: assignerId
        });
      }
    });
  }
};

export const unassignCandidateFromPosition = (
  positionId: string,
  candidateId: string
): void => {
  const position = positions.find(p => p.id === positionId);
  if (position) {
    position.assignedCandidates = position.assignedCandidates.filter(id => id !== candidateId);
    position.updatedAt = new Date();
  }
};

export const getCandidatesByPosition = (positionId: string): Candidate[] => {
  const position = positions.find(p => p.id === positionId);
  if (!position) return [];
  
  return candidates.filter(c => position.assignedCandidates.includes(c.id));
};

export const getPositionsByStatus = (status: PositionStatus): Position[] => {
  return positions.filter(p => p.status === status);
};

export const getPositionsByDepartment = (department: Department): Position[] => {
  return positions.filter(p => p.department === department);
};

export const getVacantPositions = (): Position[] => {
  return positions.filter(p => p.status === 'Vacant');
};

// Dashboard KPIs
export interface PositionKPI {
  positionId: string;
  jobTitle: string;
  department: Department;
  candidateCount: number;
  budget: number;
  usedBudget: number;
  remainingBudget: number;
  status: PositionStatus;
  candidates: Candidate[];
}

export const getPositionKPIs = (): PositionKPI[] => {
  return positions.map(position => {
    const positionCandidates = getCandidatesByPosition(position.id);
    const usedBudget = positionCandidates.reduce((sum, c) => sum + c.hiringCost, 0);
    
    return {
      positionId: position.id,
      jobTitle: position.jobTitle,
      department: position.department,
      candidateCount: positionCandidates.length,
      budget: position.budget,
      usedBudget,
      remainingBudget: position.budget - usedBudget,
      status: position.status,
      candidates: positionCandidates
    };
  });
};

export const getDashboardStats = () => {
  const positionKPIs = getPositionKPIs();
  
  const totalBudget = positions.reduce((sum, p) => sum + p.budget, 0);
  const totalUsedBudget = positionKPIs.reduce((sum, kpi) => sum + kpi.usedBudget, 0);
  const totalCandidates = candidates.length;
  const totalPositions = positions.length;
  const vacantPositions = positions.filter(p => p.status === 'Vacant').length;
  const filledPositions = positions.filter(p => p.status === 'Embauché').length;
  
  const candidatesByStatus = candidates.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<CandidateStatus, number>);
  
  const budgetByDepartment = departments.reduce((acc, dept) => {
    const deptPositions = positions.filter(p => p.department === dept);
    const deptBudget = deptPositions.reduce((sum, p) => sum + p.budget, 0);
    const deptUsed = deptPositions.reduce((sum, p) => {
      const posCandidates = getCandidatesByPosition(p.id);
      return sum + posCandidates.reduce((s, c) => s + c.hiringCost, 0);
    }, 0);
    
    acc[dept] = { total: deptBudget, used: deptUsed, remaining: deptBudget - deptUsed };
    return acc;
  }, {} as Record<Department, { total: number; used: number; remaining: number }>);
  
  return {
    totalBudget,
    totalUsedBudget,
    remainingBudget: totalBudget - totalUsedBudget,
    budgetUtilizationRate: totalBudget > 0 ? (totalUsedBudget / totalBudget) * 100 : 0,
    totalCandidates,
    totalPositions,
    vacantPositions,
    filledPositions,
    candidatesByStatus,
    budgetByDepartment,
    positionKPIs
  };
};

// Analytics
export const getTotalHiringCost = (): number => {
  return candidates.reduce((sum, c) => sum + c.hiringCost, 0);
};

export const getConversionRate = (): number => {
  const total = candidates.length;
  const hired = candidates.filter(c => c.status === 'Embauché').length;
  return total > 0 ? (hired / total) * 100 : 0;
};

export const getJobRequestStats = () => {
  const total = jobRequests.length;
  const byStatus = jobRequests.reduce((acc, jr) => {
    acc[jr.status] = (acc[jr.status] || 0) + 1;
    return acc;
  }, {} as Record<PositionStatus, number>);
  
  const byDepartment = jobRequests.reduce((acc, jr) => {
    acc[jr.department] = (acc[jr.department] || 0) + 1;
    return acc;
  }, {} as Record<Department, number>);

  return { total, byStatus, byDepartment };
};

export const getCandidateStats = () => {
  const total = candidates.length;
  const byStatus = candidates.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<CandidateStatus, number>);
  
  return { total, byStatus };
};

// Permission checks
export const canCreateJobRequest = (user: User): boolean => {
  return user.role === 'CO';
};

export const canViewAllJobRequests = (user: User): boolean => {
  return user.role === 'RH' || user.role === 'Direction';
};

export const canManageCandidates = (user: User): boolean => {
  return user.role === 'RH' || user.role === 'Manager';
};

export const canScheduleInterview = (user: User): boolean => {
  return user.role === 'RH' || user.role === 'Manager';
};

export const canUpdateJobRequestStatus = (user: User): boolean => {
  return user.role === 'RH';
};

export const canManageUsers = (user: User): boolean => {
  return user.role === 'RH' || user.role === 'Direction';
};

export const canViewDashboard = (user: User): boolean => {
  return user.role === 'RH' || user.role === 'Direction' || user.role === 'Manager';
};
