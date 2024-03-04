import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as useragent from 'express-useragent';

export interface UserAgentInfo {
  browser: string;
  version: string;
  os: string;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const UserAgent = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const ua = useragent.parse(request.headers['user-agent']);
    if (data) {
      return ua[data];
    }
    return {
      browser: ua.browser,
      version: ua.version,
      os: ua.os,
      platform: ua.platform,
      isMobile: ua.isMobile,
      isTablet: ua.isTablet,
      isDesktop: ua.isDesktop,
    };
  },
);
