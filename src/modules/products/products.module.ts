import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { Product } from './entities/product.entity';
import { CategoryModule } from '../categories/categories.module';
import { CategoryRepository } from '../categories/category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, CategoryRepository]),
    CategoryModule
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'CategoryRepository',
      useClass: CategoryRepository,
    }
  ],
  exports: [ProductService],
})
export class ProductModule {}
