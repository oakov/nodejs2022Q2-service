import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { TrackService } from '../tracks/tracks.service';
import { IAlbum } from './album.interface';
import { CreateAlbumDto } from './dto/album.create.dto';
import { UpdateAlbumDto } from './dto/album.update.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly tracksService: TrackService, // favorites
  ) {}

  private albums: IAlbum[] = [];

  async getAll(): Promise<IAlbum[]> {
    return this.albums;
  }

  async getById(id: string): Promise<IAlbum> {
    const album = this.albums.find((album) => id === album.id);
    if (!album) throw new NotFoundException();
    return album;
  }

  async create(albumDto: CreateAlbumDto): Promise<IAlbum> {
    const newAlbum = {
      id: uuidv4(),
      ...albumDto,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  async remove(id: string): Promise<IAlbum> {
    const albumIndex = this.albums.findIndex((album) => id === album.id);
    if (albumIndex != -1) {
      this.albums.splice(albumIndex, 1);
      await this.tracksService.removeAlbums(id);
      //favorites
      return;
    }
    throw new NotFoundException();
  }

  async update(id: string, albumDto: UpdateAlbumDto): Promise<IAlbum> {
    const albumIndex = this.albums.findIndex((album) => id === album.id);
    if (albumIndex != -1) {
      this.albums[albumIndex] = {
        ...this.albums[albumIndex],
        ...albumDto,
      };
      return this.albums[albumIndex];
    }
    throw new NotFoundException();
  }

  async removeArtist(id: string): Promise<void> {
    this.albums = this.albums.map((album) =>
      album.artistId === id ? { ...album, artistId: null } : album,
    );
    return;
  }
}
