import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============= REFERENCE DATA TYPES =============

type Recruiter = 
  | 'SAADANI HIBA'
  | 'MOHAMED AYMEN BACOUCHE'
  | 'zoubaier berrebeh';

type Department = 
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
  | 'Logistique';  // Added

type RecruitmentSource = 
  | 'Site officiel'
  | 'LinkedIn'
  | 'Cabinet de recrutement'
  | 'Référence interne'
  | 'Salon emploi'
  | 'E-Mail'
  | 'Autres';

type PositionStatus = 
  | 'Vacant'
  | 'En cours'
  | 'Suspendu'
  | 'Annulé'
  | 'Embauché'
  | 'Terminé';

type RecruitmentMode = 'Interne' | 'Externe';
type WorkSite = 'TT' | 'TTG';
type Gender = 'Homme' | 'Femme';

type CandidateStatus = 
  | 'En cours'
  | 'Embauché'
  | 'refus de l\'offre'
  | 'Non embauché'
  | 'Prioritaire'
  | 'stand by'
  | 'Refus du candidat';

type Opinion = 
  | 'Favorable'
  | 'Defavorable'
  | 'Prioritaire'
  | 'Passable'
  | 'stand by';

type EducationLevel = 
  | 'Bac/ BTP'
  | 'Bac+2 / BTS'
  | 'Bac+3'
  | 'Bac+4'
  | 'Bac+5 / Ingénieur'
  | 'Doctorat';

// ============= INTERFACES =============

interface RecruiterInfo {
  id: string;
  name: Recruiter;
  department: Department;
}

interface JobRequest {
  id: string;
  department: Department;
  jobTitle: string;
  requestDate: Date;
  site?: WorkSite;
  status: PositionStatus;
  closureDate?: Date;
  recruitmentDeadline: number; // en jours
  createdAt: Date;
  updatedAt: Date;
  justification?: string;
  positionCharacteristics?: string;
  candidateRequirements?: string;
}

