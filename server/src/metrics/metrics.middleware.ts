import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';
import * as useragent from 'express-useragent';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const route = req.url
      ? new URL(req.url, `http://${req.headers.host}`).pathname
      : 'unknown_route';
    const ua = useragent.parse(req.headers['user-agent']);
    let deviceType = '';
    if (ua.isMobile) {
      deviceType = 'Mobile';
    } else if (ua.isTablet) {
      deviceType = 'Tablet';
    } else {
      deviceType = 'Desktop';
    }

    res.on('finish', () => {
      this.metricsService.httpRequestCounter
        .labels(
          req.method,
          route,
          res.statusCode.toString(),
          deviceType,
          ua.browser,
        )
        .inc();
    });
    next();
  }
}
