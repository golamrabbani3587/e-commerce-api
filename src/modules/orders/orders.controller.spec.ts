import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './entities/order.entity';
import { NotFoundException } from '@nestjs/common';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  const mockOrderService = {
    createOrder: jest.fn((createOrderDto: CreateOrderDto) => ({
      id: '1',
      ...createOrderDto,
    })),
    getAllOrders: jest.fn(() => [
      { id: '1', product: 'Product 1', quantity: 2 },
      { id: '2', product: 'Product 2', quantity: 1 },
    ]),
    getOrderById: jest.fn((id: string) =>
      id === '1' ? { id: '1', product: 'Product 1', quantity: 2 } : null,
    ),
    updateOrder: jest.fn((id: string, updateOrderDto: UpdateOrderDto) =>
      id === '1'
        ? { id: '1', ...updateOrderDto }
        : null,
    ),
    deleteOrder: jest.fn((id: string) => id === '1'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });


  it('should get all orders', async () => {
    const result = await orderController.getAllOrders();
    expect(result).toEqual([
      { id: '1', product: 'Product 1', quantity: 2 },
      { id: '2', product: 'Product 2', quantity: 1 },
    ]);
  });

  it('should get an order by ID', async () => {
    const result = await orderController.getOrderById('1');
    expect(result).toEqual({ id: '1', product: 'Product 1', quantity: 2 });
  });

  it('should throw NotFoundException when getting a non-existent order by ID', async () => {
    try {
      await orderController.getOrderById('999');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Order not found');
    }
  });


  it('should delete an order', async () => {
    const result = await orderController.deleteOrder('1');
    expect(result).toBe(true);
  });

  it('should throw NotFoundException when deleting a non-existent order', async () => {
    try {
      await orderController.deleteOrder('999');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Order not found');
    }
  });
});
