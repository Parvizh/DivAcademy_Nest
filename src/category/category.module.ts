import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    RedisCacheModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})

export class CategoryModule {}
