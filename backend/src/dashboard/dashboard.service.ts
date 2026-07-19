import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard() {
    const totalMovies = await this.prisma.movie.count();

    const totalActors = await this.prisma.actor.count();

    const totalDirectors = await this.prisma.director.count();

    const totalUsers = await this.prisma.user.count();

    const recentMovies = await this.prisma.movie.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        director: true,
        actors: true,
      },
    });

    return {
      totalMovies,
      totalActors,
      totalDirectors,
      totalUsers,
      recentMovies,
    };
  }
}