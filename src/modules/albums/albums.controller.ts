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
import { IAlbum } from './album.interface';
import { AlbumService } from './albums.service';
import { CreateAlbumDto } from './dto/album.create.dto';
import { UpdateAlbumDto } from './dto/album.update.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumsService: AlbumService) {}

  @Get()
  getAll(): Promise<IAlbum[]> {
    return this.albumsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<IAlbum> {
    return this.albumsService.getById(id);
  }

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto): Promise<IAlbum> {
    return this.albumsService.create(createAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<IAlbum> {
    return this.albumsService.remove(id);
  }

  @Put(':id')
  update(
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IAlbum> {
    return this.albumsService.update(id, updateAlbumDto);
  }
}
