import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// Definir tipo para el contexto de parámetros
interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: Context
) {
  try {
    // Esperar a que se resuelvan los params
    const params = await context.params;
    
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
  request: NextRequest,
  context: Context
) {
  try {
    // Esperar a que se resuelvan los params
    const params = await context.params;
    
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
  } catch (error) {
    console.error('Error eliminando historia clínica:', error);
    
    // Verificar si es un error de Prisma
    const prismaError = error as { code?: string };
    
    if (prismaError.code === 'P2025') {
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

// También podrías agregar un método PUT para actualizar
export async function PUT(
  request: NextRequest,
  context: Context
) {
  try {
    const params = await context.params;
    const body = await request.json();
    
    if (!params.id) {
      return NextResponse.json(
        { error: 'ID de historia clínica es requerido' },
        { status: 400 }
      );
    }
    
    const updatedRecord = await prisma.medicalRecord.update({
      where: { id: parseInt(params.id) },
      data: body,
    });
    
    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error('Error actualizando historia clínica:', error);
    
    const prismaError = error as { code?: string };
    
    if (prismaError.code === 'P2025') {
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