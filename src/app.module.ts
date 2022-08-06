import { Module } from '@nestjs/common';
import { AlbumModule } from './modules/albums/albums.module';
import { ArtistModule } from './modules/artists/artists.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { LoggerModule } from './modules/logger/logger.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { TrackModule } from './modules/tracks/tracks.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    UserModule,
    TrackModule,
    AlbumModule,
    ArtistModule,
    FavoritesModule,
    PrismaModule,
    LoggerModule,
  ],
})
export class AppModule {}
