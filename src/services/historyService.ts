import { MedicalRecord, User } from '@prisma/client'

const API_URL = '/api/medical-records';

export const fetchHistories = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<{
  data: MedicalRecord[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const response = await fetch(
    `${API_URL}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  )
  return response.json()
}

export const createHistory = async (data: MedicalRecord) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al crear historia');
  }
  
  return response.json();
};

export const updateHistory = async (id: number, historyData: Partial<MedicalRecord>) => {
  const response = await fetch(`/api/medical-records?id=${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(historyData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al actualizar historia');
  }
  
  return response.json();
};

export const deleteHistory = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
}

export const getHistoryById = async (id: number): Promise<MedicalRecord> => {
  const response = await fetch(`${API_URL}/${id}`)
  return response.json()
}

// Definir el tipo extendido
export type MedicalRecordWithUser = MedicalRecord & {
  user?: Pick<User, 'usuario'> | null;
};