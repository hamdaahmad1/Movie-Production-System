import { Test, TestingModule } from '@nestjs/testing';

import { MoviesService } from './movies.service';

import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { mock } from 'node:test';

describe('MoviesService', () => {

    let service: MoviesService;
  
    let prismaService: PrismaService;
  
    let cloudinaryService: CloudinaryService;
  
    const mockPrismaService = {
  
      movie: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
  
      director: {
        findUnique: jest.fn(),
      },
  
      actor: {
        findMany: jest.fn(),
      },
  
    };
  
    const mockCloudinaryService = {
  
      uploadImage: jest.fn(),
  
    };

    const mockCreateMovieDto: CreateMovieDto = {
      title: "Inception",
      description: "Great movie",
      releaseDate: "2010-07-16",
      duration: 148,
      genre: "Sci-Fi",
      language: "English",
      rating: 5,
      trailerId: "abc123",
      directorId: 1,
      actorIds: [1, 2],
      posterPath: undefined,
      bannerPath: undefined,
    };
    const mockUser = {
      id: 9,
      role: "EDITOR",
    };
  
    beforeEach(async () => {
  
      const module: TestingModule =
        await Test.createTestingModule({
  
          providers: [
  
            MoviesService,
  
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
        module.get<MoviesService>(MoviesService);
  
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

        it("should throw BadRequestException if release date is in the future", async () => {
    
            const dto ={
              ...mockCreateMovieDto,
              releaseDate: "2099-01-01",
  
            }
    
            await expect(
    
                service.create(dto,mockUser)
    
            ).rejects.toThrow(BadRequestException);
    
        });
        
        it("should throw BadRequestException if movie title already exists", async () => {

          const dto ={
            ...mockCreateMovieDto,
          }
          
            mockPrismaService.movie.findFirst.mockResolvedValue({
              id: 1,
              title: "Inception",
            });
          
            await expect(
              service.create(dto,mockUser)
            ).rejects.toThrow(BadRequestException);
          
            expect(mockPrismaService.movie.findFirst).toHaveBeenCalledWith({
              where: {
                title: {
                  equals: dto.title,
                  mode: "insensitive",
                },
              },
            });
          
            expect(mockPrismaService.movie.create).not.toHaveBeenCalled();
          
          });

          it("should throw NotFoundException if director does not exist", async () => {

            const dto ={
              ...mockCreateMovieDto,
              directorId:20,
            }
            mockPrismaService.movie.findFirst.mockResolvedValue(null);
          
            mockPrismaService.director.findUnique.mockResolvedValue(null);
          
            await expect(
              service.create(dto,mockUser)
            ).rejects.toThrow(NotFoundException);
          
            expect(
              mockPrismaService.movie.findFirst
            ).toHaveBeenCalled();
          
            expect(
              mockPrismaService.director.findUnique
            ).toHaveBeenCalledWith({
              where: {
                id: dto.directorId,
              },
            });
          
            expect(
              mockPrismaService.actor.findMany
            ).not.toHaveBeenCalled();
          
            expect(
              mockPrismaService.movie.create
            ).not.toHaveBeenCalled();
          
          });


          it("should throw BadRequestException if one or more actor Ids are invalid", async () => {

            const dto ={
              ...mockCreateMovieDto,
              actorIds:[1,2,3],
            }
            mockPrismaService.movie.findFirst.mockResolvedValue(null);
          
            mockPrismaService.director.findUnique.mockResolvedValue(null);
          
            await expect(
              service.create(dto,mockUser)
            ).rejects.toThrow(NotFoundException);
          
            expect(
              mockPrismaService.movie.findFirst
            ).toHaveBeenCalled();
          
            expect(
              mockPrismaService.director.findUnique
            ).toHaveBeenCalledWith({
              where: {
                id: dto.directorId,
              },
            });
          
            expect(
              mockPrismaService.actor.findMany
            ).not.toHaveBeenCalled();
          
            expect(
              mockPrismaService.movie.create
            ).not.toHaveBeenCalled();
          
          });

          it("should throw BadRequestException if one or more actor IDs are invalid", async () => {

            const dto = { ...mockCreateMovieDto };
          
            mockPrismaService.movie.findFirst.mockResolvedValue(null);
          
            mockPrismaService.director.findUnique.mockResolvedValue({
              id: 1,
              name: "Christopher Nolan",
            });
          
            mockPrismaService.actor.findMany.mockResolvedValue([
              {
                id: 1,
                name: "Leonardo DiCaprio",
              },
            ]);
          
            await expect(
              service.create(dto,mockUser)
            ).rejects.toThrow(BadRequestException);
          
            expect(mockPrismaService.movie.findFirst).toHaveBeenCalled();
          
            expect(mockPrismaService.director.findUnique).toHaveBeenCalled();
          
            expect(mockPrismaService.actor.findMany).toHaveBeenCalledWith({
              where: {
                id: {
                  in: dto.actorIds,
                },
              },
            });
          
            expect(mockPrismaService.movie.create).not.toHaveBeenCalled();
          
          });


          it("should throw an error if Cloudinary upload fails", async () => {

            const dto = { ...mockCreateMovieDto };
          
            const file = {} as Express.Multer.File;
          
            mockPrismaService.movie.findFirst.mockResolvedValue(null);
          
            mockPrismaService.director.findUnique.mockResolvedValue({
              id: 1,
              name: "Christopher Nolan",
            });
          
            mockPrismaService.actor.findMany.mockResolvedValue([
              { id: 1, name: "Leonardo DiCaprio" },
              { id: 2, name: "Tom Hardy" },
            ]);
          
            mockCloudinaryService.uploadImage.mockRejectedValue(
              new Error("Cloudinary upload failed"),
            );
          
            await expect(
              service.create(dto,mockUser, file)
            ).rejects.toThrow("Cloudinary upload failed");
          
            expect(
              mockCloudinaryService.uploadImage
            ).toHaveBeenCalledWith(file);
          
            expect(
              mockPrismaService.movie.create
            ).not.toHaveBeenCalled();
          
          });

          it("should upload banner successfully while creating a movie", async () => {

            const mockBanner = {
              originalname: "banner.jpg",
              buffer: Buffer.from("banner"),
            } as Express.Multer.File;
          
            mockPrismaService.movie.findFirst.mockResolvedValue(null);
          
            mockPrismaService.director.findUnique.mockResolvedValue({
              id: 1,
            });
          
            mockPrismaService.actor.findMany.mockResolvedValue([
              { id: 1 },
              { id: 2 },
            ]);
          
            mockCloudinaryService.uploadImage
              .mockResolvedValueOnce({
                secure_url: "poster-url",
              })
              .mockResolvedValueOnce({
                secure_url: "banner-url",
              });
          
            mockPrismaService.movie.create.mockResolvedValue({
              id: 1,
              posterPath: "poster-url",
              bannerPath: "banner-url",
            });
          
            const result = await service.create(
              mockCreateMovieDto,
              mockUser,
              {} as Express.Multer.File,
              mockBanner,
            );
          
            expect(mockCloudinaryService.uploadImage).toHaveBeenCalledTimes(2);
          
            expect(result.bannerPath).toBe("banner-url");
          });

          it("should throw if banner upload fails while creating movie", async () => {

            const mockPoster = {} as Express.Multer.File;
          
            const mockBanner = {
              originalname: "banner.jpg",
              buffer: Buffer.from("banner"),
            } as Express.Multer.File;
          
            mockPrismaService.movie.findFirst.mockResolvedValue(null);
          
            mockPrismaService.director.findUnique.mockResolvedValue({
              id: 1,
            });
          
            mockPrismaService.actor.findMany.mockResolvedValue([
              { id: 1 },
              { id: 2 },
            ]);
          
            mockCloudinaryService.uploadImage
              .mockResolvedValueOnce({
                secure_url: "poster-url",
              })
              .mockRejectedValueOnce(
                new Error("Banner upload failed"),
              );
          
            await expect(
              service.create(
                mockCreateMovieDto,
                mockUser,
                mockPoster,
                mockBanner,
              ),
            ).rejects.toThrow("Banner upload failed");
          });

          it("should create a movie successfully", async () => {

            const dto = { ...mockCreateMovieDto };
        
            const file = {} as Express.Multer.File;
        
            mockPrismaService.movie.findFirst.mockResolvedValue(null);
        
            mockPrismaService.director.findUnique.mockResolvedValue({
                id: 1,
                name: "Christopher Nolan",
            });
        
            mockPrismaService.actor.findMany.mockResolvedValue([
                {
                    id: 1,
                    name: "Leonardo DiCaprio",
                },
                {
                    id: 2,
                    name: "Tom Hardy",
                },
            ]);
        
            mockCloudinaryService.uploadImage.mockResolvedValue({
                secure_url: "https://cloudinary.com/movie.jpg",
            });
        
            const createdMovie = {
        
                id: 1,
        
                title: dto.title,
        
                description: dto.description,
        
                releaseDate: new Date(dto.releaseDate),
        
                duration: dto.duration,
        
                genre: dto.genre,
        
                language: dto.language,
        
                rating: dto.rating,
        
                trailerId: dto.trailerId,
        
                posterPath: "https://cloudinary.com/movie.jpg",
        
                director: {
                    id: 1,
                    name: "Christopher Nolan",
                },
        
                actors: [
                    {
                        id: 1,
                        name: "Leonardo DiCaprio",
                    },
                    {
                        id: 2,
                        name: "Tom Hardy",
                    },
                ],
                createdBy: {
                  connect: {
                    id: mockUser.id,
                  },
                },
        
            };
        
            mockPrismaService.movie.create.mockResolvedValue(createdMovie);
        
            const result = await service.create(dto,mockUser,file);
        
            expect(result).toEqual(createdMovie);
        
            expect(
                mockCloudinaryService.uploadImage
            ).toHaveBeenCalledWith(file);
        
            expect(
                mockPrismaService.movie.create
            ).toHaveBeenCalledWith({
        
                data: {
        
                    title: dto.title,
        
                    description: dto.description,
        
                    releaseDate: new Date(dto.releaseDate),
        
                    duration: dto.duration,
        
                    genre: dto.genre,
        
                    language: dto.language,
        
                    rating: dto.rating,
        
                    trailerId: dto.trailerId,
        
                    posterPath: "https://cloudinary.com/movie.jpg",
                    bannerPath: null,
        
                    director: {
                        connect: {
                            id: dto.directorId,
                        },
                    },
        
                    actors: {
                        connect: dto.actorIds.map((id) => ({
                            id,
                        })),
                    },
                    createdBy: {
                      connect: {
                        id: mockUser.id,
                      },
                    },
        
                },
        
                include: {
        
                    director: true,
        
                    actors: true,
        
                },
        
            });
        
        });


    
    });

    describe("findOne", () => {

      it("should throw NotFoundException if movie does not exist", async () => {
    
        const id = 1;
    
        mockPrismaService.movie.findUnique.mockResolvedValue(null);
    
        await expect(
          service.findOne(id)
        ).rejects.toThrow(NotFoundException);
    
        expect(
          mockPrismaService.movie.findUnique
        ).toHaveBeenCalledWith({
    
          where: {
            id,
          },
    
          include: {
            director: true,
            actors: true,
            reviews: true,
          },
    
        });
    
      });
    
      it("should return a movie if it exists", async () => {
    
        const movie = {
    
          id: 1,
    
          title: "Inception",
          rating: 5,
    
          director: {
            id: 1,
            name: "Christopher Nolan",
          },
    
          actors: [
            {
              id: 1,
              name: "Leonardo DiCaprio",
            },
          ],
    
          reviews: [
            {
              id: 1,
              rating: 5,
              comment: "Great movie!",
            },
          ],
    
        };
    
        mockPrismaService.movie.findUnique.mockResolvedValue(movie);
    
        const result = await service.findOne(1);
    
        expect(result).toEqual({
          ...movie,
          averageRating: 5,
          totalRatings: 2,
          popularityScore: 5 * Math.log10(3), // 5 × log10(totalRatings + 1)
        });
    
        expect(
          mockPrismaService.movie.findUnique
        ).toHaveBeenCalledWith({
    
          where: {
            id: 1,
          },
    
          include: {
            director: true,
            actors: true,
            reviews: true,
          },
    
        });
    
      });
    
    });


    describe("findAll", () => {

      it("should return paginated movies", async () => {
    
        const movies = [
          {
            id: 1,
            title: "Inception",
            rating: 5,
            reviews: [],
          },
          {
            id: 2,
            title: "Interstellar",
            rating: 4,
            reviews: [],
          },
        ];
    
        mockPrismaService.movie.findMany.mockResolvedValue(movies);
        mockPrismaService.movie.count.mockResolvedValue(2);
    
        const result = await service.findAll({});
    
        const expectedMovies = [
          {
            ...movies[0],
            averageRating: 5,
            totalRatings: 1,
            popularityScore: 5 * Math.log10(2),
          },
          {
            ...movies[1],
            averageRating: 4,
            totalRatings: 1,
            popularityScore: 4 * Math.log10(2),
          },
        ];
    
        expect(result).toEqual({
          data: expectedMovies,
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        });
    
        expect(mockPrismaService.movie.findMany).toHaveBeenCalledWith({
          where: {},
          include: {
            director: true,
            actors: true,
            reviews: true,
          },
        });
    
        expect(mockPrismaService.movie.count).toHaveBeenCalledWith({
          where: {},
        });
    
      });
    
      it("should apply all filters correctly", async () => {
    
        mockPrismaService.movie.findMany.mockResolvedValue([]);
        mockPrismaService.movie.count.mockResolvedValue(0);
    
        await service.findAll({
          search: "Inception",
          genre: "Sci-Fi",
          directorId: 1,
          actorId: 2,
          year: 2010,
        });
    
        expect(mockPrismaService.movie.findMany).toHaveBeenCalledWith({
    
          where: {
    
            title: {
              contains: "Inception",
              mode: "insensitive",
            },
    
            genre: {
              contains: "Sci-Fi",
              mode: "insensitive",
            },
    
            directorId: 1,
    
            actors: {
              some: {
                id: 2,
              },
            },
    
            releaseDate: {
              gte: new Date("2010-01-01"),
              lt: new Date("2011-01-01"),
            },
    
          },
    
          include: {
            director: true,
            actors: true,
            reviews: true,
          },
    
        });
    
      });
    
      it("should sort movies by popularity score in ascending order", async () => {
    
        const movies = [
          {
            id: 1,
            title: "Titanic",
            rating: 5,
            reviews: [],
          },
          {
            id: 2,
            title: "Inception",
            rating: 5,
            reviews: [
              {
                rating: 5,
              },
            ],
          },
        ];
    
        mockPrismaService.movie.findMany.mockResolvedValue(movies);
        mockPrismaService.movie.count.mockResolvedValue(2);
    
        const result = await service.findAll({
          sortBy: "rating",
          order: "asc",
        });
    
        expect(result.data[0].title).toBe("Titanic");
        expect(result.data[1].title).toBe("Inception");
    
      });
    
      it("should sort movies by popularity score in descending order", async () => {
    
        const movies = [
          {
            id: 1,
            title: "Titanic",
            rating: 5,
            reviews: [],
          },
          {
            id: 2,
            title: "Inception",
            rating: 5,
            reviews: [
              {
                rating: 5,
              },
            ],
          },
        ];
    
        mockPrismaService.movie.findMany.mockResolvedValue(movies);
        mockPrismaService.movie.count.mockResolvedValue(2);
    
        const result = await service.findAll({
          sortBy: "rating",
          order: "desc",
        });
    
        expect(result.data[0].title).toBe("Inception");
        expect(result.data[1].title).toBe("Titanic");
    
      });
    
      it("should apply pagination correctly", async () => {
    
        const movies = Array.from({ length: 15 }, (_, i) => ({
          id: i + 1,
          title: `Movie ${i + 1}`,
          rating: 5,
          reviews: [],
        }));
    
        mockPrismaService.movie.findMany.mockResolvedValue(movies);
        mockPrismaService.movie.count.mockResolvedValue(15);
    
        const result = await service.findAll({
          page: 3,
          limit: 5,
        });
    
        expect(result.data).toHaveLength(5);
        expect(result.page).toBe(3);
        expect(result.limit).toBe(5);
        expect(result.total).toBe(15);
        expect(result.totalPages).toBe(3);
    
        expect(mockPrismaService.movie.findMany).toHaveBeenCalledWith({
          where: {},
          include: {
            director: true,
            actors: true,
            reviews: true,
          },
        });
    
      });
    
    });

    describe("update", () => {
      it("should throw NotFoundException if movie does not exist", async () => {

        const dto = { ...mockCreateMovieDto };
      
        mockPrismaService.movie.findUnique.mockResolvedValue(null);
      
        await expect(
          service.update(1, dto)
        ).rejects.toThrow(NotFoundException);
      
        expect(mockPrismaService.movie.findUnique).toHaveBeenCalledWith({
          where: {
            id: 1,
          },
        });
      
        expect(mockPrismaService.movie.update).not.toHaveBeenCalled();
      
      });

      it("should keep existing poster when no new file is uploaded", async () => {

        const dto = { ...mockCreateMovieDto };
      
        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          posterPath: "old-poster.jpg",
        });
      
        mockPrismaService.movie.findFirst.mockResolvedValue(null);
      
        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          name: "Christopher Nolan",
        });
      
        mockPrismaService.actor.findMany.mockResolvedValue([
          { id: 1 },
          { id: 2 },
        ]);
      
        const updatedMovie = {
          id: 1,
          posterPath: "old-poster.jpg",
        };
      
        mockPrismaService.movie.update.mockResolvedValue(updatedMovie);
      
        const result = await service.update(1, dto);
      
        expect(result).toEqual(updatedMovie);
      
        expect(mockCloudinaryService.uploadImage).not.toHaveBeenCalled();
      
        expect(mockPrismaService.movie.update).toHaveBeenCalledWith({
      
          where: {
            id: 1,
          },
      
          data: expect.objectContaining({
            posterPath: "old-poster.jpg",
          }),
      
          include: {
            director: true,
            actors: true,
          },
      
        });
      
      });

      it("should upload a new poster when a new file is provided", async () => {

        const dto = { ...mockCreateMovieDto };
      
        const file = {} as Express.Multer.File;
      
        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          posterPath: "old-poster.jpg",
        });
      
        mockPrismaService.movie.findFirst.mockResolvedValue(null);
      
        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          name: "Christopher Nolan",
        });
      
        mockPrismaService.actor.findMany.mockResolvedValue([
          { id: 1 },
          { id: 2 },
        ]);
      
        mockCloudinaryService.uploadImage.mockResolvedValue({
          secure_url: "new-poster.jpg",
        });
      
        const updatedMovie = {
          id: 1,
          posterPath: "new-poster.jpg",
        };
      
        mockPrismaService.movie.update.mockResolvedValue(updatedMovie);
      
        const result = await service.update(1, dto, file);
      
        expect(result).toEqual(updatedMovie);
      
        expect(mockCloudinaryService.uploadImage)
          .toHaveBeenCalledWith(file);
      
        expect(mockPrismaService.movie.update).toHaveBeenCalledWith({
      
          where: {
            id: 1,
          },
      
          data: expect.objectContaining({
            posterPath: "new-poster.jpg",
          }),
      
          include: {
            director: true,
            actors: true,
          },
      
        });
      
      });
      it("should upload banner while updating movie", async () => {

        const mockBanner = {
          originalname: "banner.jpg",
          buffer: Buffer.from("banner"),
        } as Express.Multer.File;
      
        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          posterPath: "old-poster",
          bannerPath: "old-banner",
        });
      
        mockPrismaService.movie.findFirst.mockResolvedValue(null);
      
        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
        });
      
        mockPrismaService.actor.findMany.mockResolvedValue([
          { id: 1 },
          { id: 2 },
        ]);
      
        mockCloudinaryService.uploadImage.mockResolvedValue({
          secure_url: "new-banner",
        });
      
        mockPrismaService.movie.update.mockResolvedValue({
          id: 1,
          bannerPath: "new-banner",
        });
      
        const result = await service.update(
          1,
          mockCreateMovieDto,
          undefined,
          mockBanner,
        );
      
        expect(result.bannerPath).toBe("new-banner");
      });

      it("should throw if banner upload fails while updating", async () => {

        const mockBanner = {
          originalname: "banner.jpg",
          buffer: Buffer.from("banner"),
        } as Express.Multer.File;
      
        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          posterPath: "old-poster",
          bannerPath: "old-banner",
        });
      
        mockCloudinaryService.uploadImage.mockRejectedValue(
          new Error("Banner upload failed"),
        );
      
        await expect(
          service.update(
            1,
            mockCreateMovieDto,
            undefined,
            mockBanner,
          ),
        ).rejects.toThrow("Banner upload failed");
      });

      it("should update a movie successfully", async () => {

        const dto = { ...mockCreateMovieDto };
      
        const file = {} as Express.Multer.File;
      
        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          posterPath: "old-poster.jpg",
        });
      
        mockPrismaService.movie.findFirst.mockResolvedValue(null);
      
        mockPrismaService.director.findUnique.mockResolvedValue({
          id: 1,
          name: "Christopher Nolan",
        });
      
        mockPrismaService.actor.findMany.mockResolvedValue([
          { id: 1 },
          { id: 2 },
        ]);
      
        mockCloudinaryService.uploadImage.mockResolvedValue({
          secure_url: "new-poster.jpg",
        });
      
        const updatedMovie = {
          id: 1,
          title: dto.title,
          description: dto.description,
          releaseDate: new Date(dto.releaseDate),
          duration: dto.duration,
          genre: dto.genre,
          language: dto.language,
          rating: dto.rating,
          trailerId: dto.trailerId,
          posterPath: "new-poster.jpg",
          director: {
            id: 1,
            name: "Christopher Nolan",
          },
          actors: [
            { id: 1 },
            { id: 2 },
          ],
        };
      
        mockPrismaService.movie.update.mockResolvedValue(updatedMovie);
      
        const result = await service.update(1, dto, file);
      
        expect(result).toEqual(updatedMovie);
      
        expect(mockCloudinaryService.uploadImage)
          .toHaveBeenCalledWith(file);
      
        expect(mockPrismaService.movie.update)
          .toHaveBeenCalledWith({
      
            where: {
              id: 1,
            },
      
            data: {
              title: dto.title,
              description: dto.description,
              releaseDate: new Date(dto.releaseDate),
              duration: dto.duration,
              genre: dto.genre,
              language: dto.language,
              rating: dto.rating,
              trailerId: dto.trailerId,
              posterPath: "new-poster.jpg",
      
              director: {
                connect: {
                  id: dto.directorId,
                },
              },
      
              actors: {
                set: dto.actorIds.map((id) => ({
                  id,
                })),
              },
      
            },
      
            include: {
              director: true,
              actors: true,
            },
      
          });
      
      });

    });

    describe("partialUpdate", () => {

      it("should throw NotFoundException if director does not exist", async () => {

        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          posterPath: "oldPoster.jpg",
        });
      
        mockPrismaService.director.findUnique.mockResolvedValue(null);
      
        await expect(
          service.partialUpdate(1, {
            directorId: 10,
          })
        ).rejects.toThrow(NotFoundException);
      
        expect(mockPrismaService.director.findUnique).toHaveBeenCalledWith({
          where: {
            id: 10,
          },
        });
      
        expect(mockPrismaService.movie.update).not.toHaveBeenCalled();
      
      });

      it("should throw BadRequestException if actor IDs are invalid", async () => {

        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          posterPath: "oldPoster.jpg",
        });
      
        mockPrismaService.actor.findMany.mockResolvedValue([
          { id: 1 },
        ]);
      
        await expect(
          service.partialUpdate(1, {
            actorIds: [1, 2],
          })
        ).rejects.toThrow(BadRequestException);
      
        expect(mockPrismaService.actor.findMany).toHaveBeenCalled();
      
        expect(mockPrismaService.movie.update).not.toHaveBeenCalled();
      
      });

      it("should keep existing poster if no new file is uploaded", async () => {

        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          posterPath: "oldPoster.jpg",
        });
      
        mockPrismaService.movie.update.mockResolvedValue({
          id: 1,
          posterPath: "oldPoster.jpg",
        });
      
        await service.partialUpdate(1, {
          title: "Updated Movie",
        });
      
        expect(mockCloudinaryService.uploadImage).not.toHaveBeenCalled();
      
        expect(mockPrismaService.movie.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              posterPath: "oldPoster.jpg",
            }),
          }),
        );
      
      });
      it("should upload a new poster when a new file is provided", async () => {

        const file = {} as Express.Multer.File;
      
        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          posterPath: "oldPoster.jpg",
        });
      
        mockCloudinaryService.uploadImage.mockResolvedValue({
          secure_url: "newPoster.jpg",
        });
      
        mockPrismaService.movie.update.mockResolvedValue({
          id: 1,
          posterPath: "newPoster.jpg",
        });
      
        await service.partialUpdate(
          1,
          {},
          file,
        );
      
        expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(file);
      
        expect(mockPrismaService.movie.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              posterPath: "newPoster.jpg",
            }),
          }),
        );
      
      });
      it("should upload banner during partial update", async () => {

        const mockBanner = {
          originalname: "banner.jpg",
          buffer: Buffer.from("banner"),
        } as Express.Multer.File;
      
        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          bannerPath: "old-banner",
        });
      
        mockCloudinaryService.uploadImage.mockResolvedValue({
          secure_url: "new-banner",
        });
      
        mockPrismaService.movie.update.mockResolvedValue({
          id: 1,
          bannerPath: "new-banner",
        });
      
        const result = await service.partialUpdate(
          1,
          {},
          undefined,
          mockBanner,
        );
      
        expect(result.bannerPath).toBe("new-banner");
      });
      it("should throw if banner upload fails during partial update", async () => {

        const mockBanner = {
          originalname: "banner.jpg",
          buffer: Buffer.from("banner"),
        } as Express.Multer.File;
      
        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          bannerPath: "old-banner",
        });
      
        mockCloudinaryService.uploadImage.mockRejectedValue(
          new Error("Banner upload failed"),
        );
      
        await expect(
          service.partialUpdate(
            1,
            {},
            undefined,
            mockBanner,
          ),
        ).rejects.toThrow("Banner upload failed");
      });

      it("should partially update a movie successfully", async () => {

        const updatedMovie = {
          id: 1,
          title: "Updated Movie",
        };
      
        mockPrismaService.movie.findUnique.mockResolvedValue({
          id: 1,
          posterPath: "oldPoster.jpg",
        });
      
        mockPrismaService.movie.update.mockResolvedValue(updatedMovie);
      
        const result = await service.partialUpdate(1, {
          title: "Updated Movie",
        });
      
        expect(result).toEqual(updatedMovie);
      
        expect(mockPrismaService.movie.update).toHaveBeenCalled();
      
      });



    });

    describe("remove", () => {

      it("should throw NotFoundException if movie does not exist", async () => {
    
        mockPrismaService.movie.findUnique.mockResolvedValue(null);
    
    
        await expect(
          service.remove(1, mockUser)
        ).rejects.toThrow(NotFoundException);
    
    
        expect(
          mockPrismaService.movie.findUnique
        ).toHaveBeenCalledWith({
          where: {
            id: 1,
          },
        });
    
    
        expect(
          mockPrismaService.movie.delete
        ).not.toHaveBeenCalled();
    
      });
    
    
    
      it("should allow editor to delete his own movie", async () => {
    
        const movie = {
          id: 1,
          title: "Inception",
          createdById: 9,
        };
    
    
        mockPrismaService.movie.findUnique
          .mockResolvedValue(movie);
    
    
        mockPrismaService.movie.delete
          .mockResolvedValue(movie);
    
    
    
        const result = await service.remove(
          1,
          mockUser
        );
    
    
        expect(result).toEqual(movie);
    
    
        expect(
          mockPrismaService.movie.delete
        ).toHaveBeenCalledWith({
          where: {
            id: 1,
          },
        });
    
      });
    
    
    
      it("should throw ForbiddenException if editor tries to delete another user's movie", async () => {
    
        const movie = {
          id: 1,
          title: "Inception",
          createdById: 20,
        };
    
    
        mockPrismaService.movie.findUnique
          .mockResolvedValue(movie);
    
    
    
        await expect(
          service.remove(1, mockUser)
        ).rejects.toThrow(ForbiddenException);
    
    
    
        expect(
          mockPrismaService.movie.delete
        ).not.toHaveBeenCalled();
    
      });
    
    
    
      it("should allow admin to delete any movie", async () => {
    
        const adminUser = {
          id: 1,
          role: "ADMIN",
        };
    
    
        const movie = {
          id: 1,
          title: "Inception",
          createdById: 20,
        };
    
    
        mockPrismaService.movie.findUnique
          .mockResolvedValue(movie);
    
    
        mockPrismaService.movie.delete
          .mockResolvedValue(movie);
    
    
    
        const result = await service.remove(
          1,
          adminUser
        );
    
    
        expect(result).toEqual(movie);
    
    
        expect(
          mockPrismaService.movie.delete
        ).toHaveBeenCalledWith({
          where: {
            id: 1,
          },
        });
    
      });
    
    
    
      it("should delete movie successfully and return deleted movie", async () => {
    
        const movie = {
          id: 1,
          title: "Inception",
          createdById: 9,
        };
    
    
        mockPrismaService.movie.findUnique
          .mockResolvedValue(movie);
    
    
        mockPrismaService.movie.delete
          .mockResolvedValue(movie);
    
    
    
        const result = await service.remove(
          1,
          mockUser
        );
    
    
        expect(result).toEqual(movie);
    
      });
    
    
    });
    describe("getGenres", () => {

      it("should return unique genres", async () => {
    
        mockPrismaService.movie.findMany.mockResolvedValue([
          { genre: "Action, Adventure" },
          { genre: "Adventure, Sci-Fi" },
          { genre: "Drama" },
        ]);
    
        const result = await service.getGenres();
    
        expect(result).toEqual([
          "Action",
          "Adventure",
          "Sci-Fi",
          "Drama",
        ]);
    
        expect(mockPrismaService.movie.findMany).toHaveBeenCalledWith({
          select: {
            genre: true,
          },
        });
    
      });

      it("should return an empty array when no movies exist", async () => {

        mockPrismaService.movie.findMany.mockResolvedValue([]);
    
        const result = await service.getGenres();
    
        expect(result).toEqual([]);
    
      });

      it("should ignore empty genre values", async () => {

        mockPrismaService.movie.findMany.mockResolvedValue([
          { genre: "" },
          { genre: "Action" },
          { genre: null },
          { genre: "Drama, Action" },
        ]);
    
        const result = await service.getGenres();
    
        expect(result).toEqual([
          "Action",
          "Drama",
        ]);
    
      });
  

    });
  
  
  })