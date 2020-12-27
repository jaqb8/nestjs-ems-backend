import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost/ems',
      synchronize: true,
      useUnifiedTopology: true,
      entities: [],
    }),
  ],
})
export class AppModule {}
