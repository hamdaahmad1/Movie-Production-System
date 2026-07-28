import { Test, TestingModule } from '@nestjs/testing';

import { DirectorsService } from './directors.service';

import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';

describe('DirectorsService', () => {

    let service: DirectorsService;
   
    const mockPrismaService = {

      director: {
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

    const mockCreateDirectorDto: CreateDirectorDto = {
      name: "Christopher Nolan",
      dob: "1970-07-30",
      nationality: "British American",
      biography: "Christopher Nolan is a British-American filmmaker known for complex films.",
      imagePath: undefined,
    };

    beforeEach(async () => {
        

      const module: TestingModule =
        await Test.createTestingModule({

          providers: [

            DirectorsService,

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
        module.get<DirectorsService>(DirectorsService);

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
              ...mockCreateDirectorDto,
              dob: "2099-01-01",

            }

            await expect(

                service.create(dto)

            ).rejects.toThrow(BadRequestException);

        });
        it("should create a director without uploading an image", async () => {

            const dto = { ...mockCreateDirectorDto };
          
            mockPrismaService.director.findFirst.mockResolvedValue(null);
          
            const createdDirector = {
              id: 1,
              ...dto,
              dob: new Date(dto.dob),
              imagePath: null,
            };
          
            mockPrismaService.director.create.mockResolvedValue(createdDirector);
          
            const result = await service.create(dto);
          
            expect(result).toEqual(createdDirector);
          
            expect(mockCloudinaryService.uploadImage).not.toHaveBeenCalled();
          
          });

        
        it("should throw ConflictException if director name already exists", async () => {

          const dto = {
            ...mockCreateDirectorDto,
          }

            mockPrismaService.director.findFirst.mockResolvedValue({
              id: 1,
              name: "Christopher Nolan",
            });

            await expect(
              service.create(dto)
            ).rejects.toThrow(ConflictException);

            expect(mockPrismaService.director.findFirst).toHaveBeenCalledWith({
              where: {
                name: {
                  equals: dto.name,
                  mode: "insensitive",
                },
              },
            });

            expect(mockPrismaService.director.create).not.toHaveBeenCalled();

          });

          it("should throw an error if Cloudinary upload fails", async () => {

            const dto = { ...mockCreateDirectorDto };

            const file = {} as Express.Multer.File;

            mockPrismaService.director.findFirst.mockResolvedValue(null);

            mockCloudinaryService.uploadImage.mockRejectedValue(
              new Error("Cloudinary upload failed"),
            );

            await expect(
              service.create(dto, file)
            ).rejects.toThrow("Cloudinary upload failed");

            expect(
              mockCloudinaryService.uploadImage
            ).toHaveBeenCalledWith(file);

            expect(
              mockPrismaService.director.create
            ).not.toHaveBeenCalled();

          });



          it
          (
            "should create a director successfully", async () => 
            {

            const dto = { ...mockCreateDirectorDto };

            const file = {} as Express.Multer.File;

            mockPrismaService.director.findFirst.mockResolvedValue(null);

            mockCloudinaryService.uploadImage.mockResolvedValue({
                secure_url: "https://cloudinary.com/director.jpg",
            });

            const createdDirector = {

                id: 1,

                name: dto.name,

                dob: new Date(dto.dob),

                nationality: dto.nationality,

                biography: dto.biography,

                imagePath: "https://cloudinary.com/director.jpg",

            };

            mockPrismaService.director.create.mockResolvedValue(createdDirector);

            const result = await service.create(dto, file);

            expect(result).toEqual(createdDirector);

            expect(
                mockCloudinaryService.uploadImage
            ).toHaveBeenCalledWith(file);

            expect(
                mockPrismaService.director.create
            ).toHaveBeenCalledWith({

                data: {

                    name: dto.name,

                    dob: new Date(dto.dob),

                    nationality: dto.nationality,

                    biography: dto.biography,

                    imagePath: "https://cloudinary.com/director.jpg",

                },

            });

            });
        it("should create a director without uploading an image", async () => {

            const dto = { ...mockCreateDirectorDto };
          
            mockPrismaService.director.findFirst.mockResolvedValue(null);
          
            const createdDirector = {
              id: 1,
              ...dto,
              dob: new Date(dto.dob),
              imagePath: null,
            };
          
            mockPrismaService.director.create.mockResolvedValue(createdDirector);
          
            const result = await service.create(dto);
          
            expect(result).toEqual(createdDirector);
          
            expect(mockCloudinaryService.uploadImage).not.toHaveBeenCalled();
          
          });

    });

    describe("findOne", () => {

      it("should throw NotFoundException if director does not exist", async () => {

        const id = 1;

        mockPrismaService.director.findUnique.mockResolvedValue(null);

        await expect(
            service.findOne(id)
        ).rejects.toThrow(NotFoundException);

        expect(
            mockPrismaService.director.findUnique
        ).toHaveBeenCalledWith({

            where: {
                id,
            },

            include: {
                movies: true,
            },

          });
        });

        it("should return a director if it exists", async () => {

          const director = {

              id: 1,

              name: "Christopher Nolan",

              movies: [
                  {
                      id: 1,
                      title: "Inception",
                  }
              ],

          };

          mockPrismaService.director.findUnique.mockResolvedValue(director);

          const result =
              await service.findOne(1);

          expect(result).toEqual(director);

          expect(
              mockPrismaService.director.findUnique
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

      it("should return paginated directors", async () => {

        const directors = [
          { id: 1, name: "Christopher Nolan" },
          { id: 2, name: "Steven Spielberg" },
        ];

        mockPrismaService.director.findMany.mockResolvedValue(directors);
        mockPrismaService.director.count.mockResolvedValue(2);

        const result = await service.findAll({});

        expect(result).toEqual({
          data: directors,
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        });

        expect(mockPrismaService.director.findMany).toHaveBeenCalledWith({
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

        expect(mockPrismaService.director.count).toHaveBeenCalledWith({
          where: {},
        });

      });

      it("should apply search and birthYear filters correctly", async () => {

        mockPrismaService.director.findMany.mockResolvedValue([]);
        mockPrismaService.director.count.mockResolvedValue(0);

        await service.findAll({
          search: "Christopher",
          birthYear: 1970,
        });

        expect(mockPrismaService.director.findMany).toHaveBeenCalledWith({

          where: {

            name: {
              contains: "Christopher",
              mode: "insensitive",
            },

            dob: {
              gte: new Date("1970-01-01"),
              lt: new Date("1971-01-01"),
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
      it("should apply pagination correctly", async () => {

        mockPrismaService.director.findMany.mockResolvedValue([]);
      
        mockPrismaService.director.count.mockResolvedValue(0);
      
        await service.findAll({
          page: 3,
          limit: 5,
        });
      
        expect(mockPrismaService.director.findMany)
          .toHaveBeenCalledWith({
      
            where: {},
      
            include: {
              movies: true,
            },
      
            orderBy: {
              createdAt: "desc",
            },
      
            skip: 10,
      
            take: 5,
      
          });
      
      });

    });

    describe("update", () => {

      it("should throw NotFoundException if director does not exist", async () => {

        const dto = { ...mockCreateDirectorDto };

        mockPrismaService.director.findUnique.mockResolvedValue(null);

        await expect(
          service.update(1, dto)
        ).rejects.toThrow(NotFoundException);

        expect(mockPrismaService.director.findUnique).toHaveBeenCalledWith({
          where: {
            id: 1,
          },
        });

        expect(mockPrismaService.director.update).not.toHaveBeenCalled();

      });

      // NOTE: unlike create(), update() throws BadRequestException here instead of
      // ConflictException for the same duplicate-name situation. This is an
      // inconsistency in directors.service.ts worth fixing for consistency,
      // but the test below checks what the code ACTUALLY does right now.
      it("should throw ConflictException if new name already belongs to another director", async () => {

        const dto = { ...mockCreateDirectorDto };

        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "old-image.jpg",
        });

        mockPrismaService.director.findFirst.mockResolvedValue({
          id: 2,
          name: "Christopher Nolan",
        });

        await expect(
          service.update(1, dto)
        ).rejects.toThrow(ConflictException);

        expect(mockPrismaService.director.update).not.toHaveBeenCalled();

      });

      it("should keep existing image when no new file is uploaded", async () => {

        const dto = { ...mockCreateDirectorDto };

        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "old-image.jpg",
        });

        mockPrismaService.director.findFirst.mockResolvedValue(null);

        const updatedDirector = {
          id: 1,
          imagePath: "old-image.jpg",
        };

        mockPrismaService.director.update.mockResolvedValue(updatedDirector);

        const result = await service.update(1, dto);

        expect(result).toEqual(updatedDirector);

        expect(mockCloudinaryService.uploadImage).not.toHaveBeenCalled();

        expect(mockPrismaService.director.update).toHaveBeenCalledWith({

          where: {
            id: 1,
          },

          data: expect.objectContaining({
            imagePath: "old-image.jpg",
          }),

        });

      });

      it("should upload a new image when a new file is provided", async () => {

        const dto = { ...mockCreateDirectorDto };

        const file = {} as Express.Multer.File;

        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "old-image.jpg",
        });

        mockPrismaService.director.findFirst.mockResolvedValue(null);

        mockCloudinaryService.uploadImage.mockResolvedValue({
          secure_url: "new-image.jpg",
        });

        const updatedDirector = {
          id: 1,
          imagePath: "new-image.jpg",
        };

        mockPrismaService.director.update.mockResolvedValue(updatedDirector);

        const result = await service.update(1, dto, file);

        expect(result).toEqual(updatedDirector);

        expect(mockCloudinaryService.uploadImage)
          .toHaveBeenCalledWith(file);

        expect(mockPrismaService.director.update).toHaveBeenCalledWith({

          where: {
            id: 1,
          },

          data: expect.objectContaining({
            imagePath: "new-image.jpg",
          }),

        });

      });
      it("should update director successfully", async () => {

        const dto = { ...mockCreateDirectorDto };
      
        const updatedDirector = {
          id: 1,
          ...dto,
          imagePath: "old-image.jpg",
        };
      
        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "old-image.jpg",
        });
      
        mockPrismaService.director.findFirst.mockResolvedValue(null);
      
        mockPrismaService.director.update.mockResolvedValue(updatedDirector);
      
        const result = await service.update(1, dto);
      
        expect(result).toEqual(updatedDirector);
      
      });
      it("should throw if Cloudinary upload fails during update", async () => {

        const file = {} as Express.Multer.File;
      
        mockPrismaService.director.findUnique.mockResolvedValue({
          id:1,
          imagePath:"old.jpg",
        });
      
        mockPrismaService.director.findFirst.mockResolvedValue(null);
      
        mockCloudinaryService.uploadImage.mockRejectedValue(
          new Error("Cloudinary upload failed"),
        );
      
        await expect(
      
          service.update(1, mockCreateDirectorDto, file)
      
        ).rejects.toThrow("Cloudinary upload failed");
      
      });

    });

    describe("partialUpdate", () => {

      it("should throw NotFoundException if director does not exist", async () => {

        mockPrismaService.director.findUnique.mockResolvedValue(null);

        await expect(
          service.partialUpdate(1, {
              name: "New Name",
              imagePath: undefined
          })
        ).rejects.toThrow(NotFoundException);

        expect(mockPrismaService.director.update).not.toHaveBeenCalled();

      });

      it("should throw ConflictException if new name already belongs to another director", async () => {

        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "oldImage.jpg",
        });

        mockPrismaService.director.findFirst.mockResolvedValue({
          id: 2,
          name: "Steven Spielberg",
        });

        await expect(
          service.partialUpdate(1, {
              name: "Steven Spielberg",
              imagePath: undefined
          })
        ).rejects.toThrow(ConflictException);

        expect(mockPrismaService.director.update).not.toHaveBeenCalled();

      });

      it("should partially update a director successfully", async () => {

        const updatedDirector = {
          id: 1,
          name: "Updated Name",
        };

        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "oldImage.jpg",
        });

        mockPrismaService.director.findFirst.mockResolvedValue(null);

        mockPrismaService.director.update.mockResolvedValue(updatedDirector);

        const result = await service.partialUpdate(1, {
            name: "Updated Name",
            imagePath: undefined
        });

        expect(result).toEqual(updatedDirector);

        expect(mockPrismaService.director.update).toHaveBeenCalled();

      });
      it("should upload a new image during partial update", async () => {

        const file = {} as Express.Multer.File;
      
        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "old.jpg",
        });
      
        mockPrismaService.director.findFirst.mockResolvedValue(null);
      
        mockCloudinaryService.uploadImage.mockResolvedValue({
          secure_url: "new.jpg",
        });
      
        mockPrismaService.director.update.mockResolvedValue({
          id: 1,
          imagePath: "new.jpg",
        });
      
        await service.partialUpdate(
          1,
          {
            biography: "Updated",
            imagePath: undefined,
          },
          file,
        );
      
        expect(mockCloudinaryService.uploadImage)
          .toHaveBeenCalledWith(file);
      
      });
      it("should keep existing image when no file is uploaded", async () => {

        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          imagePath: "old.jpg",
        });
      
        mockPrismaService.director.findFirst.mockResolvedValue(null);
      
        mockPrismaService.director.update.mockResolvedValue({
          id: 1,
          imagePath: "old.jpg",
        });
      
        await service.partialUpdate(1, {
          biography: "Updated",
          imagePath: undefined,
        });
      
        expect(mockCloudinaryService.uploadImage)
          .not.toHaveBeenCalled();
      
      });
      it("should throw if Cloudinary upload fails during partial update", async () => {

        const file = {} as Express.Multer.File;
      
        mockPrismaService.director.findUnique.mockResolvedValue({
          id:1,
          imagePath:"old.jpg",
        });
      
        mockPrismaService.director.findFirst.mockResolvedValue(null);
      
        mockCloudinaryService.uploadImage.mockRejectedValue(
          new Error("Cloudinary upload failed"),
        );
      
        await expect(
      
          service.partialUpdate(
            1,
            {
              biography:"Updated",
              imagePath: undefined,
            },
            file,
          )
      
        ).rejects.toThrow("Cloudinary upload failed");
      
      });

    });

    describe("remove", () => {

      it("should throw NotFoundException if director does not exist", async () => {

        mockPrismaService.director.findUnique.mockResolvedValue(null);

        await expect(
          service.remove(1)
        ).rejects.toThrow(NotFoundException);

        expect(mockPrismaService.director.delete).not.toHaveBeenCalled();

      });

      it("should throw BadRequestException if director is assigned to movies", async () => {

        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          movies: [
            { id: 1, title: "Inception" },
          ],
        });

        await expect(
          service.remove(1)
        ).rejects.toThrow(BadRequestException);

        expect(mockPrismaService.director.delete).not.toHaveBeenCalled();

      });

      it("should delete director successfully", async () => {

        const deletedDirector = {
          id: 1,
          name: "Christopher Nolan",
        };

        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          name: "Christopher Nolan",
          movies: [],
        });

        mockPrismaService.director.delete.mockResolvedValue(deletedDirector);

        const result = await service.remove(1);

        expect(result).toEqual(deletedDirector);

        expect(mockPrismaService.director.delete).toHaveBeenCalledWith({
          where: {
            id: 1,
          },
        });

      });

    });

  })