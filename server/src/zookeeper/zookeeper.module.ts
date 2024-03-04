import { Module } from '@nestjs/common';
import { ZookeeperService } from './zookeeper.service';

@Module({ exports: [ZookeeperService], providers: [ZookeeperService] })
export class ZookeeperModule {}
