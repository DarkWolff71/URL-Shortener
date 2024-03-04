import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
  providers: [DbService],
  exports:[DbService]
})
export class DbModule {}
