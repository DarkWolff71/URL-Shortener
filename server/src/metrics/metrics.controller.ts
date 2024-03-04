import { Controller, Get, Header } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import * as client from 'prom-client';

@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', client.register.contentType)
  async getMetrics() {
    return await this.metricsService.getMetrics();
  }
}
