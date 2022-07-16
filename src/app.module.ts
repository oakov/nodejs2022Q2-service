import { Module } from '@nestjs/common';
import { TrackModule } from './modules/tracks/tracks.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [UserModule, TrackModule],
})
export class AppModule {}
