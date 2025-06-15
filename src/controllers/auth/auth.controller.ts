import { prisma } from '@/lib/prisma';
import { LoginCredentials } from '@/types/auth';
import { comparePasswords } from '@/utils/auth';
import { useRouter } from 'next/router';

export class AuthController {
  static async login({ email, password }: LoginCredentials) {
    try {
      const user = await prisma.user.findUnique({
        where: { correo: email }
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const isValidPassword = await comparePasswords(password, user.contrasena);

      if (!isValidPassword) {
        throw new Error('Contraseña incorrecta');
      }

      const userData = {
        id: user.id,
        email: user.correo,
        name: user.usuario,
      };

      const router = useRouter();
      await router.push('/dashboard');

      return userData;

    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
}
