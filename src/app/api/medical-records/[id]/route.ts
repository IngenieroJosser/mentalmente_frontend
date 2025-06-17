import { MedicalRecordsController } from '@/controllers/medical-records/medical-records.controller';
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: {
          select: {
            usuario: true,
            role: true,
          },
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: 'Historia clínica no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error('Error obteniendo historia clínica:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'ID de historia clínica es requerido' },
        { status: 400 }
      );
    }
    // Eliminar la historia clínica
    const deletedRecord = await prisma.medicalRecord.delete({
      where: { id: parseInt(id) },
    });
    // Si se elimina correctamente, devolver un estado 204 No Content
    return NextResponse.json(null, { status: 204 });
  } catch (error: any) {
    console.error('Error eliminando historia clínica:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Historia clínica no encontrada' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}