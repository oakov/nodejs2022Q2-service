import {
  Injectable,
  Inject,
  forwardRef,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IAlbum } from '../albums/album.interface';
import { AlbumService } from '../albums/albums.service';
import { IArtist } from '../artists/artist.interface';
import { ArtistService } from '../artists/artists.service';
import { ITrack } from '../tracks/track.interface';
import { TrackService } from '../tracks/tracks.service';
import { IFavoritesRepsonse } from './favorites.interface';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly tracksService: TrackService,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumsService: AlbumService,

    @Inject(forwardRef(() => ArtistService))
    private readonly artistsService: ArtistService,
  ) {}

  private favorites = { tracks: [], albums: [], artists: [] };

  async getAll(): Promise<IFavoritesRepsonse> {
    const tracks: ITrack[] = await Promise.allSettled(
      this.favorites.tracks.map((trackId) =>
        this.tracksService.getById(trackId),
      ),
    ).then((res) =>
      res.map((item) => (item as unknown as PromiseFulfilledResult<any>).value),
    );
    const albums: IAlbum[] = await Promise.allSettled(
      this.favorites.albums.map((albumId) =>
        this.albumsService.getById(albumId),
      ),
    ).then((res) =>
      res.map((item) => (item as unknown as PromiseFulfilledResult<any>).value),
    );
    const artists: IArtist[] = await Promise.allSettled(
      this.favorites.artists.map((artistId) =>
        this.artistsService.getById(artistId),
      ),
    ).then((res) =>
      res.map((item) => (item as unknown as PromiseFulfilledResult<any>).value),
    );
    return { artists, albums, tracks };
  }

  async addTrack(id: string): Promise<void> {
    try {
      await this.tracksService.getById(id);
    } catch {
      throw new UnprocessableEntityException();
    }
    this.favorites.tracks.push(id);
    return;
  }

  async removeTrack(id: string): Promise<void> {
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
    return;
  }

  async addAlbum(id: string): Promise<void> {
    try {
      await this.albumsService.getById(id);
    } catch {
      throw new UnprocessableEntityException();
    }
    this.favorites.albums.push(id);
    return;
  }

  async removeAlbum(id: string): Promise<void> {
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
    return;
  }

  async addArtist(id: string): Promise<void> {
    try {
      await this.artistsService.getById(id);
    } catch {
      throw new UnprocessableEntityException();
    }
    this.favorites.artists.push(id);
    return;
  }

  async removeArtist(id: string): Promise<void> {
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    return;
  }
}
