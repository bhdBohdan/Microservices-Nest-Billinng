import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtAuthGuard, RmqService } from '@app/common';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.billingService.getHello();
  }

  @EventPattern('order_created')
  @UseGuards(JwtAuthGuard)
  async handleOrderCrated(
    @Payload() data: any,
    @Ctx() context: RmqContext,
    @Req() req: any,
  ) {
    console.log(req?.user);
    this.billingService.bill(data);
    this.rmqService.ack(context);
  }
}
