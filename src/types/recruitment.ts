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
  | 'achat'
  | 'Logistique';

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
  | 'En cours'
  | 'Suspendu'
  | 'Annulé'
  | 'Embauché'
  | 'Terminé';

export type RecruitmentMode = 'Interne' | 'Externe';

export type WorkSite = 'TT' | 'TTG';

export type Gender = 'Homme' | 'Femme';

export type CandidateStatus = 
  | 'En cours'
  | 'Embauché'
  | 'refus de l\'offre'
  | 'Non embauché'
  | 'Prioritaire'
  | 'stand by'
  | 'Refus du candidat';

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

export type PositionNature = 'creation' | 'remplacemnt';

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
  recruitmentDeadline: number; // en jours
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: string;
  jobRequestId?: string;
  department: Department;
  recruiter: Recruiter;
  source: RecruitmentSource;
  status: PositionStatus;
  mode?: RecruitmentMode;
  workSite?: WorkSite;
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

// ============= REFERENCE DATA =============

export const recruiters: RecruiterInfo[] = [
  {
    id: '1',
    name: 'SAADANI HIBA',
    department: 'RH'
  },
  {
    id: '2',
    name: 'MOHAMED AYMEN BACOUCHE',
    department: 'Production'
  },
  {
    id: '3',
    name: 'zoubaier berrebeh',
    department: 'Méthode & Indus'
  }
];

export const departments: Department[] = [
  'RH',
  'Production',
  'Méthode & Indus',
  'Finance',
  'supply chain',
  'Maintenance',
  'HSE',
  'Qualité',
  'groupe',
  'achat'
];

export const sources: RecruitmentSource[] = [
  'Site officiel',
  'LinkedIn',
  'Cabinet de recrutement',
  'Référence interne',
  'Salon emploi',
  'E-Mail',
  'Autres'
];

export const positionStatuses: PositionStatus[] = [
  'Vacant',
  'En cours',
  'Suspendu',
  'Annulé',
  'Embauché',
  'Terminé'
];

export const candidateStatuses: CandidateStatus[] = [
  'En cours',
  'Embauché',
  'refus de l\'offre',
  'Non embauché',
  'Prioritaire',
  'stand by'
];

export const educationLevels: EducationLevel[] = [
  'Bac/ BTP',
  'Bac+2 / BTS',
  'Bac+3',
  'Bac+4',
  'Bac+5 / Ingénieur',
  'Doctorat'
];

// ============= SAMPLE DATA =============

