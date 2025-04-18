// searchTracks.ts
import axios from 'axios';
import { getSpotifyToken } from './getSpotifyToken';

export const searchTracks = async (query: string) => {
  const token = await getSpotifyToken();

  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
      type: 'track',
      limit: 10,
    },
  });

  return response.data.tracks.items;
};

export const search1Track = async (query: string) => {
  const token = await getSpotifyToken();

  const response = await axios.get(`https://api.spotify.com/v1/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
      type: 'track',
      limit: 1,
    },
  });

  return response.data.tracks.items;
};

