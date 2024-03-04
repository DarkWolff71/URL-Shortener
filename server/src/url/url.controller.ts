import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators';
import { UserDTO } from 'src/auth/dto/auth.dto';
import { UrlService } from './url.service';

@Controller('url')
@UseGuards(AuthGuard('jwt'))
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Post('short-url')
  async createShortUrl(@Body('url') url: string, @GetUser() user: UserDTO) {
    return this.urlService.createShortUrl(url, user);
  }

  @Get('get-urls')
  async getUrls(@GetUser() user: UserDTO) {
    return this.urlService.getUrls(user);
  }

  @Get(':shortUrl')
  async redirectToUrl(
    @Param('shortUrl') shortUrl: string,
    @GetUser() user: UserDTO,
  ) {
    return this.urlService.redirectToUrl(shortUrl, user);
  }
}
