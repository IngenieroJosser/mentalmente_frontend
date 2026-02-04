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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: 'ID de historia clínica es requerido' },
        { status: 400 }
      );
    }
    
    // Eliminar la historia clínica
    await prisma.medicalRecord.delete({
      where: { id: parseInt(params.id) },
    });
    
    // Si se elimina correctamente, devolver un estado 204 No Content
    return NextResponse.json(null, { status: 204 });
  } catch (error: unknown) {
    console.error('Error eliminando historia clínica:', error);
    
    // Verificar si es un error de Prisma
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
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