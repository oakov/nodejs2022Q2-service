import { Module } from '@nestjs/common';
import { TrackController } from './tracks.controller';
import { TrackService } from './tracks.service';

@Module({
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
  imports: [], //favorites
})
export class TrackModule {}
