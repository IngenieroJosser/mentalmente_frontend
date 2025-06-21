import { MedicalRecord } from '@prisma/client';

export type FloatingElement = {
  type: string;
  color: string;
  size: number;
  x: number;
  y: number;
  sizeActual: number;
  speedX: number;
  speedY: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  direction: number;
  rotation: number;
  rotationSpeed: number;
  pulseDirection: number;
};

// Definir el tipo extendido
export type MedicalRecordWithUser = MedicalRecord & {
  user: {
    id: number;
    usuario: string;
    correo: string;
  } | null;
  notes?: string;
  birthDate?: string | null;
  admissionDate?: string | null;
  status?: string;
  sessions?: number;
  therapist?: string;
  lastVisit?: string | null;
  nextAppointment?: string | null;
};

export type MedicalRecordFormData = Omit<Partial<MedicalRecord>, 'birthDate' | 'admissionDate'> & {
  status?: string;
  sessions?: number;
  therapist?: string;
  lastVisit?: Date | null;
  nextAppointment?: Date | null;
};

export type MedicalRecordFormData_ = Omit<Partial<MedicalRecord>, 'birthDate' | 'admissionDate'> & {
  birthDate?: string | null;
  admissionDate?: string | null;
  userId?: number;
  notes?: string;
  age?: number;
  gender?: string;
  phone?: string;
  cellPhone?: string;
  email?: string;
  eps?: string;
  status?: string;
  sessions?: number;
  therapist?: string;
  lastVisit?: string | null;
  nextAppointment?: string | null;
};

export interface HistoryFormProps {
  historyId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface User {
  id: number;
  usuario: string;
  correo: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface MedicalRecordsTableProps {
  records: MedicalRecord[];
}

export interface MedicalRecordDetailsModalProps {
  record: MedicalRecordWithUser;
  onClose: () => void;
}

export interface PrintableHistoryProps {
  record: MedicalRecordWithUser;
}

export type MedicalRecordWithUser_ = MedicalRecord & {
  user: {
    usuario: string;
  } | null;
};

export interface PDFDocument {
  embedFont(fontName: string): Promise<PDFFont>;
  getPages(): any[];
  save(): Promise<Uint8Array>;
}

export interface PDFFont {
  drawText(text: string, options: {
    x: number;
    y: number;
    size: number;
    font: PDFFont;
    color: any;
  }): void;
}
export const authOptions = {
  providers: [
    // ... your authentication providers ...
  ],
  // ... other NextAuth options ...
};

export interface PatientFormData {
  patientName?: string;
  identificationNumber?: string;
  birthDate?: string | null;
  phone?: string | null;
  email?: string | null;
  eps?: string | null;
}

export interface EnhancedMedicalRecord {
  id: number;
  recordNumber: string;
  patientName: string;
  identificationType: string;
  identificationNumber: string;
  birthDate: Date | null;
  age: number;
  gender: string | null;
  phone: string | null;
  cellPhone: string | null;
  email: string | null;
  eps: string | null;
  status: string | null;
  therapist: string | null;
  sessions: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: {
    id: number;
    usuario: string;
    email: string;
    role: string;
  };
  referredBy?: string | null;
  address?: string | null;
}

export interface RegisterDashboardPsychologist {
  id: number;
  recordNumber: string;
  patientName: string;
  identificationType: string;
  identificationNumber: string;
  birthDate: Date | null;
  age: number;
  gender: string | null;
  phone: string | null;
  cellPhone: string | null;
  email: string | null;
  eps: string | null;
  status: string | null;
  therapist: string | null;
  sessions: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  user?: {
    id: number;
    usuario: string;
    email: string;
    role: string;
  };
  referredBy?: string | null;
  address?: string | null;
}

export interface Patient {
  id: number;
  patientName: string;
  identificationType: string;
  identificationNumber: string;
  birthDate: string | null;
  age: number | null;
  educationLevel: string | null;
  occupation: string | null;
  birthPlace: string | null;
  nationality: string | null;
  religion: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  admissionDate: string | null;
  phone: string | null;
  cellPhone: string | null;
  email: string | null;
  eps: string | null;
  isBeneficiary: boolean | null;
  referredBy: string | null;
  guardian1Name: string | null;
  guardian1Relationship: string | null;
  guardian1Phone: string | null;
  guardian1Occupation: string | null;
  guardian2Name: string | null;
  guardian2Relationship: string | null;
  guardian2Phone: string | null;
  guardian2Occupation: string | null;
  attendedBy: string | null;
  licenseNumber: string | null;
  personalPathological: string | null;
  personalSurgical: string | null;
  personalPsychopathological: string | null;
  traumaHistory: string | null;
  sleepStatus: string | null;
  substanceUse: string | null;
  personalOther: string | null;
  familyPathological: string | null;
  familySurgical: string | null;
  familyPsychopathological: string | null;
  familyTraumatic: string | null;
  familySubstanceUse: string | null;
  familyOther: string | null;
  pregnancyInfo: string | null;
  deliveryInfo: string | null;
  psychomotorDevelopment: string | null;
  familyDynamics: string | null;
  consultationReason: string | null;
  problemHistory: string | null;
  therapyExpectations: string | null;
  mentalExam: string | null;
  psychologicalAssessment: string | null;
  diagnosis: string | null;
  therapeuticGoals: string | null;
  treatmentPlan: string | null;
  referralInfo: string | null;
  recommendations: string | null;
  evolution: string | null;
}

export interface MedicalRecordEvent {
  id: number;
  patientName: string;
  createdAt: string;
}

export interface User_ {
  id: number;
  usuario: string;
  correo: string;
  genero: string;
  role: string;
  createdAt: string;
}