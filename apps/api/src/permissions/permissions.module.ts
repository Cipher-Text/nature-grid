import { Global, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';

/**
 * @Global() makes PermissionsService available everywhere without needing an
 * explicit import in each module. AuthModule uses it for getProfile(); the
 * PermissionsGuard receives it via app.get() in main.ts.
 */
@Global()
@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
