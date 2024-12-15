import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './entities/order.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(private readonly entityManager: EntityManager) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = this.entityManager.create(Order, createOrderDto);
    await this.entityManager.save(Order, newOrder);
    return newOrder;
  }

  async getAllOrders(userId?: string): Promise<Order[]> {
    const queryBuilder = this.entityManager.createQueryBuilder(Order, 'order');

    if (userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    }

    return await queryBuilder.getMany();
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return await this.entityManager.findOne(Order, {
      where: { id },
    });
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order | null> {
    const order = await this.entityManager.preload(Order, {
      id,
      ...updateOrderDto,
    });
    if (!order) {
      return null;
    }
    return await this.entityManager.save(Order, order);
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await this.entityManager.delete(Order, id);
    return result.affected > 0;
  }
}
