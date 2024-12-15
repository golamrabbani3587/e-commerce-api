import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { EntityManager, LessThanOrEqual } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(private readonly entityManager: EntityManager) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const categoryId = createProductDto.categoryId;

    const category = await this.entityManager.findOne(Category, { where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newProduct = this.entityManager.create(Product, {
      ...createProductDto,
      category,
    });

    await this.entityManager.save(Product, newProduct);

    return newProduct;
  }

  async getAllProducts(category?: string, search?: string, page: number = 1, limit: number = 10): Promise<Product[]> {
    const queryBuilder = this.entityManager.createQueryBuilder(Product, 'product');

    if (category) {
      const categoryEntity = await this.entityManager.findOne(Category, { where: { name: category } });
      if (categoryEntity) {
        queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId: categoryEntity.id });
      }
    }

    if (search) {
      queryBuilder.andWhere('LOWER(product.name) LIKE :search', { search: `%${search.toLowerCase()}%` });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    return await queryBuilder.getMany();
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return await this.entityManager.findOne(Product, {
      where: { id },
      relations: ['category'],
    });
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
    const product = await this.entityManager.preload(Product, {
      id,
      ...updateProductDto,
    });
    if (!product) {
      return null;
    }
    return await this.entityManager.save(Product, product);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.entityManager.delete(Product, id);
    return result.affected > 0;
  }

  async getStockLevels(id: string): Promise<number> {
    const product = await this.entityManager.findOne(Product, { where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product.stock;
  }

  async updateStockLevel(id: string, stock: number): Promise<Product | null> {
    const product = await this.entityManager.preload(Product, { id, stock });
    if (!product) {
      return null;
    }
    return await this.entityManager.save(Product, product);
  }

  async lowStockAlerts(): Promise<Product[]> {
    const products = await this.entityManager.find(Product, {
      where: {
        stock:LessThanOrEqual(10)
      },
    });

    return products;
  }
}
