import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { MedicalRecord } from '@prisma/client'

// Función helper para extraer el ID
function extractIdFromUrl(req: NextRequest): string | null {
  const segments = req.nextUrl.pathname.split('/')
  return segments.length > 0 ? segments[segments.length - 1] : null
}

export async function GET(req: NextRequest) { 
  try {
    const id = extractIdFromUrl(req)
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID no proporcionado' },
        { status: 400 }
      )
    }

    const record = await prisma.medicalRecord.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            usuario: true,
          },
        },
      },
    })

    if (!record) {
      return NextResponse.json(
        { error: 'Historia clínica no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error('Error al obtener la historia clínica:', error);
    return NextResponse.json(
      { error: 'Error al obtener la historia clínica' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = extractIdFromUrl(req)
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID no proporcionado' },
        { status: 400 }
      )
    }

    const data: Partial<MedicalRecord> = await req.json()
    const updatedRecord = await prisma.medicalRecord.update({
      where: { id: parseInt(id) },
      data,
    })

    return NextResponse.json(updatedRecord)
  } catch (error) {
    console.error('Error al actualizar la historia clínica:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la historia clínica' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = extractIdFromUrl(req)
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID no proporcionado' },
        { status: 400 }
      )
    }

    await prisma.medicalRecord.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json(
      { message: 'Historia clínica eliminada correctamente' }
    )
  } catch (error) {
    console.error('Error al eliminar la historia clínica:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la historia clínica' },
      { status: 500 }
    )
  }
}