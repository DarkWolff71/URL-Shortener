import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { UrlModule } from './url/url.module';
import { ZookeeperService } from './zookeeper/zookeeper.service';
import { ZookeeperModule } from './zookeeper/zookeeper.module';
import { MetricsModule } from './metrics/metrics.module';
import * as redisStore from 'cache-manager-ioredis';
import { MetricsMiddleware } from './metrics/metrics.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MetricsModule,
    ThrottlerModule.forRoot([{ ttl: 60, limit: 20 }]),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      db: 0,
      ttl: 60 * 60 * 1000,
      maxmemoryPolicy: 'allkeys-lru',
    }),
    UrlModule,
    ZookeeperModule,
  ],
  providers: [
    ZookeeperService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
