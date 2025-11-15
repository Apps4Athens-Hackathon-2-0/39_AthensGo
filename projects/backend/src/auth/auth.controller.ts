import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from '../users/dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AccessTokenDto, SignInDto } from './dto';
import * as types from './types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Logs in a user' })
  @ApiOkResponse({
    description: 'The user has been successfully logged in.',
    type: AccessTokenDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  signIn(@Body() signInDto: SignInDto): Promise<AccessTokenDto> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gets the user profile' })
  @ApiOkResponse({
    description: 'The user profile has been successfully retrieved.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getProfile(@Request() req: types.RequestWithUser): UserDto {
    return req.user;
  }
}
