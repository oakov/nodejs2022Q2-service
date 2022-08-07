import { Module, forwardRef } from '@nestjs/common';
import { AlbumModule } from '../albums/albums.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { TrackModule } from '../tracks/tracks.module';
import { ArtistController } from './artists.controller';
import { ArtistService } from './artists.service';

@Module({
  providers: [ArtistService],
  controllers: [ArtistController],
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => FavoritesModule),
  ],
  exports: [ArtistService],
})
export class ArtistModule {}
