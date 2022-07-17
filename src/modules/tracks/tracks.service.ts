import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/track.create.dto';
import { UpdateTrackDto } from './dto/track.update.dto';
import { ITrack } from './track.interface';
import { v4 as uuidv4 } from 'uuid';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  private tracks: ITrack[] = [];

  async getAll(): Promise<ITrack[]> {
    return this.tracks;
  }

  async getById(id: string): Promise<ITrack> {
    const track = this.tracks.find((track) => id === track.id);
    if (track) return track;
    throw new NotFoundException();
  }

  async create(trackDto: CreateTrackDto): Promise<ITrack> {
    const newTrack = {
      id: uuidv4(),
      ...trackDto,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  async remove(id: string): Promise<ITrack> {
    const trackIndex = this.tracks.findIndex((track) => id === track.id);
    if (trackIndex != -1) {
      this.tracks.splice(trackIndex, 1);
      await this.favoritesService.removeTrack(id);
      return;
    }
    throw new NotFoundException();
  }

  async update(id: string, trackDto: UpdateTrackDto): Promise<ITrack> {
    const trackIndex = this.tracks.findIndex((track) => id === track.id);
    if (trackIndex != -1) {
      this.tracks[trackIndex] = {
        ...this.tracks[trackIndex],
        ...trackDto,
      };
      return this.tracks[trackIndex];
    }
    throw new NotFoundException();
  }

  async removeArtist(id: string): Promise<void> {
    this.tracks = this.tracks.map((track) =>
      track.artistId === id ? { ...track, artistId: null } : track,
    );
    return;
  }

  async removeAlbum(id: string): Promise<void> {
    this.tracks = this.tracks.map((track) =>
      track.albumId === id ? { ...track, albumId: null } : track,
    );
    return;
  }
}
