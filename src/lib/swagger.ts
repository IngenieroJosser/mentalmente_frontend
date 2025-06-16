import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mentalmente API',
      version: '1.0.0',
      description: 'API para el sistema de gestión de historias clínicas',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    components: {
      schemas: {
        UserInput: {
          type: 'object',
          properties: {
            usuario: { type: 'string', example: 'Josss' },
            correo: { type: 'string', format: 'email', example: 'cordobarivasjoss@mentalmente.com' },
            genero: { type: 'string', example: 'Masculino' },
            contrasena: { type: 'string', format: 'password', example: 'cordobarivasjoss' },
            role: { type: 'string', example: 'admin' },
          },
          required: ['usuario', 'correo', 'contrasena', 'genero', 'role'],
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            usuario: { type: 'string', example: 'Josss' },
            correo: { type: 'string', format: 'email', example: 'cordobarivasjoss@mentalmente.com' },
            genero: { type: 'string', example: 'Masculino' },
            contrasena: { type: 'string', format: 'password', example: 'cordobarivasjoss' },
            role: { type: 'string', example: 'admin' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-06-16T10:00:00Z' },
          }
        }
      }
    }
  },
  apis: [
    './src/app/api/auth/register/route.ts', // Ruta del endpoint
  ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
