import 'dotenv/config';

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {PrismaMariaDb} from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient 
implements OnModuleInit, OnModuleDestroy
{
    constructor(){
        const adapter = new PrismaMariaDb({
            host: process.env.DATABASE_HOST ?? 'localhost',
            port: Number(process.env.DATABASE_PORT ?? 3306),
            user: process.env.DATABASE_USER ?? 'root',
      password: process.env.DATABASE_PASSWORD ?? '',
      database: process.env.DATABASE_NAME ?? 'nestjs_otp_demo',
      connectionLimit: 5,
        });
        super({adapter});
    }

    async onModuleInit() {
        await this.$connect();
        console.log('Prisma connected to MYSQL');
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}