import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { DbModule } from 'src/db/db.module';
import { ZookeeperModule } from 'src/zookeeper/zookeeper.module';

@Module({
  imports: [DbModule, ZookeeperModule],
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlModule {}
