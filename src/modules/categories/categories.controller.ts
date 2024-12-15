import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryService } from './categories.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoryService.createCategory(createCategoryDto);
    } catch (error) {
      throw new HttpException(
        'Error creating category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    const category = await this.categoryService.getCategoryById(id);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const updatedCategory = await this.categoryService.updateCategory(
        id,
        updateCategoryDto,
      );
      if (!updatedCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return updatedCategory;
    } catch (error) {
      throw new HttpException(
        'Error updating category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    const result = await this.categoryService.deleteCategory(id);
    if (!result) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Category deleted successfully' };
  }
}
