import { Module } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  imports: [
    UsersModule,

    JwtModule.register({
        secret:process.env.JWT_SECRET,
        signOptions:{
            expiresIn: '1d',
        },
    }),
],

  controllers: [AuthController],

  providers: [AuthService,JwtStrategy, RolesGuard],
  exports:[AuthService]
})
export class AuthModule {}