import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator
    ) {}

    @Get()
    @HealthCheck()
    check() {
        const serverUrl = process.env.SERVER_URL || '';

        return this.health.check([() => this.http.pingCheck('check server', serverUrl)]);
    }
}