interface Position {
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

interface CandidateData {
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

// ============= DATA =============

const recruiters: RecruiterInfo[] = [
  { id: '1', name: 'SAADANI HIBA', department: 'RH' },
  { id: '2', name: 'MOHAMED AYMEN BACOUCHE', department: 'Production' },
  { id: '3', name: 'zoubaier berrebeh', department: 'Méthode & Indus' }
];

const jobRequests: JobRequest[] = [
  { id: 'req-1', department: 'RH', jobTitle: 'Chargé de Recrutement', requestDate: new Date('2025-01-05'), status: 'En cours', closureDate: new Date('2026-01-05'), recruitmentDeadline: 365, createdAt: new Date('2025-01-05'), updatedAt: new Date('2025-01-05') },
  { id: 'req-2', department: 'RH', jobTitle: 'Chargé de Recrutement', requestDate: new Date('2025-01-06'), status: 'Embauché', closureDate: new Date('2026-01-06'), recruitmentDeadline: 365, createdAt: new Date('2025-01-06'), updatedAt: new Date('2025-01-06') },
  { id: 'req-3', department: 'Production', jobTitle: 'Chef d\'équipe', requestDate: new Date('2025-01-02'), status: 'Embauché', closureDate: new Date('2026-01-02'), recruitmentDeadline: 365, createdAt: new Date('2025-01-02'), updatedAt: new Date('2025-01-02') },
  { id: 'req-4', department: 'Production', jobTitle: 'Chef d\'équipe', requestDate: new Date('2025-01-03'), status: 'En cours', closureDate: new Date('2026-01-03'), recruitmentDeadline: 365, createdAt: new Date('2025-01-03'), updatedAt: new Date('2025-01-03') },
  { id: 'req-5', department: 'Finance', jobTitle: 'Comptable', requestDate: new Date('2025-01-04'), status: 'Vacant', closureDate: new Date('2026-01-04'), recruitmentDeadline: 365, createdAt: new Date('2025-01-04'), updatedAt: new Date('2025-01-04') },
  { id: 'req-6', department: 'Logistique', jobTitle: 'Responsable Logistique', requestDate: new Date('2025-01-01'), status: 'Vacant', closureDate: new Date('2026-01-01'), recruitmentDeadline: 365, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 'req-7', department: 'Finance', jobTitle: 'Comptable', requestDate: new Date('2025-01-05'), status: 'Suspendu', closureDate: new Date('2026-01-05'), recruitmentDeadline: 365, createdAt: new Date('2025-01-05'), updatedAt: new Date('2025-01-05') },
  { id: 'req-8', department: 'Maintenance', jobTitle: 'Technicien', requestDate: new Date('2025-01-07'), status: 'Annulé', closureDate: new Date('2026-01-07'), recruitmentDeadline: 365, createdAt: new Date('2025-01-07'), updatedAt: new Date('2025-01-07') },
  { id: 'req-9', department: 'Qualité', jobTitle: 'Ingénieur Qualité', requestDate: new Date('2025-01-03'), status: 'Embauché', closureDate: new Date('2026-01-03'), recruitmentDeadline: 365, createdAt: new Date('2025-01-03'), updatedAt: new Date('2025-01-03') },
  { id: 'req-10', department: 'Production', jobTitle: 'Chef d\'équipe', requestDate: new Date('2025-01-04'), status: 'En cours', closureDate: new Date('2026-01-04'), recruitmentDeadline: 365, createdAt: new Date('2025-01-04'), updatedAt: new Date('2025-01-04') },
  { id: 'req-11', department: 'HSE', jobTitle: 'Responsable HSE', requestDate: new Date('2025-01-02'), status: 'En cours', closureDate: new Date('2026-01-02'), recruitmentDeadline: 365, createdAt: new Date('2025-01-02'), updatedAt: new Date('2025-01-02') },
  { id: 'req-12', department: 'RH', jobTitle: 'Chargé de Recrutement', requestDate: new Date('2025-01-06'), status: 'En cours', closureDate: new Date('2026-01-06'), recruitmentDeadline: 365, createdAt: new Date('2025-01-06'), updatedAt: new Date('2025-01-06') },
  { id: 'req-13', department: 'Logistique', jobTitle: 'Responsable Logistique', requestDate: new Date('2025-01-01'), status: 'Annulé', closureDate: new Date('2026-01-01'), recruitmentDeadline: 365, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
  { id: 'req-14', department: 'Méthode & Indus', jobTitle: 'Ingénieur Méthodes', requestDate: new Date('2025-01-05'), status: 'Embauché', closureDate: new Date('2026-01-05'), recruitmentDeadline: 365, createdAt: new Date('2025-01-05'), updatedAt: new Date('2025-01-05') },
  { id: 'req-15', department: 'Maintenance', jobTitle: 'Technicien', requestDate: new Date('2025-01-07'), status: 'Suspendu', closureDate: new Date('2026-01-07'), recruitmentDeadline: 365, createdAt: new Date('2025-01-07'), updatedAt: new Date('2025-01-07') },
  { id: 'req-16', department: 'Qualité', jobTitle: 'Ingénieur Qualité', requestDate: new Date('2025-01-03'), status: 'Vacant', closureDate: new Date('2026-01-03'), recruitmentDeadline: 365, createdAt: new Date('2025-01-03'), updatedAt: new Date('2025-01-03') },
  { id: 'req-17', department: 'Qualité', jobTitle: 'Comptable', requestDate: new Date('2025-01-04'), status: 'En cours', closureDate: new Date('2026-01-04'), recruitmentDeadline: 365, createdAt: new Date('2025-01-04'), updatedAt: new Date('2025-01-04') },
  { id: 'req-18', department: 'Production', jobTitle: 'Chef d\'équipe', requestDate: new Date('2025-01-03'), status: 'Terminé', closureDate: new Date('2026-01-03'), recruitmentDeadline: 365, createdAt: new Date('2025-01-03'), updatedAt: new Date('2025-01-03') },
  { id: 'req-19', department: 'HSE', jobTitle: 'Responsable HSE', requestDate: new Date('2025-01-02'), status: 'Suspendu', closureDate: new Date('2026-01-02'), recruitmentDeadline: 365, createdAt: new Date('2025-01-02'), updatedAt: new Date('2025-01-02') },
  { id: 'req-20', department: 'Méthode & Indus', jobTitle: 'Ingénieur Méthodes', requestDate: new Date('2025-01-05'), status: 'Suspendu', closureDate: new Date('2026-01-05'), recruitmentDeadline: 365, createdAt: new Date('2025-01-05'), updatedAt: new Date('2025-01-05') }
];

const positions: Position[] = [
  { id: 'pos-1', jobRequestId: 'req-1', department: 'RH', recruiter: 'SAADANI HIBA', source: 'Site officiel', status: 'Vacant', mode: 'Interne', workSite: 'TT', createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-15') },
  { id: 'pos-2', jobRequestId: 'req-3', department: 'Production', recruiter: 'MOHAMED AYMEN BACOUCHE', source: 'LinkedIn', status: 'En cours', mode: 'Externe', workSite: 'TTG', createdAt: new Date('2024-02-01'), updatedAt: new Date('2024-02-10') },
  { id: 'pos-3', jobRequestId: 'req-14', department: 'Méthode & Indus', recruiter: 'zoubaier berrebeh', source: 'Cabinet de recrutement', status: 'Suspendu', createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-02-05') }
];

const candidates: CandidateData[] = [
  { id: '1', positionId: 'pos-1', department: 'RH', name: 'Amine Ben Salem', educationLevel: 'Bac+4', familySituation: 'Célibataire', studySpecialty: 'Gestion RH', yearsOfExperience: 10, gender: 'Homme', source: 'Cabinet de recrutement', hrOpinion: 'Passable', managerOpinion: 'Passable', currentSalary: 1800, salaryExpectation: 2200, noticePeriod: '1 mois', status: 'En cours', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'SAADANI HIBA', createdAt: new Date('2024-01-16'), updatedAt: new Date('2024-01-20') },
  { id: '2', positionId: 'pos-1', department: 'RH', name: 'Sarah Mansour', educationLevel: 'Bac+4', familySituation: 'Mariée', studySpecialty: 'Psychologie du travail', yearsOfExperience: 10, gender: 'Femme', source: 'Référence interne', hrOpinion: 'Favorable', managerOpinion: 'Favorable', currentSalary: 2000, salaryExpectation: 2400, noticePeriod: 'Immédiat', status: 'Embauché', hiringCost: 2400, recruitmentMode: 'Interne', recruiter: 'SAADANI HIBA', workSite: 'TT', createdAt: new Date('2024-01-18'), updatedAt: new Date('2024-02-01') },
  { id: '3', positionId: 'pos-2', department: 'Production', name: 'Omar Dridi', educationLevel: 'Bac+4', familySituation: 'Marié', studySpecialty: 'Génie Industriel', yearsOfExperience: 8, gender: 'Homme', source: 'Référence interne', hrOpinion: 'Favorable', managerOpinion: 'Prioritaire', currentSalary: 2200, salaryExpectation: 2600, noticePeriod: 'Immédiat', status: 'Embauché', hiringCost: 2400, recruitmentMode: 'Interne', recruiter: 'MOHAMED AYMEN BACOUCHE', workSite: 'TTG', createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-02-05') },
  { id: '4', positionId: 'pos-2', department: 'Production', name: 'Fatma Mejri', educationLevel: 'Bac+3', familySituation: 'Célibataire', studySpecialty: 'Gestion de Production', yearsOfExperience: 5, gender: 'Femme', source: 'Salon emploi', hrOpinion: 'Defavorable', managerOpinion: 'Defavorable', currentSalary: 1500, salaryExpectation: 1900, noticePeriod: '2 mois', status: 'Refus du candidat', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'MOHAMED AYMEN BACOUCHE', createdAt: new Date('2024-01-22'), updatedAt: new Date('2024-02-01') },
  { id: '5', positionId: 'pos-3', department: 'Finance', name: 'Yassine Ghorbel', educationLevel: 'Doctorat', familySituation: 'Marié', studySpecialty: 'Finance & Comptabilité', yearsOfExperience: 12, gender: 'Homme', source: 'Salon emploi', hrOpinion: 'Prioritaire', managerOpinion: 'Favorable', currentSalary: 3500, salaryExpectation: 4200, noticePeriod: '3 mois', status: 'Prioritaire', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'SAADANI HIBA', createdAt: new Date('2024-01-25'), updatedAt: new Date('2024-02-08') },
  { id: '6', positionId: 'pos-1', department: 'Logistique', name: 'Meriem Toumi', educationLevel: 'Bac/ BTP', familySituation: 'Célibataire', studySpecialty: 'Logistique & Transport', yearsOfExperience: 7, gender: 'Femme', source: 'Cabinet de recrutement', hrOpinion: 'Passable', managerOpinion: 'Favorable', currentSalary: 1600, salaryExpectation: 2000, noticePeriod: '1 mois', status: 'stand by', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'SAADANI HIBA', createdAt: new Date('2024-02-01'), updatedAt: new Date('2024-02-10') },
  { id: '7', positionId: 'pos-2', department: 'Finance', name: 'Sonia Kasraoui', educationLevel: 'Bac+5 / Ingénieur', familySituation: 'Mariée', studySpecialty: 'Audit & Contrôle', yearsOfExperience: 9, gender: 'Femme', source: 'Référence interne', hrOpinion: 'Favorable', managerOpinion: 'Favorable', currentSalary: 2800, salaryExpectation: 3200, noticePeriod: 'Immédiat', status: 'Embauché', hiringCost: 2000, recruitmentMode: 'Interne', recruiter: 'SAADANI HIBA', workSite: 'TT', createdAt: new Date('2024-02-03'), updatedAt: new Date('2024-02-15') },
  { id: '8', positionId: 'pos-3', department: 'Maintenance', name: 'Walid Jendoubi', educationLevel: 'Bac+4', familySituation: 'Marié', studySpecialty: 'Maintenance Industrielle', yearsOfExperience: 11, gender: 'Homme', source: 'Référence interne', hrOpinion: 'Favorable', managerOpinion: 'Prioritaire', currentSalary: 2100, salaryExpectation: 2500, noticePeriod: 'Immédiat', status: 'Embauché', hiringCost: 2100, recruitmentMode: 'Interne', recruiter: 'MOHAMED AYMEN BACOUCHE', workSite: 'TTG', createdAt: new Date('2024-02-05'), updatedAt: new Date('2024-02-18') },
  { id: '9', positionId: 'pos-1', department: 'Qualité', name: 'Ines Ben Amor', educationLevel: 'Bac+2 / BTS', familySituation: 'Célibataire', studySpecialty: 'Qualité & Normes', yearsOfExperience: 4, gender: 'Femme', source: 'LinkedIn', hrOpinion: 'Defavorable', managerOpinion: 'Defavorable', currentSalary: 1300, salaryExpectation: 1700, noticePeriod: '1 mois', status: 'Refus du candidat', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'SAADANI HIBA', createdAt: new Date('2024-02-07'), updatedAt: new Date('2024-02-12') },
  { id: '10', positionId: 'pos-2', department: 'Production', name: 'Sami Kallel', educationLevel: 'Bac+3', familySituation: 'Marié', studySpecialty: 'Gestion de Production', yearsOfExperience: 6, gender: 'Homme', source: 'LinkedIn', hrOpinion: 'Favorable', managerOpinion: 'Prioritaire', currentSalary: 1700, salaryExpectation: 2100, noticePeriod: '1 mois', status: 'Embauché', hiringCost: 1800, recruitmentMode: 'Externe', recruiter: 'MOHAMED AYMEN BACOUCHE', workSite: 'TTG', createdAt: new Date('2024-02-10'), updatedAt: new Date('2024-02-20') },
  { id: '11', positionId: 'pos-3', department: 'HSE', name: 'Mourad Nefzi', educationLevel: 'Bac/ BTP', familySituation: 'Célibataire', studySpecialty: 'Hygiène & Sécurité', yearsOfExperience: 8, gender: 'Homme', source: 'Cabinet de recrutement', hrOpinion: 'Prioritaire', managerOpinion: 'Favorable', currentSalary: 1900, salaryExpectation: 2300, noticePeriod: '2 mois', status: 'Prioritaire', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'zoubaier berrebeh', createdAt: new Date('2024-02-12'), updatedAt: new Date('2024-02-22') },
  { id: '12', positionId: 'pos-1', department: 'RH', name: 'Leila Ayari', educationLevel: 'Doctorat', familySituation: 'Mariée', studySpecialty: 'Gestion des Ressources Humaines', yearsOfExperience: 15, gender: 'Femme', source: 'LinkedIn', hrOpinion: 'Prioritaire', managerOpinion: 'Favorable', currentSalary: 3800, salaryExpectation: 4500, noticePeriod: '3 mois', status: 'Prioritaire', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'SAADANI HIBA', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-25') },
  { id: '13', positionId: 'pos-2', department: 'Logistique', name: 'Hamza Riahi', educationLevel: 'Bac/ BTP', familySituation: 'Marié', studySpecialty: 'Supply Chain', yearsOfExperience: 10, gender: 'Homme', source: 'Site officiel', hrOpinion: 'Prioritaire', managerOpinion: 'Prioritaire', currentSalary: 2300, salaryExpectation: 2800, noticePeriod: '1 mois', status: 'Prioritaire', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'MOHAMED AYMEN BACOUCHE', createdAt: new Date('2024-02-18'), updatedAt: new Date('2024-03-01') },
  { id: '14', positionId: 'pos-3', department: 'Méthode & Indus', name: 'Anis Gharbi', educationLevel: 'Bac+4', familySituation: 'Célibataire', studySpecialty: 'Ingénierie Industrielle', yearsOfExperience: 7, gender: 'Homme', source: 'E-Mail', hrOpinion: 'Passable', managerOpinion: 'Favorable', currentSalary: 1800, salaryExpectation: 2200, noticePeriod: '1 mois', status: 'stand by', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'zoubaier berrebeh', createdAt: new Date('2024-02-20'), updatedAt: new Date('2024-03-05') },
  { id: '15', positionId: 'pos-1', department: 'Maintenance', name: 'Zied Bacha', educationLevel: 'Bac+3', familySituation: 'Marié', studySpecialty: 'Électromécanique', yearsOfExperience: 9, gender: 'Homme', source: 'Cabinet de recrutement', hrOpinion: 'Passable', managerOpinion: 'Prioritaire', currentSalary: 1900, salaryExpectation: 2400, noticePeriod: '2 mois', status: 'stand by', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'MOHAMED AYMEN BACOUCHE', createdAt: new Date('2024-02-22'), updatedAt: new Date('2024-03-08') },
  { id: '16', positionId: 'pos-2', department: 'Qualité', name: 'Olfa Hammami', educationLevel: 'Bac+4', familySituation: 'Célibataire', studySpecialty: 'Management de la Qualité', yearsOfExperience: 5, gender: 'Femme', source: 'Site officiel', hrOpinion: 'Defavorable', managerOpinion: 'Defavorable', currentSalary: 1600, salaryExpectation: 2000, noticePeriod: '1 mois', status: 'Refus du candidat', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'SAADANI HIBA', createdAt: new Date('2024-02-25'), updatedAt: new Date('2024-03-02') },
  { id: '17', positionId: 'pos-3', department: 'Finance', name: 'Kais Slimane', educationLevel: 'Bac+2 / BTS', familySituation: 'Marié', studySpecialty: 'Comptabilité', yearsOfExperience: 6, gender: 'Homme', source: 'Cabinet de recrutement', hrOpinion: 'Defavorable', managerOpinion: 'Defavorable', currentSalary: 1400, salaryExpectation: 1800, noticePeriod: '1 mois', status: 'Non embauché', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'SAADANI HIBA', createdAt: new Date('2024-02-28'), updatedAt: new Date('2024-03-10') },
  { id: '18', positionId: 'pos-1', department: 'Production', name: 'Houda Tounsi', educationLevel: 'Bac+5 / Ingénieur', familySituation: 'Mariée', studySpecialty: 'Génie des Procédés', yearsOfExperience: 8, gender: 'Femme', source: 'E-Mail', hrOpinion: 'Defavorable', managerOpinion: 'Defavorable', currentSalary: 2400, salaryExpectation: 3000, noticePeriod: '3 mois', status: 'Refus du candidat', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'MOHAMED AYMEN BACOUCHE', createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-12') },
  { id: '19', positionId: 'pos-2', department: 'HSE', name: 'Mehdi Zaibi', educationLevel: 'Bac+4', familySituation: 'Marié', studySpecialty: 'Environnement & Sécurité', yearsOfExperience: 12, gender: 'Homme', source: 'Référence interne', hrOpinion: 'Favorable', managerOpinion: 'Passable', currentSalary: 2500, salaryExpectation: 3000, noticePeriod: 'Immédiat', status: 'Embauché', hiringCost: 22000, recruitmentMode: 'Interne', recruiter: 'zoubaier berrebeh', workSite: 'TT', createdAt: new Date('2024-03-05'), updatedAt: new Date('2024-03-20') },
  { id: '20', positionId: 'pos-3', department: 'Méthode & Indus', name: 'Rim Sassi', educationLevel: 'Bac+3', familySituation: 'Célibataire', studySpecialty: 'Organisation Industrielle', yearsOfExperience: 5, gender: 'Femme', source: 'LinkedIn', hrOpinion: 'Prioritaire', managerOpinion: 'Passable', currentSalary: 1700, salaryExpectation: 2100, noticePeriod: '1 mois', status: 'En cours', hiringCost: 0, recruitmentMode: 'Externe', recruiter: 'zoubaier berrebeh', createdAt: new Date('2024-03-08'), updatedAt: new Date('2024-03-15') }
];


async function main() {
  console.log('Start seeding...');

  const passwordHash = "$2b$10$ep/D.B.a/J.z.y.x.w.v.u.t.s.r.q.p.o.n.m.l.k.j.i.h.g.f.e"; // dummy hash

  // 1. Create Recruiters (Users)
  const recruiterUserMap = new Map<string, number>();

  for (const recruiter of recruiters) {
    const username = recruiter.name.toLowerCase().replace(/\s+/g, '.');
    // Upsert user
    const user = await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        password: passwordHash,
        role: 'RECRUITER',
      },
    });
    console.log(`Created/Found user: ${user.username} (ID: ${user.id})`);
    recruiterUserMap.set(recruiter.name, user.id);
  }

  // 2. Create HiringRequests (merged from JobRequests and Positions)
  // Since we don't have strictly matching schemas, we'll try to do our best match.
  // jobRequests are the base. Positions decorate them.
  // Map 'req-ID', 'pos-ID' to real DB IDs.
  const jobRequestMap = new Map<string, number>();

  // Process JobRequests
  for (const req of jobRequests) {
    // Find if there is a matching position for this request
    const position = positions.find(p => p.jobRequestId === req.id);

    let recruiterId: number | undefined;
    if (position && position.recruiter) {
      recruiterId = recruiterUserMap.get(position.recruiter);
    }
    
    // Fallback logic if we can't find a recruiter for the firing request
    // Assign random or null? The schema says optional.

    // Map status:
    // PositionStatus: 'Vacant' | 'En cours' | 'Suspendu' | 'Annulé' | 'Embauché' | 'Terminé'
    // HiringRequest.status (Prisma): VACANT, HIRED, IN_PROGRESS, COMPLETED, CANCELLED, SUSPENDED
    const statusMap: Record<string, string> = {
      'Vacant': 'VACANT',
      'En cours': 'IN_PROGRESS',
      'Suspendu': 'SUSPENDED',
      'Annulé': 'CANCELLED',
      'Embauché': 'HIRED',
      'Terminé': 'COMPLETED'
    };

    const dbStatus = statusMap[req.status] || 'VACANT';
    const recruitmentMode = position?.mode === 'Interne' ? 'INTERNAL' : 'EXTERNAL';
    
    const hiringRequest = await prisma.hiringRequest.create({
      data: {
        createdAt: req.createdAt,
        updatedAt: req.updatedAt,
        requestDate: req.requestDate,
        personnelType: 'CADRE', // Defaulting as not in source
        service: req.department,
        workLocation: position?.workSite || req.site || 'TT', // Default
        jobTitle: req.jobTitle,
        reason: 'REPLACEMENT', // Default
        contractType: 'CDI', // Default
        justification: req.justification || 'N/A',
        jobCharacteristics: req.positionCharacteristics || 'N/A',
        candidateEducation: 'N/A',
        candidateSkills: req.candidateRequirements || 'N/A',
        recruiterId: recruiterId,
        recruitmentSource: position?.source,
        recruitmentMode: recruitmentMode,
        status: dbStatus
      }
    });

    jobRequestMap.set(req.id, hiringRequest.id);
    if(position) {
         jobRequestMap.set(position.id, hiringRequest.id); // Also map position ID to this request for candidates referencing pos-ID
    }
  }

  console.log(`Created ${jobRequests.length} HiringRequests`);

  // Process Positions that MIGHT NOT have a job request (from the list, pos-1,2,3 all have jobRequestId, so covered)
  // If there were standalone positions, we would handle them here.

  // Helper to find job title
  const getJobTitle = (posId: string) => {
    // find pos
    const p = positions.find(po => po.id === posId);
    if (!p) return "Candidature spontanée";
    const req = jobRequests.find(r => r.id === p.jobRequestId);
    return req ? req.jobTitle : "Unknown Position";
  };

  // 3. Create Candidates
  for (const c of candidates) {
    // Split name
    const parts = c.name.split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    let dbStatus = 'RECEIVED';
    if (c.status === 'En cours') dbStatus = 'TECHNICAL_INTERVIEW'; 
    else if (c.status === 'Embauché') dbStatus = 'HIRED';
    else if (c.status.toLowerCase().includes('refus')) dbStatus = 'REJECTED';
    else if (c.status === 'Prioritaire') dbStatus = 'SHORTLISTED';
    else if (c.status === 'Non embauché') dbStatus = 'REJECTED';

    const hiringRequestId = jobRequestMap.get(c.positionId);
    const recruitmentMode = c.recruitmentMode === 'Interne' ? 'INTERNAL' : 'EXTERNAL';
    const gender = c.gender === 'Homme' ? 'MALE' : 'FEMALE';
    const jobTitle = getJobTitle(c.positionId);

    await prisma.candidate.create({
      data: {
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.replace(/ /g, '').toLowerCase()}@email.com`, // Fixed domain
        positionAppliedFor: jobTitle,
        department: c.department,
        educationLevel: c.educationLevel,
        familySituation: c.familySituation,
        studySpecialty: c.studySpecialty,
        yearsOfExperience: c.yearsOfExperience,
        gender,
        source: c.source,
        hrOpinion: c.hrOpinion,
        managerOpinion: c.managerOpinion,
        currentSalary: c.currentSalary,
        salaryExpectation: c.salaryExpectation,
        noticePeriod: c.noticePeriod,
        status: dbStatus,
        recruitmentMode,
        workSite: c.workSite,
        hiringRequestId: hiringRequestId,
      }
    });
  }
  console.log(`Created ${candidates.length} Candidates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
