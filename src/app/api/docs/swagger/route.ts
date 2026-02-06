import { NextRequest, NextResponse } from 'next/server';
import swaggerJSDoc from 'swagger-jsdoc';

export async function GET(request: NextRequest) {
  // Obtener la URL base del servidor actual
  const origin = request.headers.get('origin') || request.nextUrl.origin;
  
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Historias Clínicas - Mentalmente',
        version: '1.0.0',
        description: 'Documentación completa de la API para gestión de historias clínicas',
      },
      servers: [
        {
          url: origin,
          description: 'Servidor actual',
        },
      ],
    },
    apis: [
      './src/app/api/medical-records/route.ts',
      './src/app/api/auth/register/route.ts',
      './src/app/api/psychologist-dash/patient/route.ts',
      './src/app/api/auth/all-user/route.ts',
    ],
  };

  const swaggerSpec = swaggerJSDoc(options);

  return NextResponse.json(swaggerSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}