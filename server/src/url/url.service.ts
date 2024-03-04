import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as base62 from 'base62';
import { UserDTO } from 'src/auth/dto/auth.dto';
import { DbService } from 'src/db/db.service';
import { ZookeeperService } from 'src/zookeeper/zookeeper.service';

@Injectable()
export class UrlService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: DbService,
    private zkservice: ZookeeperService,
  ) {}

  async createShortUrl(originalUrl: string, user: UserDTO) {
    let dbUrlResult = await this.prisma.url.findUnique({
      where: {
        originalUrl,
      },
    });
    let shortenedUrl: string;
    if (!dbUrlResult) {
      let range = this.zkservice.getRange();
      if (range.current < range.end - 1) {
        range.current++;
        this.zkservice.setRange(range);
      } else {
        range = await this.zkservice.getTokenRange();
        range.current++;

        this.zkservice.setRange(range);
      }

      shortenedUrl = this.generateShortenedUrl(range.current - 1);
      await this.prisma.url.create({
        data: {
          originalUrl: originalUrl,
          shortenedUrl: shortenedUrl,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
          users: {
            connect: [{ handle: user.handle }],
          },
        },
      });
    } else {
      const isUserAlreadyLinked = dbUrlResult.userIDs.includes(user.userId);
      if (!isUserAlreadyLinked) {
        const dbResult = await this.prisma.url.update({
          where: {
            id: dbUrlResult.id,
          },
          data: {
            users: {
              connect: [{ id: user.userId }],
            },
          },
        });
        shortenedUrl = dbResult.shortenedUrl;
      } else {
        const dbResult = await this.prisma.url.findUnique({
          where: {
            originalUrl,
          },
        });
        shortenedUrl = dbResult.shortenedUrl;
      }
    }

    return { shortenedUrl };
  }

  async getUrls(user: UserDTO) {
    const dbResult = await this.prisma.user.findUnique({
      where: {
        handle: user.handle,
      },
      select: {
        urls: {
          select: {
            shortenedUrl: true,
            originalUrl: true,
            expiresAt: true,
          },
        },
      },
    });
    return { urls: dbResult.urls };
  }

  async redirectToUrl(shortUrl: string, user: UserDTO) {
    let cacheResult = await this.cacheManager.get(`${user.handle}_${shortUrl}`);
    if (cacheResult) {
      return { originalUrl: cacheResult };
    }

    const dbResult = await this.prisma.user.findUnique({
      where: {
        id: user.userId,
      },
      select: {
        urls: {
          where: {
            shortenedUrl: shortUrl,
          },
        },
      },
    });

    if (dbResult.urls.length > 0) {
      const originalUrl = dbResult.urls[0].originalUrl;
      this.cacheManager.set(`${user.handle}_${shortUrl}`, originalUrl);

      return { originalUrl };
    }

    throw new BadRequestException('Invalid request.', {
      cause: new Error(),
      description: 'Url does not exist.',
    });
  }

  generateShortenedUrl(num: number) {
    return base62.encode(num);
  }
}
