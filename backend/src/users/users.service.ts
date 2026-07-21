import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import{ UserQueryDto } from './dto/user-query.dto';
@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto) {

    const username = createUserDto.username
      .trim()
      .toLowerCase();

    const email = createUserDto.email
      .trim()
      .toLowerCase();


    const existingUsername =
      await this.findByUsername(username);


    if (existingUsername) {
      throw new ConflictException(
        "Username already exists",
      );
    }


    const existingEmail =
      await this.findByEmail(email);


    if (existingEmail) {
      throw new ConflictException(
        "Email already exists",
      );
    }


    const hashedPassword =
      await bcrypt.hash(
        createUserDto.password,
        10,
      );


    return this.prisma.user.create({

      data:{
        username,
        email,
        password: hashedPassword,
        firstName:
          createUserDto.firstName.trim(),

        lastName:
          createUserDto.lastName.trim(),

        role:
          createUserDto.role,
      },

    });
  }

  async findAll(query: UserQueryDto) {
    const {
      search,
      role,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = query;
  
    const where: any = {};
  
    if (search) {
      where.OR = [
        {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }
  
    if (role) {
      where.role = role;
    }
  
    let orderBy: any = {
      createdAt: "desc",
    };
  
    if (sortBy) {
      const sortOrder = order === "asc" ? "asc" : "desc";
  
      switch (sortBy) {
        case "username":
          orderBy = {
            username: sortOrder,
          };
          break;
  
        case "firstName":
          orderBy = {
            firstName: sortOrder,
          };
          break;
  
        case "lastName":
          orderBy = {
            lastName: sortOrder,
          };
          break;
  
        case "email":
          orderBy = {
            email: sortOrder,
          };
          break;
  
        case "role":
          orderBy = {
            role: sortOrder,
          };
          break;
  
        case "createdAt":
          orderBy = {
            createdAt: sortOrder,
          };
          break;
  
        default:
          orderBy = {
            createdAt: "desc",
          };
      }
    }
  
    const skip = (page - 1) * limit;
  
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
  
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
  
        orderBy,
  
        skip,
  
        take: limit,
      }),
  
      this.prisma.user.count({
        where,
      }),
    ]);
  
    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id:number){

    const user =
      await this.prisma.user.findUnique({

        where:{
          id,
        },

      });


    if(!user){

      throw new NotFoundException(
        "User not found",
      );

    }


    return user;
  }


  async update(
    id:number,
    updateUserDto:UpdateUserDto,
  ){

    const user =
      await this.findOne(id);



    if(updateUserDto.username){

      const username =
        updateUserDto.username
        .trim()
        .toLowerCase();


      const existing =
        await this.findByUsername(username);


      if(existing && existing.id !== id){

        throw new ConflictException(
          "Username already exists",
        );

      }


      updateUserDto.username = username;

    }

    if(updateUserDto.email){

      const email =
        updateUserDto.email
        .trim()
        .toLowerCase();

      const existing =
        await this.findByEmail(email);



      if(existing && existing.id !== id){

        throw new ConflictException(
          "Email already exists",
        );

      }


      updateUserDto.email = email;

    }

    let password;


    if(updateUserDto.password){

      password =
        await bcrypt.hash(
          updateUserDto.password,
          10,
        );

    }

    return this.prisma.user.update({

      where:{
        id,
      },


      data:{
        ...updateUserDto,

        ...(password && {
          password,
        }),

      },


    });

  }

  async remove(id:number){

    await this.findOne(id);


    return this.prisma.user.delete({

      where:{
        id,
      },

    });

  }

  async findByEmail(email:string){

    return this.prisma.user.findUnique({

      where:{
        email:
          email.trim().toLowerCase(),
      },

    });

  }
  async findByUsername(username:string){

    return this.prisma.user.findUnique({

      where:{
        username:
          username.trim().toLowerCase(),
      },

    });

  }

  async findByUsernameOrEmail(login:string){

    const value =
      login.trim().toLowerCase();


    return this.prisma.user.findFirst({

      where:{

        OR:[

          {
            username:value,
          },

          {
            email:value,
          },

        ],

      },

    });

  }





  async existsByUsername(
    username:string
  ):Promise<boolean>{

    return !!(
      await this.findByUsername(username)
    );

  }






  async existsByEmail(
    email:string
  ):Promise<boolean>{

    return !!(
      await this.findByEmail(email)
    );

  }

}