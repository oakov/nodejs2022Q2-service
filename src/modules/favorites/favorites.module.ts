import { Module, forwardRef } from '@nestjs/common';
import { AlbumModule } from '../albums/albums.module';
import { ArtistModule } from '../artists/artists.module';
import { TrackModule } from '../tracks/tracks.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  providers: [FavoritesService],
  controllers: [FavoritesController],
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
