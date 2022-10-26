import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirstMiddleware } from './middlewares/first.middleware';
import { logger } from './middlewares/logger.middleware';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ChallengeModule } from './challenge/challenge.module';
import { ChallengeService } from './challenge/challenge.service.';
import { ChallengeController } from './challenge/challenge.controller';
import { ChallengeEntity } from './challenge/entities/challenge.entity';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      options: { encrypt: false, },
    }),
    TypeOrmModule.forFeature([ChallengeEntity]), 
    TodoModule,
    UserModule,
    ChallengeModule],
  controllers: [AppController,ChallengeController],
  providers: [AppService, ChallengeService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FirstMiddleware).forRoutes({ path: 'todo', method: RequestMethod.GET }, { path: 'todo*', method: RequestMethod.DELETE })
      .apply(logger).forRoutes('')
      .apply(HelmetMiddleware).forRoutes('')

  }
}
