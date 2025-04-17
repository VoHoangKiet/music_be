import User from '@/databases/entities/User';
import Song, { ISong } from '@/databases/entities/Song';
import { CreateSongDto } from './type';
import mongoose from 'mongoose';
import Album from '@/databases/entities/Album';
import MusicalArtist from '@/databases/entities/Artist';
import GenreService from '../genre/GenreService';
import { getSpotifyToken } from '@/utils/getSpotifyToken';
import axios from 'axios';

interface SpotifyTrack {
  name: string;
  duration_ms: number;
  external_urls: { spotify: string };
  album: {
    name: string;
    release_date: string;
    images: { url: string }[];
    external_urls: { spotify: string };
    artists: { name: string; external_urls: { spotify: string } }[];
  };
  artists: {
    name: string;
    external_urls: { spotify: string };
    id: string;
  }[];
  id: string;
}

class SongService {

  async updateSong(songId: string, data: CreateSongDto): Promise<ISong> {
    
    const song = await Song.findByIdAndUpdate(songId, data, { new: true });
    if (!song) {
      throw new Error('Song not found');
    }
    return song;
  }
  async deleteSong(songId: string) {
    const song = await Song.findByIdAndDelete(songId);
    if (!song) {
      throw new Error('Song not found');
    }
    return song;
  }
  async getAllSongs() {
    const songs = await Song.find().populate('genre').sort({ createdAt: -1 });
    return songs;
  }
  async toggleFavoriteSong(userId: string, songId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const song = await Song.findById(songId);
    if (!song) {
      throw new Error('Song not found');
    }

    const isFavorite = user.favoriteSongs?.some(
      (favoriteSongId) => favoriteSongId.toString() === songId
    );

    if (isFavorite) {
      user.favoriteSongs = user.favoriteSongs?.filter(
        (favoriteSongId) => favoriteSongId.toString() !== songId
      ); // unfavorite
    } else {
      user.favoriteSongs?.push(new mongoose.Types.ObjectId(songId));
    }

    await user.save();
    return user.favoriteSongs;
  }

  async importSpotifyTracks(
    tracks: SpotifyTrack[],
    adminId: mongoose.Types.ObjectId,
  ) {
    for (const track of tracks) {
      const mainArtist = track.artists[0];
      const genre = await GenreService.getOrCreateGenreFromArtist(
        mainArtist.id
      );

      let artistDoc = await MusicalArtist.findOne({ name: mainArtist.name });
      if (!artistDoc) {
        const token = await getSpotifyToken();
        const response = await axios.get(
          `https://api.spotify.com/v1/artists/${mainArtist.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        artistDoc = await MusicalArtist.create({
          name: mainArtist.name,
          avatar: response.data.images[0].url,
          genre,
          bio: `Spotify artist: ${mainArtist.external_urls.spotify}`,
        });
      }

      // 3. Tìm hoặc tạo album
      let albumDoc = await Album.findOne({
        title: track.album.name,
        artist: artistDoc._id,
      });
      if (!albumDoc) {
        albumDoc = await Album.create({
          title: track.album.name,
          artist: artistDoc._id,
          releaseDate: new Date(track.album.release_date),
          coverAt: track.album.images?.[0]?.url || '',
          songs: [],
        });
      }

      // 4. Tạo song
      const duration = `${Math.floor(track.duration_ms / 60000)}:${String(
        Math.floor((track.duration_ms % 60000) / 1000)
      ).padStart(2, '0')}`;

      const songDoc = await Song.create({
        title: track.name,
        genre,
        lyric: '123',
        playCount: 0,
        duration,
        releaseDate: new Date(track.album.release_date),
        secureUrl: track.id,
        thumbnail: track.album.images?.[0]?.url || '',
        admin: adminId,
      });

      if (!albumDoc.songs.includes(songDoc._id as mongoose.Types.ObjectId)) {
        albumDoc.songs.push(songDoc._id as mongoose.Types.ObjectId);
        await albumDoc.save();
      }
    }
    return { message: 'Import completed.' };
  }
}

export default new SongService();
