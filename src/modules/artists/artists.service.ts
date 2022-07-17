import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { AlbumService } from '../albums/albums.service';
import { FavoritesService } from '../favorites/favorites.service';
import { TrackService } from '../tracks/tracks.service';
import { IArtist } from './artist.interface';
import { CreateArtistDto } from './dto/artist.create.dto';
import { UpdateArtistDto } from './dto/artist.update.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly tracksService: TrackService,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumsService: AlbumService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  private artists: IArtist[] = [];

  async getAll(): Promise<IArtist[]> {
    return this.artists;
  }

  async getById(id: string): Promise<IArtist> {
    const artist = this.artists.find((artist) => id === artist.id);
    if (artist) throw new NotFoundException();
    return artist;
  }

  async create(artistDto: CreateArtistDto): Promise<IArtist> {
    const newArtist = {
      id: uuidv4(),
      ...artistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  async remove(id: string): Promise<IArtist> {
    const artistIndex = this.artists.findIndex((artist) => id === artist.id);
    if (artistIndex != -1) {
      this.artists.splice(artistIndex, 1);
      await this.tracksService.removeArtist(id);
      await this.albumsService.removeArtist(id);
      await this.favoritesService.removeArtist(id);
      return;
    }
    throw new NotFoundException();
  }

  async update(id: string, artistDto: UpdateArtistDto): Promise<IArtist> {
    const artistIndex = this.artists.findIndex((artist) => id === artist.id);
    if (artistIndex != -1) {
      this.artists[artistIndex] = {
        ...this.artists[artistIndex],
        ...artistDto,
      };
      return this.artists[artistIndex];
    }
    throw new NotFoundException();
  }
}
