import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../users/dto/create-user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {

    let service: AuthService;

    const mockUsersService = {

      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      findByUsernameOrEmail: jest.fn(),
      existsByUsername: jest.fn(),
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),

    };

    const mockJwtService = {

      signAsync: jest.fn(),

    };

    const mockResponse: any = {

      cookie: jest.fn(),
      clearCookie: jest.fn(),

    };

    const mockRegisterDto: RegisterDto = {
      firstName: "Hamda",
      lastName: "Ahmad",
      username: "hamda_ahmad",
      email: "hamda@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    };

    const mockLoginDto: LoginDto = {
      login: "hamda_ahmad",
      password: "Password123!",
    };

    const mockUser = {
      id: 1,
      username: "hamda_ahmad",
      email: "hamda@example.com",
      firstName: "Hamda",
      lastName: "Ahmad",
      role: UserRole.VIEWER,
      password: "hashedPassword",
    };

    beforeEach(async () => {


      const module: TestingModule =
        await Test.createTestingModule({

          providers: [

            AuthService,

            {
              provide: UsersService,
              useValue: mockUsersService,
            },

            {
              provide: JwtService,
              useValue: mockJwtService,
            },

          ],

        }).compile();

      service =
        module.get<AuthService>(AuthService);

    });

    afterEach(() => {

      jest.clearAllMocks();

    });

    it("should be defined", () => {

        expect(service).toBeDefined();

    });

    describe("register", () => {

        it("should throw BadRequestException if password and confirmPassword do not match", async () => {

            const dto = {
              ...mockRegisterDto,
              confirmPassword: "Different123!",
            }

            await expect(

                service.register(dto, mockResponse)

            ).rejects.toThrow(BadRequestException);

            expect(mockUsersService.create).not.toHaveBeenCalled();

        });

        it("should throw BadRequestException if firstName and lastName are the same", async () => {

            const dto = {
              ...mockRegisterDto,
              firstName: "Hamda",
              lastName: "hamda",
            }

            await expect(

                service.register(dto, mockResponse)

            ).rejects.toThrow(BadRequestException);

            expect(mockUsersService.create).not.toHaveBeenCalled();

        });

        it("should throw BadRequestException if username already exists", async () => {

          const dto = { ...mockRegisterDto };

          mockUsersService.findByUsername.mockResolvedValue(mockUser);

          await expect(

              service.register(dto, mockResponse)

          ).rejects.toThrow(BadRequestException);

          expect(mockUsersService.findByUsername).toHaveBeenCalledWith(dto.username);

          expect(mockUsersService.create).not.toHaveBeenCalled();

        });

        it("should throw BadRequestException if email already exists", async () => {

          const dto = { ...mockRegisterDto };

          mockUsersService.findByUsername.mockResolvedValue(null);
          mockUsersService.findByEmail.mockResolvedValue(mockUser);

          await expect(

              service.register(dto, mockResponse)

          ).rejects.toThrow(BadRequestException);

          expect(mockUsersService.findByEmail).toHaveBeenCalledWith(dto.email);

          expect(mockUsersService.create).not.toHaveBeenCalled();

        });

        it("should register a new user successfully", async () => {

          const dto = { ...mockRegisterDto };

          mockUsersService.findByUsername.mockResolvedValue(null);
          mockUsersService.findByEmail.mockResolvedValue(null);
          mockUsersService.create.mockResolvedValue(mockUser);
          mockJwtService.signAsync.mockResolvedValue("mocked-jwt-token");

          const result = await service.register(dto, mockResponse);

          expect(mockUsersService.create).toHaveBeenCalledWith({
            username: dto.username,
            email: dto.email,
            password: dto.password,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: UserRole.VIEWER,
          });

          expect(mockJwtService.signAsync).toHaveBeenCalledWith({
            sub: mockUser.id,
            username: mockUser.username,
            role: mockUser.role,
          });

          expect(mockResponse.cookie).toHaveBeenCalledWith(
            "access_token",
            "mocked-jwt-token",
            expect.objectContaining({
              httpOnly: true,
              sameSite: "lax",
            }),
          );

          expect(result).toEqual({
            message: "Registration successful.",
            access_token: "mocked-jwt-token",
            user: {
              id: mockUser.id,
              username: mockUser.username,
              email: mockUser.email,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              role: mockUser.role,
            },
          });

        });

    });

    describe("login", () => {

        it("should throw UnauthorizedException if user is not found", async () => {

            mockUsersService.findByUsernameOrEmail.mockResolvedValue(null);

            await expect(

                service.login(mockLoginDto, mockResponse)

            ).rejects.toThrow(UnauthorizedException);

            expect(mockUsersService.findByUsernameOrEmail).toHaveBeenCalledWith(mockLoginDto.login);

        });

        it("should throw UnauthorizedException if password is incorrect", async () => {

            mockUsersService.findByUsernameOrEmail.mockResolvedValue(mockUser);

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(

                service.login(mockLoginDto, mockResponse)

            ).rejects.toThrow(UnauthorizedException);

            expect(bcrypt.compare).toHaveBeenCalledWith(
              mockLoginDto.password,
              mockUser.password,
            );

        });

        it("should log in successfully and return an access token", async () => {

            mockUsersService.findByUsernameOrEmail.mockResolvedValue(mockUser);

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            mockJwtService.signAsync.mockResolvedValue("mocked-jwt-token");

            const result = await service.login(mockLoginDto, mockResponse);

            expect(mockResponse.cookie).toHaveBeenCalledWith(
              "access_token",
              "mocked-jwt-token",
              expect.any(Object),
            );

            expect(result).toEqual({
              message: "Login successful.",
              access_token: "mocked-jwt-token",
              user: {
                id: mockUser.id,
                username: mockUser.username,
                email: mockUser.email,
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
                role: mockUser.role,
              },
            });

        });

    });

    describe("checkUsername", () => {

        it("should return available true if username does not exist", async () => {

            mockUsersService.existsByUsername.mockResolvedValue(false);

            const result = await service.checkUsername("newuser");

            expect(result).toEqual({
              available: true,
              message: "Username is available.",
            });

        });

        it("should return available false if username already exists", async () => {

            mockUsersService.existsByUsername.mockResolvedValue(true);

            const result = await service.checkUsername("existinguser");

            expect(result).toEqual({
              available: false,
              message: "Username already exists.",
            });

        });

    });

    describe("checkEmail", () => {

        it("should return available true if email does not exist", async () => {

            mockUsersService.existsByEmail.mockResolvedValue(false);

            const result = await service.checkEmail("new@example.com");

            expect(result).toEqual({
              available: true,
              message: "Email is available.",
            });

        });

        it("should return available false if email already exists", async () => {

            mockUsersService.existsByEmail.mockResolvedValue(true);

            const result = await service.checkEmail("existing@example.com");

            expect(result).toEqual({
              available: false,
              message: "Email already exists.",
            });

        });

    });

    describe("logout", () => {

        it("should clear the access token cookie and return a success message", async () => {

            const result = await service.logout(mockResponse);

            expect(mockResponse.clearCookie).toHaveBeenCalledWith("access_token");

            expect(result).toEqual({
              message: "Logged out successfully.",
            });

        });

    });

    describe("getProfile", () => {

        it("should throw BadRequestException if user does not exist", async () => {

            mockUsersService.findOne.mockResolvedValue(null);

            await expect(

                service.getProfile(1)

            ).rejects.toThrow(BadRequestException);

        });

        it("should return the user profile if it exists", async () => {

            mockUsersService.findOne.mockResolvedValue(mockUser);

            const result = await service.getProfile(1);

            expect(result).toEqual({
              id: mockUser.id,
              username: mockUser.username,
              email: mockUser.email,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              role: mockUser.role,
            });

        });

    });

  })