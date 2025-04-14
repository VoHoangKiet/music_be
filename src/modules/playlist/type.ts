export interface PlaylistCreateDto {
    name: string;
    description: string;
    songs?: string[];
    userId: string;
  }