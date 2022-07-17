import { Module, forwardRef } from '@nestjs/common';
import { TrackModule } from '../tracks/tracks.module';
import { AlbumController } from './albums.controller';
import { AlbumService } from './albums.service';

@Module({
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [AlbumService],
  imports: [forwardRef(() => TrackModule)], //favorite
})
export class AlbumsModule {}
