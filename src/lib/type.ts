import { MedicalRecord, User } from '@prisma/client';

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