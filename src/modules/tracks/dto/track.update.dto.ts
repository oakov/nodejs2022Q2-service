import { IsNotEmpty, IsString, IsNumber } from '@nestjs/class-validator';

export class UpdateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  artistId: string | null;

  albumId: string | null;

  @IsNumber()
  duration: number;
}
