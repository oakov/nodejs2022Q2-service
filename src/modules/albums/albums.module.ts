import { Module, forwardRef } from '@nestjs/common';
import { FavoritesModule } from '../favorites/favorites.module';
import { TrackModule } from '../tracks/tracks.module';
import { AlbumController } from './albums.controller';
import { AlbumService } from './albums.service';

@Module({
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [AlbumService],
  imports: [forwardRef(() => TrackModule), forwardRef(() => FavoritesModule)],
})
export class AlbumModule {}
