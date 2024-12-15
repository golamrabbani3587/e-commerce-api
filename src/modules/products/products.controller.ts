import { Controller, Post, Get, Put, Delete, Param, Body, HttpException, HttpStatus, Query } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from './products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('low-stock')
  async lowStockAlerts(){
    return this.productService.lowStockAlerts();
  }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productService.createProduct(createProductDto);
    } catch (error) {
      throw new HttpException('Error creating product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllProducts(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.productService.getAllProducts(category, search, page, limit);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productService.updateProduct(id, updateProductDto);
    if (!updatedProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return updatedProduct;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const result = await this.productService.deleteProduct(id);
    if (!result) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Product deleted successfully' };
  }

  @Get(':id/stock')
  async getStockLevels(@Param('id') id: string) {
    const stock = await this.productService.getStockLevels(id);
    if (stock === undefined) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return { stock };
  }

  @Put(':id/stock')
  async updateStockLevel(@Param('id') id: string, @Body('stock') stock: number) {
    const updatedProduct = await this.productService.updateStockLevel(id, stock);
    if (!updatedProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return updatedProduct;
  }
}
