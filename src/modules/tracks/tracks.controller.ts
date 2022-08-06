import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/track.create.dto';
import { UpdateTrackDto } from './dto/track.update.dto';
import { ITrack } from './track.interface';
import { TrackService } from './tracks.service';

@Controller('track')
export class TrackController {
  constructor(private readonly tracksService: TrackService) {}

  @Get()
  getAll(): Promise<ITrack[]> {
    return this.tracksService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<ITrack> {
    return this.tracksService.getById(id);
  }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto): Promise<ITrack> {
    return this.tracksService.create(createTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<ITrack> {
    return this.tracksService.remove(id);
  }

  @Put(':id')
  update(
    @Body() updateTrackDto: UpdateTrackDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ITrack> {
    return this.tracksService.update(id, updateTrackDto);
  }
}
