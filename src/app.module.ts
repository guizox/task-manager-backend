import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { typeORMConfig } from "./config/typeorm.config"
import { TasksModule } from "./tasks/tasks.module"
import { AuthModule } from "./auth/auth.module"

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), TasksModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
