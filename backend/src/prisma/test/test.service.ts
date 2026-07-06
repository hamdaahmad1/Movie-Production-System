import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TestService implements OnModuleInit {

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const directors = await this.prisma.director.findMany();
    console.log('Directors from DB:', directors);
  }
}