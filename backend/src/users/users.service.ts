import {
    ConflictException,
    Injectable,
  } from '@nestjs/common';
  
  import * as bcrypt from 'bcrypt';
  
  import { PrismaService } from '../prisma/prisma.service';
  
  import { CreateUserDto } from './dto/create-user.dto';

  
  @Injectable()
  export class UsersService {
    constructor(private prisma: PrismaService) {}
  
    async create(createUserDto: CreateUserDto) {
      const username = createUserDto.username
        .trim()
        .toLowerCase();
  
      const email = createUserDto.email
        .trim()
        .toLowerCase();
  
      const existingUsername = await this.findByUsername(username);
  
      if (existingUsername) {
        throw new ConflictException(
          'Username already exists',
        );
      }
  
      const existingEmail = await this.findByEmail(email);
  
      if (existingEmail) {
        throw new ConflictException(
          'Email already exists',
        );
      }
  
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        10,
      );
  
      return this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          firstName: createUserDto.firstName.trim(),
          lastName: createUserDto.lastName.trim(),
          role: createUserDto.role,
        },
      });
    }
  
    async findById(id: number) {
      return this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    }
  
    async findByEmail(email: string) {
      return this.prisma.user.findUnique({
        where: {
          email: email.trim().toLowerCase(),
        },
      });
    }
  
    async findByUsername(username: string) {
      return this.prisma.user.findUnique({
        where: {
          username: username.trim().toLowerCase(),
        },
      });
    }
    async findOne(id: number) {
      return this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    }
  
    async findByUsernameOrEmail(login: string) {
      const value = login.trim().toLowerCase();
  
      return this.prisma.user.findFirst({
        where: {
          OR: [
            {
              username: value,
            },
            {
              email: value,
            },
          ],
        },
      });
    }

    async existsByUsername(username: string): Promise<boolean> {
      return !!(await this.findByUsername(username));
    }
    
    async existsByEmail(email: string): Promise<boolean> {
      return !!(await this.findByEmail(email));
    }
  }