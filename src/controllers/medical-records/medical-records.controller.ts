import { prisma } from '@/lib/prisma';
import { MedicalRecord } from '@prisma/client';

export class MedicalRecordsController {
  static async create(data: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const medicalRecord = await prisma.medicalRecord.create({
        data: {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });

      return medicalRecord;
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const medicalRecords = await prisma.medicalRecord.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      return medicalRecords;
    } catch (error) {
      console.error('Error getting medical records:', error);
      throw error;
    }
  }

  static async getById(id: number) {
    try {
      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { id }
      });

      if (!medicalRecord) {
        throw new Error('Medical record not found');
      }

      return medicalRecord;
    } catch (error) {
      console.error('Error getting medical record:', error);
      throw error;
    }
  }
}
