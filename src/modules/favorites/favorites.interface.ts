import { IAlbum } from '../albums/album.interface';
import { IArtist } from '../artists/artist.interface';
import { ITrack } from '../tracks/track.interface';

export interface IFavoritesRepsonse {
  artists: IArtist[];
  albums: IAlbum[];
  tracks: ITrack[];
}
