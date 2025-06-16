import prisma from '@/lib/prisma';
import { comparePasswords } from '@/utils/auth';
import { LoginCredentials } from '@/types/auth';

export class AuthController {
  static async login({ email, password }: LoginCredentials) {
    try {
      const user = await prisma.user.findUnique({
        where: { correo: email }
      });

      if (!user) throw new Error('Usuario no encontrado');
      
      const isValidPassword = await comparePasswords(password, user.contrasena);
      if (!isValidPassword) throw new Error('Contraseña incorrecta');

      return {
        id: user.id,
        email: user.correo,
        name: user.usuario,
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
}