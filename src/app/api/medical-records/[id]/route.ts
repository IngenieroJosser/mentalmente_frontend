import { MedicalRecordsController } from '@/controllers/medical-records/medical-records.controller';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const medicalRecord = await MedicalRecordsController.getById(params.id);
    return NextResponse.json(medicalRecord);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: error.message ? 400 : 500 }
    );
  }
}
