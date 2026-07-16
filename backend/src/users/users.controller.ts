import { Controller } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";


import
{
    Body,
    Post,
}from '@nestjs/common';

@Controller("users")
export class UsersController 
{
    constructor(
        private readonly usersService:UsersService,

    ){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

