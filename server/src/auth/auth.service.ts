import { ForbiddenException, Injectable, Res } from '@nestjs/common';
import { SigninDTO, SignupDTO } from './dto/auth.dto';
import { DbService } from 'src/db/db.service';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

const PRISMA_UNIQUE_CONSTRAINT_ERROR_CODE = 'P2002';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DbService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(signupDto: SignupDTO) {
    const hash = await argon2.hash(signupDto.password);

    try {
      await this.prisma.user.create({
        data: {
          name: signupDto.name,
          handle: signupDto.handle,
          password: hash,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ForbiddenException(
            'User already exists with the given handle.',
          );
        }
      }
      throw error;
    }
    return { msg: 'Account created succefully.' };
  }

  async signin(signinDto: SigninDTO, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        handle: signinDto.handle,
      },
    });
    if (!user) {
      throw new ForbiddenException('No user with the given handle.');
    }

    const isPasswordCorrect = await argon2.verify(
      user.password,
      signinDto.password,
    );
    if (!isPasswordCorrect) {
      throw new ForbiddenException('Incorrect credentials.');
    }
    const jwtPayload = {
      userId: user.id,
      name: user.name,
      handle: user.handle,
    };
    const accessToken = await this.getJwtToken(jwtPayload);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return { msg: 'Successfully authenticated.' };
  }

  getJwtToken(payload: { userId: string; name: string; handle: string }) {
    return this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
