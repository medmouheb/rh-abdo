// types/recruitment.ts

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

export interface Position {
  id: string;
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

export const positions: Position[] = [
  {
    id: 'pos-1',
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
