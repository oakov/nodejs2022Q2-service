import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AlbumModule } from './modules/albums/albums.module';
import { ArtistModule } from './modules/artists/artists.module';
import { AuthModule } from './modules/auth/auth.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { LoggerMiddleware } from './modules/logger/logger.middleware';
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
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
