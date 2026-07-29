import { SetMetadata } from '@nestjs/common';

export const STANDARD_CRUD_ROLES_KEY = 'standardCrudRoles';

export const StandardCrudRoles = () =>
  SetMetadata(STANDARD_CRUD_ROLES_KEY, true);