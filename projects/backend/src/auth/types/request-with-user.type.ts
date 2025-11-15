import { Request } from 'express';
import { UserDto } from '../../users/dto';

export type RequestWithUser = Request & {
  user: UserDto;
};
