import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';

import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UserRole } from './dto/create-user.dto';

import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {

    let service: UsersService;

    const mockPrismaService = {

      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },

    };

    const mockCreateUserDto: CreateUserDto = {
      username: "adminuser22",
      email: "admin@example.com",
      password: "Admin@123",
      firstName: "Hamda",
      lastName: "Ahmad",
      role: UserRole.VIEWER,
    };

    beforeEach(async () => {


      const module: TestingModule =
        await Test.createTestingModule({

          providers: [

            UsersService,

            {
              provide: PrismaService,
              useValue: mockPrismaService,
            },

          ],

        }).compile();

      service =
        module.get<UsersService>(UsersService);

    });

    afterEach(() => {

      jest.clearAllMocks();

    });

    it("should be defined", () => {

        expect(service).toBeDefined();

    });

    describe("create", () => {

        it("should throw ConflictException if username already exists", async () => {

            const dto = { ...mockCreateUserDto };

            mockPrismaService.user.findUnique.mockResolvedValueOnce({
              id: 1,
              username: "adminuser22",
            });

            await expect(

                service.create(dto)

            ).rejects.toThrow(ConflictException);

            expect(mockPrismaService.user.create).not.toHaveBeenCalled();

        });

        it("should throw ConflictException if email already exists", async () => {

            const dto = { ...mockCreateUserDto };

            mockPrismaService.user.findUnique
              .mockResolvedValueOnce(null)
              .mockResolvedValueOnce({
                id: 1,
                email: "admin@example.com",
              });

            await expect(

                service.create(dto)

            ).rejects.toThrow(ConflictException);

            expect(mockPrismaService.user.create).not.toHaveBeenCalled();

        });

        it("should create a user successfully with a hashed password", async () => {

            const dto = { ...mockCreateUserDto };

            mockPrismaService.user.findUnique.mockResolvedValue(null);

            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

            const createdUser = {
              id: 1,
              username: dto.username,
              email: dto.email,
              password: "hashedPassword",
              firstName: dto.firstName,
              lastName: dto.lastName,
              role: dto.role,
            };

            mockPrismaService.user.create.mockResolvedValue(createdUser);

            const result = await service.create(dto);

            expect(result).toEqual(createdUser);

            expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);

            expect(mockPrismaService.user.create).toHaveBeenCalledWith({

              data: {
                username: dto.username,
                email: dto.email,
                password: "hashedPassword",
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: dto.role,
              },

            });

        });

    });

    describe("findAll", () => {

        it("should return paginated users", async () => {

            const users = [
              { id: 1, username: "adminuser22" },
              { id: 2, username: "vieweruser" },
            ];

            mockPrismaService.user.findMany.mockResolvedValue(users);
            mockPrismaService.user.count.mockResolvedValue(2);

            const result = await service.findAll({ page: 1, limit: 10 } as any);

            expect(result).toEqual({
              data: users,
              total: 2,
              page: 1,
              limit: 10,
              totalPages: 1,
            });

            expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({

              where: {},

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

              orderBy: {
                createdAt: "desc",
              },

              skip: 0,

              take: 10,

            });

        });

        it("should apply search filter correctly", async () => {

            mockPrismaService.user.findMany.mockResolvedValue([]);
            mockPrismaService.user.count.mockResolvedValue(0);

            await service.findAll({
              search: "hamda",
              page: 1,
              limit: 10,
            } as any);

            expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(

              expect.objectContaining({

                where: {
                  OR: [
                    { username: { contains: "hamda", mode: "insensitive" } },
                    { firstName: { contains: "hamda", mode: "insensitive" } },
                    { lastName: { contains: "hamda", mode: "insensitive" } },
                    { email: { contains: "hamda", mode: "insensitive" } },
                  ],
                },

              }),

            );

        });

        it("should apply role filter correctly", async () => {

            mockPrismaService.user.findMany.mockResolvedValue([]);
            mockPrismaService.user.count.mockResolvedValue(0);

            await service.findAll({
              role: UserRole.ADMIN,
              page: 1,
              limit: 10,
            } as any);

            expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(

              expect.objectContaining({

                where: {
                  role: UserRole.ADMIN,
                },

              }),

            );

        });

        it("should apply sortBy and order correctly", async () => {

            mockPrismaService.user.findMany.mockResolvedValue([]);
            mockPrismaService.user.count.mockResolvedValue(0);

            await service.findAll({
              sortBy: "username",
              order: "asc",
              page: 1,
              limit: 10,
            } as any);

            expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(

              expect.objectContaining({

                orderBy: {
                  username: "asc",
                },

              }),

            );

        });

        it("should apply pagination correctly", async () => {

            mockPrismaService.user.findMany.mockResolvedValue([]);
            mockPrismaService.user.count.mockResolvedValue(0);

            await service.findAll({
              page: 3,
              limit: 5,
            } as any);

            expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(

              expect.objectContaining({

                skip: 10,

                take: 5,

              }),

            );

        });
        it("should use default pagination values", async () => {


            mockPrismaService.user.findMany
            .mockResolvedValue([]);
            
            mockPrismaService.user.count
            .mockResolvedValue(0);
            
            
            
            const result = await service.findAll({} as any);
            
            
            
            expect(result.page)
            .toBe(1);
            
            
            expect(result.limit)
            .toBe(10);
            
            
            
            expect(mockPrismaService.user.findMany)
            .toHaveBeenCalledWith(
            
            expect.objectContaining({
            
            skip:0,
            
            take:10
            
            })
            
            );
            
            
            });

    });

    describe("findOne", () => {

        it("should throw NotFoundException if user does not exist", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(

                service.findOne(1)

            ).rejects.toThrow(NotFoundException);

            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
              where: { id: 1 },
            });

        });

        it("should return a user if it exists", async () => {

            const user = { id: 1, username: "adminuser22" };

            mockPrismaService.user.findUnique.mockResolvedValue(user);

            const result = await service.findOne(1);

            expect(result).toEqual(user);

        });

    });

    describe("update", () => {

        it("should throw NotFoundException if user does not exist", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(

                service.update(1, { username: "newname" })

            ).rejects.toThrow(NotFoundException);

            expect(mockPrismaService.user.update).not.toHaveBeenCalled();

        });

        it("should throw ConflictException if new username already belongs to another user", async () => {

            mockPrismaService.user.findUnique
              .mockResolvedValueOnce({ id: 1, username: "oldname" })
              .mockResolvedValueOnce({ id: 2, username: "newname" });

            await expect(

                service.update(1, { username: "newname" })

            ).rejects.toThrow(ConflictException);

            expect(mockPrismaService.user.update).not.toHaveBeenCalled();

        });

        it("should throw ConflictException if new email already belongs to another user", async () => {

            mockPrismaService.user.findUnique
              .mockResolvedValueOnce({ id: 1, email: "old@example.com" })
              .mockResolvedValueOnce({ id: 2, email: "new@example.com" });

            await expect(

                service.update(1, { email: "new@example.com" })

            ).rejects.toThrow(ConflictException);

            expect(mockPrismaService.user.update).not.toHaveBeenCalled();

        });

        it("should hash the password when a new password is provided", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue({
              id: 1,
              username: "adminuser22",
            });

            (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");

            const updatedUser = {
              id: 1,
              password: "newHashedPassword",
            };

            mockPrismaService.user.update.mockResolvedValue(updatedUser);

            const result = await service.update(1, { password: "NewPass@123" });

            expect(result).toEqual(updatedUser);

            expect(bcrypt.hash).toHaveBeenCalledWith("NewPass@123", 10);

            expect(mockPrismaService.user.update).toHaveBeenCalledWith({

              where: { id: 1 },

              data: expect.objectContaining({
                password: "newHashedPassword",
              }),

            });

        });

        it("should update a user successfully without conflicts", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue({
              id: 1,
              username: "adminuser22",
            });

            const updatedUser = {
              id: 1,
              firstName: "Updated",
            };

            mockPrismaService.user.update.mockResolvedValue(updatedUser);

            const result = await service.update(1, { firstName: "Updated" });

            expect(result).toEqual(updatedUser);

        });

    });

    describe("remove", () => {

        it("should throw NotFoundException if user does not exist", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(

                service.remove(1)

            ).rejects.toThrow(NotFoundException);

            expect(mockPrismaService.user.delete).not.toHaveBeenCalled();

        });

        it("should delete a user successfully", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue({
              id: 1,
              username: "adminuser22",
            });

            const deletedUser = { id: 1, username: "adminuser22" };

            mockPrismaService.user.delete.mockResolvedValue(deletedUser);

            const result = await service.remove(1);

            expect(result).toEqual(deletedUser);

            expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
              where: { id: 1 },
            });

        });

    });

    describe("findByEmail", () => {

        it("should look up the user by a trimmed, lowercased email", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue({
              id: 1,
              email: "admin@example.com",
            });

            const result = await service.findByEmail(" Admin@Example.com ");

            expect(result).toEqual({
              id: 1,
              email: "admin@example.com",
            });

            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
              where: { email: "admin@example.com" },
            });

        });

    });

    describe("findByUsername", () => {

        it("should look up the user by a trimmed, lowercased username", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue({
              id: 1,
              username: "adminuser22",
            });

            const result = await service.findByUsername(" AdminUser22 ");

            expect(result).toEqual({
              id: 1,
              username: "adminuser22",
            });

            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
              where: { username: "adminuser22" },
            });

        });

    });

    describe("findByUsernameOrEmail", () => {

        it("should look up the user by username or email", async () => {

            mockPrismaService.user.findFirst.mockResolvedValue({
              id: 1,
              username: "adminuser22",
            });

            const result = await service.findByUsernameOrEmail(" AdminUser22 ");

            expect(result).toEqual({
              id: 1,
              username: "adminuser22",
            });

            expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({

              where: {
                OR: [
                  { username: "adminuser22" },
                  { email: "adminuser22" },
                ],
              },

            });

        });

    });

    describe("existsByUsername", () => {

        it("should return true if the username exists", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });

            const result = await service.existsByUsername("adminuser22");

            expect(result).toBe(true);

        });

        it("should return false if the username does not exist", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue(null);

            const result = await service.existsByUsername("nouser");

            expect(result).toBe(false);

        });

    });

    describe("existsByEmail", () => {

        it("should return true if the email exists", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });

            const result = await service.existsByEmail("admin@example.com");

            expect(result).toBe(true);

        });

        it("should return false if the email does not exist", async () => {

            mockPrismaService.user.findUnique.mockResolvedValue(null);

            const result = await service.existsByEmail("noone@example.com");

            expect(result).toBe(false);

        });

    });

  })