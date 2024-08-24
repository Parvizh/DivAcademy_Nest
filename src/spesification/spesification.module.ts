import { Module } from '@nestjs/common';
import { SpesificationController } from './spesification.controller';
import { SpesificationService } from './spesification.service';

@Module({
  controllers: [SpesificationController],
  providers: [SpesificationService]
})
export class SpesificationModule {}
