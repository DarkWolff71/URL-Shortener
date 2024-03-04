import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  collectDefaultMetrics: {
    <T extends client.RegistryContentType>(
      config?: client.DefaultMetricsCollectorConfiguration<T>,
    ): void;
    metricsList: string[];
  };
  private readonly register: client.Registry<'text/plain; version=0.0.4; charset=utf-8'>;
  public readonly httpRequestCounter: client.Counter<string>;

  constructor() {
    this.register = client.register;
    this.collectDefaultMetrics = client.collectDefaultMetrics;
    this.collectDefaultMetrics({ register: this.register });

    this.httpRequestCounter = new client.Counter({
      name: 'total_http_requests',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code', 'device_type', 'browser'],
      registers: [this.register],
    });
  }

  async getMetrics() {
    return await client.register.metrics();
  }
}
