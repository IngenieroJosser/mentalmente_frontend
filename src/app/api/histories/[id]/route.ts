import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { MedicalRecord } from '@prisma/client'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const record = await prisma.medicalRecord.findUnique({
      where: { id: parseInt(params.id) },
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data: Partial<MedicalRecord> = await req.json()
    const updatedRecord = await prisma.medicalRecord.update({
      where: { id: parseInt(params.id) },
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.medicalRecord.delete({
      where: { id: parseInt(params.id) },
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