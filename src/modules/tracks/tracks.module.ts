import { forwardRef, Module } from '@nestjs/common';
import { FavoritesModule } from '../favorites/favorites.module';
import { TrackController } from './tracks.controller';
import { TrackService } from './tracks.service';

@Module({
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
  imports: [forwardRef(() => FavoritesModule)],
})
export class TrackModule {}
