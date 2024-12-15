import { EntityRepository, Repository, FindOneOptions, FindOperator } from 'typeorm';
import { Category } from './entities/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async findById(id: string | FindOperator<string>): Promise<Category | undefined> {
    const options: FindOneOptions<Category> = { where: { id } };
    return this.findOne(options);
  }

  findByName(name: string): Promise<Category | undefined> {
    return this.findOne({ where: { name } });
  }

  async createCategory(name: string): Promise<Category> {
    const category = this.create({ name });
    return await this.save(category);
  }

}
