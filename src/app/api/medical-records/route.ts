import { MedicalRecordsController } from '@/controllers/medical-records/medical-records.controller';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const medicalRecord = await MedicalRecordsController.create(body);

    return NextResponse.json(medicalRecord);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: error.message ? 400 : 500 }
    );
  }
}

export async function GET() {
  try {
    const medicalRecords = await MedicalRecordsController.getAll();

    return NextResponse.json(medicalRecords);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: error.message ? 400 : 500 }
    );
  }
}
