import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin') || request.nextUrl.origin;
  const specification = {
    openapi: '3.0.0',
    info: {
      title: 'API de Historias Clínicas — SanaTú',
      version: '1.0.0',
      description: 'Documentación de los servicios de autenticación, pacientes e historias clínicas.',
    },
    servers: [{ url: origin, description: 'Servidor actual' }],
    paths: {
      '/api/auth/login': { post: { summary: 'Autenticar un usuario', responses: { '200': { description: 'Acceso autorizado' } } } },
      '/api/auth/register': { post: { summary: 'Registrar un usuario de recepción', responses: { '201': { description: 'Usuario creado' } } } },
      '/api/medical-records': {
        get: { summary: 'Consultar historias clínicas', responses: { '200': { description: 'Listado paginado' } } },
        post: { summary: 'Crear una historia clínica', responses: { '201': { description: 'Historia creada' } } },
      },
    },
  };

  return NextResponse.json(specification, {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}
