import { Module } from '@nestjs/common';
import { AlbumsModule } from './modules/albums/albums.module';
import { TrackModule } from './modules/tracks/tracks.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [UserModule, TrackModule, AlbumsModule],
})
export class AppModule {}
