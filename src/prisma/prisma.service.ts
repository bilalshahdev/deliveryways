// src/prisma/prisma.service.ts
import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    constructor(private readonly config: ConfigService) {
        const databaseUrl = config.get<string>('database.url');

        if (!databaseUrl) {
            throw new Error('Database URL is not defined in configuration');
        }

        const pool = new Pool({
            connectionString: databaseUrl,
        });

        const adapter = new PrismaPg(pool);

        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database connected successfully');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Database disconnected successfully');
    }
}