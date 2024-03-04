import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from './dto/auth.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  @Post('signup')
  signup(@Body() signupDto: SignupDTO) {
    return this.authservice.signup(signupDto);
  }

  @Post('signin')
  @HttpCode(200)
  signin(
    @Body() signinDto: SigninDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authservice.signin(signinDto, res);
  }

  @Get('is-authenticated')
  @UseGuards(AuthGuard('jwt'))
  isAuthenticated() {
    return {};
  }
}
