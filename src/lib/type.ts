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
}

export interface User {
  id: number;
  nombre: string;
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

export type MedicalRecordFormData = Omit<Partial<MedicalRecord>, 'birthDate' | 'admissionDate'> & {
  birthDate?: Date | null;
  admissionDate?: Date | null;
  userId?: number;
};

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