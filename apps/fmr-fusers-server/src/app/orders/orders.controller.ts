import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Get('user/:userId')
  getOrdersByUserId(@Param('userId') userId: string) {
    return this.ordersService.getOrdersByUserId(userId);
  }

  @Post()
  createOrder(@Body() orderData: { userId: string; amount: number; status?: string }) {
    return this.ordersService.createOrder(orderData);
  }

  @Put(':id')
  updateOrder(@Param('id') id: string, @Body() orderData: { userId?: string; amount?: number; status?: string }) {
    return this.ordersService.updateOrder(id, orderData);
  }

  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
