import { Injectable, type NestMiddleware } from "@nestjs/common";
import type {
    Request, Response, NextFunction,
} from 'express';


@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    use(
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        const startedAt = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - startedAt;

            console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms, `);
        });
        next();
    }
}