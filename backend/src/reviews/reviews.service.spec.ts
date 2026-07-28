import { Test, TestingModule } from '@nestjs/testing';

import { ReviewsService } from './reviews.service';

import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';

describe('ReviewsService', () => {

    let service: ReviewsService;

    const mockPrismaService = {

      movie: {
        findUnique: jest.fn(),
      },

      review: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        aggregate: jest.fn(),
      },

    };

    const mockCreateReviewDto: CreateReviewDto = {
      rating: 5,
      comment: "Amazing movie",
    };

    beforeEach(async () => {


      const module: TestingModule =
        await Test.createTestingModule({

          providers: [

            ReviewsService,

            {
              provide: PrismaService,
              useValue: mockPrismaService,
            },

          ],

        }).compile();

      service =
        module.get<ReviewsService>(ReviewsService);

    });

    afterEach(() => {

      jest.clearAllMocks();

    });

    it("should be defined", () => {

        expect(service).toBeDefined();

    });

    describe("create", () => {

        it("should throw NotFoundException if movie does not exist", async () => {

            mockPrismaService.movie.findUnique.mockResolvedValue(null);

            await expect(

                service.create(1, 1, mockCreateReviewDto)

            ).rejects.toThrow(NotFoundException);

            expect(mockPrismaService.review.create).not.toHaveBeenCalled();

        });

        it("should throw ConflictException if user already reviewed the movie", async () => {

            mockPrismaService.movie.findUnique.mockResolvedValue({ id: 1 });

            mockPrismaService.review.findUnique.mockResolvedValue({
              id: 1,
              userId: 1,
              movieId: 1,
            });

            await expect(

                service.create(1, 1, mockCreateReviewDto)

            ).rejects.toThrow(ConflictException);

            expect(mockPrismaService.review.create).not.toHaveBeenCalled();

        });

        it("should create a review successfully", async () => {

            const dto = { ...mockCreateReviewDto };

            mockPrismaService.movie.findUnique.mockResolvedValue({ id: 1 });

            mockPrismaService.review.findUnique.mockResolvedValue(null);

            const createdReview = {
              id: 1,
              rating: dto.rating,
              comment: dto.comment,
              userId: 1,
              movieId: 1,
            };

            mockPrismaService.review.create.mockResolvedValue(createdReview);

            const result = await service.create(1, 1, dto);

            expect(result).toEqual(createdReview);

            expect(mockPrismaService.review.create).toHaveBeenCalledWith({

              data: {
                rating: dto.rating,
                comment: dto.comment,
                userId: 1,
                movieId: 1,
              },

            });

        });

    });

    describe("update", () => {

        it("should update a review successfully", async () => {

            const dto = { ...mockCreateReviewDto };

            const updatedReview = {
              id: 1,
              rating: dto.rating,
              comment: dto.comment,
            };

            mockPrismaService.review.update.mockResolvedValue(updatedReview);

            const result = await service.update(1, dto);

            expect(result).toEqual(updatedReview);

            expect(mockPrismaService.review.update).toHaveBeenCalledWith({

              where: {
                id: 1,
              },

              data: {
                rating: dto.rating,
                comment: dto.comment,
              },

            });

        });

    });

    describe("findOne", () => {

        it("should throw NotFoundException if review does not exist", async () => {

            mockPrismaService.review.findUnique.mockResolvedValue(null);

            await expect(

                service.findOne(1)

            ).rejects.toThrow(NotFoundException);

            expect(mockPrismaService.review.findUnique).toHaveBeenCalledWith({
              where: { id: 1 },
            });

        });

        it("should return a review if it exists", async () => {

            const review = {
              id: 1,
              rating: 5,
              comment: "Amazing movie",
            };

            mockPrismaService.review.findUnique.mockResolvedValue(review);

            const result = await service.findOne(1);

            expect(result).toEqual(review);

        });

    });

    describe("remove", () => {

        it("should throw NotFoundException if review does not exist", async () => {

            mockPrismaService.review.findUnique.mockResolvedValue(null);

            const user = { id: 1, role: "VIEWER" };

            await expect(

                service.remove(user, 1)

            ).rejects.toThrow(NotFoundException);

            expect(mockPrismaService.review.delete).not.toHaveBeenCalled();

        });

        it("should throw ForbiddenException if user is not the owner and not an admin", async () => {

            mockPrismaService.review.findUnique.mockResolvedValue({
              id: 1,
              userId: 2,
            });

            const user = { id: 1, role: "VIEWER" };

            await expect(

                service.remove(user, 1)

            ).rejects.toThrow(ForbiddenException);

            expect(mockPrismaService.review.delete).not.toHaveBeenCalled();

        });

        it("should allow the review owner to delete their own review", async () => {

            mockPrismaService.review.findUnique.mockResolvedValue({
              id: 1,
              userId: 1,
            });

            const user = { id: 1, role: "VIEWER" };

            const deletedReview = { id: 1, userId: 1 };

            mockPrismaService.review.delete.mockResolvedValue(deletedReview);

            const result = await service.remove(user, 1);

            expect(result).toEqual(deletedReview);

            expect(mockPrismaService.review.delete).toHaveBeenCalledWith({
              where: { id: 1 },
            });

        });

        it("should allow an admin to delete any review", async () => {

            mockPrismaService.review.findUnique.mockResolvedValue({
              id: 1,
              userId: 2,
            });

            const user = { id: 1, role: "ADMIN" };

            const deletedReview = { id: 1, userId: 2 };

            mockPrismaService.review.delete.mockResolvedValue(deletedReview);

            const result = await service.remove(user, 1);

            expect(result).toEqual(deletedReview);

            expect(mockPrismaService.review.delete).toHaveBeenCalledWith({
              where: { id: 1 },
            });

        });

    });

    describe("findMovieReviews", () => {

        it("should return all reviews for a movie", async () => {

            const reviews = [
              { id: 1, movieId: 1, user: { id: 1, username: "hamda" } },
              { id: 2, movieId: 1, user: { id: 2, username: "ahmad" } },
            ];

            mockPrismaService.review.findMany.mockResolvedValue(reviews);

            const result = await service.findMovieReviews(1);

            expect(result).toEqual(reviews);

            expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({

              where: {
                movieId: 1,
              },

              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },

            });

        });

    });

    describe("getAverageRating", () => {

        it("should return the average rating and total review count", async () => {

            mockPrismaService.review.aggregate.mockResolvedValue({
              _avg: { rating: 4.5 },
              _count: { rating: 2 },
            });

            const result = await service.getAverageRating(1);

            expect(result).toEqual({
              averageRating: 4.5,
              totalReviews: 2,
            });

        });

        it("should return 0 average rating if the movie has no reviews", async () => {

            mockPrismaService.review.aggregate.mockResolvedValue({
              _avg: { rating: null },
              _count: { rating: 0 },
            });

            const result = await service.getAverageRating(1);

            expect(result).toEqual({
              averageRating: 0,
              totalReviews: 0,
            });

        });

    });

    describe("getMyReviews", () => {

        it("should return all reviews made by the user", async () => {

            const reviews = [
              { id: 1, userId: 1, movie: { id: 1, title: "Inception" } },
            ];

            mockPrismaService.review.findMany.mockResolvedValue(reviews);

            const result = await service.getMyReviews(1);

            expect(result).toEqual(reviews);

            expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({

              where: {
                userId: 1,
              },

              include: {
                movie: true,
              },

            });

        });

    });

  })