import{
    Injectable,
    CanActivate,
    ExecutionContext,
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { STANDARD_CRUD_ROLES_KEY } from '../decorators/standard-crud-roles.decorator';
import { Request } from 'express';


@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector){}

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      
          ROLES_KEY,
      
          [
            context.getHandler(),
            context.getClass(),
          ],
      
        );
      
        const usesStandardCrudRoles =
          this.reflector.getAllAndOverride<boolean>(
      
            STANDARD_CRUD_ROLES_KEY,
      
            [
              context.getHandler(),
              context.getClass(),
            ],
      
          );
      
        const request = context.switchToHttp().getRequest<Request>();
      
        const user = request.user as { role: string };
      
        // Explicit @Roles() always wins
        if (requiredRoles) {
      
          return requiredRoles.includes(user.role);
      
        }
      
        // Standard CRUD authorization
        if (usesStandardCrudRoles) {
      
          switch (request.method) {
      
            case 'GET':
              return true;
      
            case 'POST':
            case 'PUT':
            case 'PATCH':
              return ['ADMIN', 'EDITOR'].includes(user.role);
      
              case 'DELETE':
                return ['ADMIN', 'EDITOR'].includes(user.role);
      
            default:
              return false;
      
          }
      
        }
      
        // No role metadata
        return true;
      
      }
}