export const jobRequests: JobRequest[] = [
  {
    id: 'req-1',
    department: 'RH',
    jobTitle: 'Chargé de Recrutement',
    requestDate: new Date('2025-01-05'),
    site: undefined,
    positionNature: undefined,
    justification: '',
    positionCharacteristics: '',
    candidateRequirements: '',
    status: 'En cours',
    closureDate: new Date('2026-01-05'),
    recruitmentDeadline: 365,
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
    createdAt: new Date('2025-01-06'),
    updatedAt: new Date('2025-01-06')
  },
  {
    id: 'req-3',
    department: 'Production',
    jobTitle: 'Chef d\'équipe',
    requestDate: new Date('2025-01-02'),
    status: 'Embauché',
    closureDate: new Date('2026-01-02'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02')
  },
  {
    id: 'req-4',
    department: 'Production',
    jobTitle: 'Chef d\'équipe',
    requestDate: new Date('2025-01-03'),
    status: 'En cours',
    closureDate: new Date('2026-01-03'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03')
  },
  {
    id: 'req-5',
    department: 'Finance',
    jobTitle: 'Comptable',
    requestDate: new Date('2025-01-04'),
    status: 'Vacant',
    closureDate: new Date('2026-01-04'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-04'),
    updatedAt: new Date('2025-01-04')
  },
  {
    id: 'req-6',
    department: 'Logistique',
    jobTitle: 'Responsable Logistique',
    requestDate: new Date('2025-01-01'),
    status: 'Vacant',
    closureDate: new Date('2026-01-01'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: 'req-7',
    department: 'Finance',
    jobTitle: 'Comptable',
    requestDate: new Date('2025-01-05'),
    status: 'Suspendu',
    closureDate: new Date('2026-01-05'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05')
  },
  {
    id: 'req-8',
    department: 'Maintenance',
    jobTitle: 'Technicien',
    requestDate: new Date('2025-01-07'),
    status: 'Annulé',
    closureDate: new Date('2026-01-07'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-07'),
    updatedAt: new Date('2025-01-07')
  },
  {
    id: 'req-9',
    department: 'Qualité',
    jobTitle: 'Ingénieur Qualité',
    requestDate: new Date('2025-01-03'),
    status: 'Embauché',
    closureDate: new Date('2026-01-03'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03')
  },
  {
    id: 'req-10',
    department: 'Production',
    jobTitle: 'Chef d\'équipe',
    requestDate: new Date('2025-01-04'),
    status: 'En cours',
    closureDate: new Date('2026-01-04'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-04'),
    updatedAt: new Date('2025-01-04')
  },
  {
    id: 'req-11',
    department: 'HSE',
    jobTitle: 'Responsable HSE',
    requestDate: new Date('2025-01-02'),
    status: 'En cours',
    closureDate: new Date('2026-01-02'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02')
  },
  {
    id: 'req-12',
    department: 'RH',
    jobTitle: 'Chargé de Recrutement',
    requestDate: new Date('2025-01-06'),
    status: 'En cours',
    closureDate: new Date('2026-01-06'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-06'),
    updatedAt: new Date('2025-01-06')
  },
  {
    id: 'req-13',
    department: 'Logistique',
    jobTitle: 'Responsable Logistique',
    requestDate: new Date('2025-01-01'),
    status: 'Annulé',
    closureDate: new Date('2026-01-01'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: 'req-14',
    department: 'Méthode & Indus',
    jobTitle: 'Ingénieur Méthodes',
    requestDate: new Date('2025-01-05'),
    status: 'Embauché',
    closureDate: new Date('2026-01-05'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05')
  },
  {
    id: 'req-15',
    department: 'Maintenance',
    jobTitle: 'Technicien',
    requestDate: new Date('2025-01-07'),
    status: 'Suspendu',
    closureDate: new Date('2026-01-07'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-07'),
    updatedAt: new Date('2025-01-07')
  },
  {
    id: 'req-16',
    department: 'Qualité',
    jobTitle: 'Ingénieur Qualité',
    requestDate: new Date('2025-01-03'),
    status: 'Vacant',
    closureDate: new Date('2026-01-03'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03')
  },
  {
    id: 'req-17',
    department: 'Qualité',
    jobTitle: 'Comptable',
    requestDate: new Date('2025-01-04'),
    status: 'En cours',
    closureDate: new Date('2026-01-04'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-04'),
    updatedAt: new Date('2025-01-04')
  },
  {
    id: 'req-18',
    department: 'Production',
    jobTitle: 'Chef d\'équipe',
    requestDate: new Date('2025-01-03'),
    status: 'Terminé',
    closureDate: new Date('2026-01-03'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-03')
  },
  {
    id: 'req-19',
    department: 'HSE',
    jobTitle: 'Responsable HSE',
    requestDate: new Date('2025-01-02'),
    status: 'Suspendu',
    closureDate: new Date('2026-01-02'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02')
  },
  {
    id: 'req-20',
    department: 'Méthode & Indus',
    jobTitle: 'Ingénieur Méthodes',
    requestDate: new Date('2025-01-05'),
    status: 'Suspendu',
    closureDate: new Date('2026-01-05'),
    recruitmentDeadline: 365,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05')
  }
];

export const positions: Position[] = [
  {
    id: 'pos-1',
    jobRequestId: 'req-1',
    department: 'RH',
    recruiter: 'SAADANI HIBA',
    source: 'Site officiel',
    status: 'Vacant',
    mode: 'Interne',
    workSite: 'TT',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'pos-2',
    jobRequestId: 'req-3',
    department: 'Production',
    recruiter: 'MOHAMED AYMEN BACOUCHE',
    source: 'LinkedIn',
    status: 'En cours',
    mode: 'Externe',
    workSite: 'TTG',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'pos-3',
    jobRequestId: 'req-14',
    department: 'Méthode & Indus',
    recruiter: 'zoubaier berrebeh',
    source: 'Cabinet de recrutement',
    status: 'Suspendu',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-05')
  }
];

export const candidates: Candidate[] = [
  {
    id: '1',
    positionId: 'pos-1',
    department: 'RH',
    name: 'Amine Ben Salem',
    educationLevel: 'Bac+4',
    familySituation: '',
    studySpecialty: '',
    yearsOfExperience: 10,
    gender: 'Homme',
    source: 'Cabinet de recrutement',
    hrOpinion: 'Passable',
    managerOpinion: 'Passable',
    currentSalary: 0,
    salaryExpectation: 0,
    noticePeriod: '',
    status: 'En cours',
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
    familySituation: '',
    studySpecialty: '',
    yearsOfExperience: 10,
    gender: 'Femme',
    source: 'Référence interne',
    hrOpinion: 'Favorable',
    managerOpinion: 'Favorable',
    currentSalary: 0,
    salaryExpectation: 0,
    noticePeriod: '',
    status: 'Embauché',
    hiringCost: 2400,
    recruitmentMode: 'Interne',
    recruiter: 'SAADANI HIBA',
    workSite: 'TT',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-02-01')
  }
];

// ============= UTILITY FUNCTIONS =============

// Job Request queries
export const getJobRequestsByDepartment = (department: Department): JobRequest[] => {
  return jobRequests.filter(jr => jr.department === department);
};

export const getJobRequestsByStatus = (status: PositionStatus): JobRequest[] => {
  return jobRequests.filter(jr => jr.status === status);
};

export const getActiveJobRequests = (): JobRequest[] => {
  return jobRequests.filter(jr => 
    jr.status === 'En cours' || jr.status === 'Vacant'
  );
};

export const getJobRequestsByJobTitle = (jobTitle: string): JobRequest[] => {
  return jobRequests.filter(jr => 
    jr.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())
  );
};

export const getOverdueJobRequests = (): JobRequest[] => {
  const today = new Date();
  return jobRequests.filter(jr => {
    if (!jr.closureDate) return false;
    return jr.closureDate < today && 
           (jr.status === 'En cours' || jr.status === 'Vacant');
  });
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

// Candidate queries
export const getCandidatesByDepartment = (department: Department): Candidate[] => {
  return candidates.filter(c => c.department === department);
};

export const getCandidatesByStatus = (status: CandidateStatus): Candidate[] => {
  return candidates.filter(c => c.status === status);
};

export const getCandidatesByRecruiter = (recruiter: Recruiter): Candidate[] => {
  return candidates.filter(c => c.recruiter === recruiter);
};

export const getHiredCandidates = (): Candidate[] => {
  return candidates.filter(c => c.status === 'Embauché');
};

export const getCandidatesByRecruitmentMode = (mode: RecruitmentMode): Candidate[] => {
  return candidates.filter(c => c.recruitmentMode === mode);
};

// Position queries
export const getPositionsByStatus = (status: PositionStatus): Position[] => {
  return positions.filter(p => p.status === status);
};

export const getPositionsByDepartment = (department: Department): Position[] => {
  return positions.filter(p => p.department === department);
};

export const getPositionsByRecruiter = (recruiter: Recruiter): Position[] => {
  return positions.filter(p => p.recruiter === recruiter);
};

export const getPositionWithJobRequest = (positionId: string) => {
  const position = positions.find(p => p.id === positionId);
  if (!position) return null;
  
  const jobRequest = position.jobRequestId 
    ? jobRequests.find(jr => jr.id === position.jobRequestId)
    : null;
    
  return { position, jobRequest };
};

// Analytics
export const getTotalHiringCost = (): number => {
  return candidates.reduce((sum, c) => sum + c.hiringCost, 0);
};

export const getHiringCostByDepartment = (department: Department): number => {
  return candidates
    .filter(c => c.department === department)
    .reduce((sum, c) => sum + c.hiringCost, 0);
};

export const getCandidateCountByStatus = (): Record<CandidateStatus, number> => {
  return candidates.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<CandidateStatus, number>);
};

export const getConversionRate = (): number => {
  const total = candidates.length;
  const hired = candidates.filter(c => c.status === 'Embauché').length;
  return total > 0 ? (hired / total) * 100 : 0;
};

export const getAverageHiringCost = (): number => {
  const hiredCandidates = getHiredCandidates();
  const totalCost = hiredCandidates.reduce((sum, c) => sum + c.hiringCost, 0);
  return hiredCandidates.length > 0 ? totalCost / hiredCandidates.length : 0;
};

export const getAverageRecruitmentTime = (): number => {
  const completedRequests = jobRequests.filter(jr => 
    jr.status === 'Embauché' || jr.status === 'Terminé'
  );
  
  if (completedRequests.length === 0) return 0;
  
  const totalDays = completedRequests.reduce((sum, jr) => {
    if (!jr.closureDate) return sum;
    const days = Math.floor(
      (jr.closureDate.getTime() - jr.requestDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return sum + days;
  }, 0);
  
  return totalDays / completedRequests.length;
};

export const getRecruiterPerformance = () => {
  return recruiters.map(recruiter => {
    const recruiterCandidates = getCandidatesByRecruiter(recruiter.name);
    const hired = recruiterCandidates.filter(c => c.status === 'Embauché').length;
    const total = recruiterCandidates.length;
    const conversionRate = total > 0 ? (hired / total) * 100 : 0;
    const totalCost = recruiterCandidates.reduce((sum, c) => sum + c.hiringCost, 0);
    
    return {
      recruiter: recruiter.name,
      department: recruiter.department,
      totalCandidates: total,
      hired,
      conversionRate: conversionRate.toFixed(2),
      totalCost
    };
  });
};

// Validation helpers
export const isValidDepartment = (value: string): value is Department => {
  return departments.includes(value as Department);
};

export const isValidRecruiter = (value: string): value is Recruiter => {
  return recruiters.some(r => r.name === value);
};

export const isValidStatus = (value: string): value is CandidateStatus => {
  return candidateStatuses.includes(value as CandidateStatus);
};
