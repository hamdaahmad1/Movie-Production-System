import {
    Controller,
    Get,
    UseGuards,
    Req
  } from "@nestjs/common";
  
  import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from "@nestjs/swagger";
  
  import { DashboardService } from "./dashboard.service";
  
  import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
  import { RolesGuard } from "../auth/guards/roles.guard";
  import { Roles } from "../auth/decorators/roles.decorator";
  import { Request } from "express";
  
  @ApiBearerAuth("JWT-auth")
  @ApiTags("Dashboard")
  @Controller("dashboard")
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class DashboardController {
    constructor(
      private dashboardService: DashboardService,
    ) {}
  
    
  
    @Roles("ADMIN")
    @Get("admin")
    @ApiOperation({
      summary: "Admin dashboard",
    })
    @ApiResponse({
      status: 200,
      description: "Dashboard data",
    })
    getAdminDashboard() {
      return this.dashboardService.getAdminDashboard();

    }

    
    @Roles("EDITOR")
    @Get("editor")
    @ApiOperation({
      summary: "Editor dashboard",
    })
    @ApiResponse({
      status: 200,
      description: "Dashboard data",
    })
    getEditorDashboard() 
    {
      return this.dashboardService.getEditorDashboard();
    }

    @Roles("VIEWER")
@Get("viewer")
@ApiOperation({
  summary: "Viewer dashboard",
})
@ApiResponse({
  status: 200,
  description: "Dashboard data",
})
getViewerDashboard(@Req() req:any) {
  return this.dashboardService.getViewerDashboard(req.user["id"]);
}

    
}