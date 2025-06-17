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

export const createHistory = async (data: any) => {
  const response = await fetch('/api/medical-records', {
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

export const updateHistory = async (id: number, historyData: any) => {
  try {
    const response = await fetch(`/api/medical-records?id=${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(historyData)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      // Extraer mensaje de error detallado del backend
      const errorMessage = responseData.error || 
                           responseData.message || 
                           'Error al actualizar historia';
      throw new Error(errorMessage);
    }
    
    return responseData;
    
  } catch (error) {
    console.error('Error en updateHistory:', error);
    throw error;
  }
};

export const deleteHistory = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
}

export const getHistoryById = async (id: number) => {
  const response = await fetch(`/api/medical-records/${id}`);
  if (!response.ok) throw new Error('Error cargando historia');
  return response.json();
};

// Definir el tipo extendido
// services/historyService.ts
export type MedicalRecordWithUser = {
  id: number;
  patientName: string;
  // ... otras propiedades ...
  updatedAt: Date;
  user: {
    id: number;
    usuario: string;
    correo: string;
  } | null;
};