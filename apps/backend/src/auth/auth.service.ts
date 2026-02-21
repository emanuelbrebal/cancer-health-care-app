import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(email: string, pass: string, name: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);

    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
  }
}