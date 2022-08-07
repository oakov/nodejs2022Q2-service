import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { IArtist } from './artist.interface';
import { ArtistService } from './artists.service';
import { CreateArtistDto } from './dto/artist.create.dto';
import { UpdateArtistDto } from './dto/artist.update.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistsService: ArtistService) {}

  @Get()
  getAll(): Promise<IArtist[]> {
    return this.artistsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<IArtist> {
    return this.artistsService.getById(id);
  }

  @Post()
  create(@Body() createArtistDto: CreateArtistDto): Promise<IArtist> {
    return this.artistsService.create(createArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<IArtist> {
    return this.artistsService.remove(id);
  }

  @Put(':id')
  update(
    @Body() updateArtistDto: UpdateArtistDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IArtist> {
    return this.artistsService.update(id, updateArtistDto);
  }
}
