import { NextRequest, NextResponse } from 'next/server';
import swaggerJSDoc from 'swagger-jsdoc';

export async function GET(req: NextRequest) {
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
          url: 'http://localhost:3000',
          description: 'Servidor local',
        },
        {
          url: 'https://tu-produccion.com',
          description: 'Servidor de producción',
        },
      ],
    },
    apis: [
      './src/app/api/medical-records/route.ts',
      './src/app/api/auth/register/route.ts',
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