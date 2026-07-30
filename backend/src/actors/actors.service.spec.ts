import { Test, TestingModule } from '@nestjs/testing';

import { ActorsService } from './actors.service';

import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';

describe('ActorsService', () => {

    let service: ActorsService;

    let prismaService: PrismaService;

    let cloudinaryService: CloudinaryService;

    const mockPrismaService = {

      actor: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },

    };

    const mockCloudinaryService = {

      uploadImage: jest.fn(),

    };

    const mockCreateActorDto: CreateActorDto = {
      name: "Leonardo DiCaprio",
      dob: "1974-11-11",
      nationality: "American",
      gender: "Male",
      biography: "An American actor and film producer known for his work in biopics.",
      awards: 5,
    };
    const mockUser = {
      id: 9,
      role: "EDITOR",
    };

    beforeEach(async () => {

      const module: TestingModule =
        await Test.createTestingModule({

          providers: [

            ActorsService,

            {
              provide: PrismaService,
              useValue: mockPrismaService,
            },

            {
              provide: CloudinaryService,
              useValue: mockCloudinaryService,
            },

          ],

        }).compile();

      service =
        module.get<ActorsService>(ActorsService);

      prismaService =
        module.get<PrismaService>(PrismaService);

      cloudinaryService =
        module.get<CloudinaryService>(CloudinaryService);

    });

    afterEach(() => {

      jest.clearAllMocks();

    });

    it("should be defined", () => {

        expect(service).toBeDefined();

    });

    describe("create", () => {

      it("should throw BadRequestException if dob is in the future", async () => {
    
        const dto = {
          ...mockCreateActorDto,
          dob: "2099-01-01",
        };
    
    
        await expect(
          service.create(dto, mockUser, undefined)
        ).rejects.toThrow(BadRequestException);
    
      });
    
    
    
      it("should throw BadRequestException if actor name already exists", async () => {
    
        const dto = {
          ...mockCreateActorDto,
        };
    
    
        mockPrismaService.actor.findFirst.mockResolvedValue({
          id: 1,
          name: "Leonardo DiCaprio",
        });
    
    
        await expect(
          service.create(dto, mockUser, undefined)
        ).rejects.toThrow(BadRequestException);
    
    
    
        expect(
          mockPrismaService.actor.findFirst
        ).toHaveBeenCalledWith({
          where: {
            name: {
              equals: dto.name,
              mode: "insensitive",
            },
          },
        });
    
    
    
        expect(
          mockPrismaService.actor.create
        ).not.toHaveBeenCalled();
    
      });
    
    
    
      it("should throw an error if Cloudinary upload fails", async () => {
    
        const dto = {
          ...mockCreateActorDto,
        };
    
    
        const file = {} as Express.Multer.File;
    
    
        mockPrismaService.actor.findFirst
          .mockResolvedValue(null);
    
    
    
        mockCloudinaryService.uploadImage
          .mockRejectedValue(
            new Error("Cloudinary upload failed")
          );
    
    
    
        await expect(
          service.create(dto, mockUser, file)
        ).rejects.toThrow(
          "Cloudinary upload failed"
        );
    
    
    
        expect(
          mockCloudinaryService.uploadImage
        ).toHaveBeenCalledWith(file);
    
    
    
        expect(
          mockPrismaService.actor.create
        ).not.toHaveBeenCalled();
    
      });
    
    
    
      it("should create an actor successfully", async () => {
    
        const dto = {
          ...mockCreateActorDto,
        };
    
    
        const file = {} as Express.Multer.File;
    
    
    
        mockPrismaService.actor.findFirst
          .mockResolvedValue(null);
    
    
    
        mockCloudinaryService.uploadImage
          .mockResolvedValue({
            secure_url:
              "https://cloudinary.com/actor.jpg",
          });
    
    
    
        const createdActor = {
    
          id: 1,
    
          name: dto.name,
    
          dob: new Date(dto.dob),
    
          nationality: dto.nationality,
    
          gender: dto.gender,
    
          biography: dto.biography,
    
          awards: dto.awards,
    
          imagePath:
            "https://cloudinary.com/actor.jpg",
    
          createdById: 9,
    
        };
    
    
    
        mockPrismaService.actor.create
          .mockResolvedValue(createdActor);
    
    
    
        const result = await service.create(
          dto,
          mockUser,
          file
        );
    
    
    
        expect(result).toEqual(createdActor);
    
    
    
        expect(
          mockCloudinaryService.uploadImage
        ).toHaveBeenCalledWith(file);
    
    
    
        expect(
          mockPrismaService.actor.create
        ).toHaveBeenCalledWith({
    
          data: {
    
            name: dto.name,
    
            dob: new Date(dto.dob),
    
            nationality: dto.nationality,
    
            gender: dto.gender,
    
            biography: dto.biography,
    
            awards: dto.awards,
    
            imagePath:
              "https://cloudinary.com/actor.jpg",
    
             createdBy: {
      connect: {
        id: 9,
      },
    },

    
          },
    
        });
    
      });
    
    
    });

    describe("findOne", () => {

      it("should throw NotFoundException if actor does not exist", async () => {

        const id = 1;

        mockPrismaService.actor.findUnique.mockResolvedValue(null);

        await expect(
            service.findOne(id)
        ).rejects.toThrow(NotFoundException);

        expect(
            mockPrismaService.actor.findUnique
        ).toHaveBeenCalledWith({

            where: {
                id,
            },

            include: {
                movies: true,
            },

          });
        });

        it("should return an actor if it exists", async () => {

          const actor = {

              id: 1,

              name: "Leonardo DiCaprio",

              movies: [
                  {
                      id: 1,
                      title: "Inception",
                  }
              ],

          };

          mockPrismaService.actor.findUnique.mockResolvedValue(actor);

          const result =
              await service.findOne(1);

          expect(result).toEqual(actor);

          expect(
              mockPrismaService.actor.findUnique
          ).toHaveBeenCalledWith({

              where: {
                  id: 1,
              },

              include: {
                  movies: true,
              },

          });

      });
    });

    describe("findAll", () => {

      it("should return paginated actors", async () => {

        const actors = [
          { id: 1, name: "Leonardo DiCaprio" },
          { id: 2, name: "Tom Hardy" },
        ];

        mockPrismaService.actor.findMany.mockResolvedValue(actors);
        mockPrismaService.actor.count.mockResolvedValue(2);

        const result = await service.findAll({});

        expect(result).toEqual({
          data: actors,
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        });

        expect(mockPrismaService.actor.findMany).toHaveBeenCalledWith({
          where: {},
          include: {
            movies: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: 0,
          take: 10,
        });

        expect(mockPrismaService.actor.count).toHaveBeenCalledWith({
          where: {},
        });

      });

      it("should apply search and birthYear filters correctly", async () => {

        mockPrismaService.actor.findMany.mockResolvedValue([]);
        mockPrismaService.actor.count.mockResolvedValue(0);

        await service.findAll({
          search: "Leonardo",
          birthYear: 1974,
        });

        expect(mockPrismaService.actor.findMany).toHaveBeenCalledWith({

          where: {

            name: {
              contains: "Leonardo",
              mode: "insensitive",
            },

            dob: {
              gte: new Date("1974-01-01"),
              lt: new Date("1975-01-01"),
            },

          },

          include: {
            movies: true,
          },

          orderBy: {
            createdAt: "desc",
          },

          skip: 0,

          take: 10,

        });

      });

    });

    describe("update", () => {

      it("should throw NotFoundException if actor does not exist", async () => {

        const dto = { ...mockCreateActorDto };

        mockPrismaService.actor.findUnique.mockResolvedValue(null);

        await expect(
          service.update(1, undefined, dto)
        ).rejects.toThrow(NotFoundException);

        expect(mockPrismaService.actor.findUnique).toHaveBeenCalledWith({
          where: {
            id: 1,
          },
        });

        expect(mockPrismaService.actor.update).not.toHaveBeenCalled();

      });

      it("should keep existing image when no new file is uploaded", async () => {

        const dto = { ...mockCreateActorDto };

        mockPrismaService.actor.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "old-image.jpg",
        });

        mockPrismaService.actor.findFirst.mockResolvedValue(null);

        const updatedActor = {
          id: 1,
          imagePath: "old-image.jpg",
        };

        mockPrismaService.actor.update.mockResolvedValue(updatedActor);

        const result = await service.update(1, undefined, dto);

        expect(result).toEqual(updatedActor);

        expect(mockCloudinaryService.uploadImage).not.toHaveBeenCalled();

        expect(mockPrismaService.actor.update).toHaveBeenCalledWith({

          where: {
            id: 1,
          },

          data: expect.objectContaining({
            imagePath: "old-image.jpg",
          }),

        });

      });

      it("should upload a new image when a new file is provided", async () => {

        const dto = { ...mockCreateActorDto };

        const file = {} as Express.Multer.File;

        mockPrismaService.actor.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "old-image.jpg",
        });

        mockPrismaService.actor.findFirst.mockResolvedValue(null);

        mockCloudinaryService.uploadImage.mockResolvedValue({
          secure_url: "new-image.jpg",
        });

        const updatedActor = {
          id: 1,
          imagePath: "new-image.jpg",
        };

        mockPrismaService.actor.update.mockResolvedValue(updatedActor);

        const result = await service.update(1, file, dto);

        expect(result).toEqual(updatedActor);

        expect(mockCloudinaryService.uploadImage)
          .toHaveBeenCalledWith(file);

        expect(mockPrismaService.actor.update).toHaveBeenCalledWith({

          where: {
            id: 1,
          },

          data: expect.objectContaining({
            imagePath: "new-image.jpg",
          }),

        });

      });

    });

    describe("partialUpdate", () => {

      it("should throw NotFoundException if actor does not exist", async () => {

        mockPrismaService.actor.findUnique.mockResolvedValue(null);

        await expect(
          service.partialUpdate(1, {
            name: "New Name",
          })
        ).rejects.toThrow(NotFoundException);

        expect(mockPrismaService.actor.update).not.toHaveBeenCalled();

      });

      it("should throw BadRequestException if new name already exists", async () => {

        mockPrismaService.actor.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "oldImage.jpg",
        });

        mockPrismaService.actor.findFirst.mockResolvedValue({
          id: 2,
          name: "Tom Hardy",
        });

        await expect(
          service.partialUpdate(1, {
            name: "Tom Hardy",
          })
        ).rejects.toThrow(BadRequestException);

        expect(mockPrismaService.actor.update).not.toHaveBeenCalled();

      });

      it("should partially update an actor successfully", async () => {

        const updatedActor = {
          id: 1,
          name: "Updated Name",
        };

        mockPrismaService.actor.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "oldImage.jpg",
        });

        mockPrismaService.actor.findFirst.mockResolvedValue(null);

        mockPrismaService.actor.update.mockResolvedValue(updatedActor);

        const result = await service.partialUpdate(1, {
          name: "Updated Name",
        });

        expect(result).toEqual(updatedActor);

        expect(mockPrismaService.actor.update).toHaveBeenCalled();

      });

    });

    describe("remove", () => {

      it("should throw NotFoundException if actor does not exist", async () => {
    
        mockPrismaService.actor.findUnique
          .mockResolvedValue(null);
    
    
    
        await expect(
          service.remove(1, mockUser)
        ).rejects.toThrow(NotFoundException);
    
    
    
        expect(
          mockPrismaService.actor.delete
        ).not.toHaveBeenCalled();
    
      });
    
    
    
      it("should throw BadRequestException if actor is assigned to movies", async () => {
    
        mockPrismaService.actor.findUnique
          .mockResolvedValue({
    
            id: 1,
    
            name: "Leonardo DiCaprio",
    
            createdById: 9,
    
            movies: [
              {
                id: 1,
                title: "Inception",
              },
            ],
    
          });
    
    
    
        await expect(
          service.remove(1, mockUser)
        ).rejects.toThrow(BadRequestException);
    
    
    
        expect(
          mockPrismaService.actor.delete
        ).not.toHaveBeenCalled();
    
      });
    
    
    
      it("should throw ForbiddenException if editor tries to delete another user's actor", async () => {
    
        mockPrismaService.actor.findUnique
          .mockResolvedValue({
    
            id: 1,
    
            name: "Leonardo DiCaprio",
    
            createdById: 20,
    
            movies: [],
    
          });
    
    
    
        await expect(
          service.remove(1, mockUser)
        ).rejects.toThrow(ForbiddenException);
    
    
    
        expect(
          mockPrismaService.actor.delete
        ).not.toHaveBeenCalled();
    
      });
    
    
    
      it("should allow editor to delete his own actor", async () => {
    
        const actor = {
    
          id: 1,
    
          name: "Leonardo DiCaprio",
    
          createdById: 9,
    
          movies: [],
    
        };
    
    
        mockPrismaService.actor.findUnique
          .mockResolvedValue(actor);
    
    
    
        mockPrismaService.actor.delete
          .mockResolvedValue(actor);
    
    
    
        const result = await service.remove(
          1,
          mockUser
        );
    
    
    
        expect(result).toEqual(actor);
    
    
    
        expect(
          mockPrismaService.actor.delete
        ).toHaveBeenCalledWith({
    
          where: {
            id: 1,
          },
    
        });
    
      });
    
    
    
      it("should allow admin to delete any actor", async () => {
    
        const adminUser = {
    
          id: 1,
    
          role: "ADMIN",
    
        };
    
    
    
        const actor = {
    
          id: 1,
    
          name: "Leonardo DiCaprio",
    
          createdById: 20,
    
          movies: [],
    
        };
    
    
    
        mockPrismaService.actor.findUnique
          .mockResolvedValue(actor);
    
    
    
        mockPrismaService.actor.delete
          .mockResolvedValue(actor);
    
    
    
        const result = await service.remove(
          1,
          adminUser
        );
    
    
    
        expect(result).toEqual(actor);
    
    
    
        expect(
          mockPrismaService.actor.delete
        ).toHaveBeenCalledWith({
    
          where: {
            id: 1,
          },
    
        });
    
      });
    
    
    
      it("should return deleted actor after successful deletion", async () => {
    
        const deletedActor = {
    
          id: 1,
    
          name: "Leonardo DiCaprio",
    
          createdById: 9,
    
          movies: [],
    
        };
    
    
    
        mockPrismaService.actor.findUnique
          .mockResolvedValue(deletedActor);
    
    
    
        mockPrismaService.actor.delete
          .mockResolvedValue(deletedActor);
    
    
    
        const result = await service.remove(
          1,
          mockUser
        );
    
    
    
        expect(result).toEqual(deletedActor);
    
      });
    
    
    });

  })