// getSpotifyToken.ts
import axios from 'axios';

export const getSpotifyToken = async () => {
  const clientId = 'c25bb090f8394c77ba84143417f80701';
  const clientSecret = '6a576bcb36594653aec76e51a0d439c6';

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
    }
  );

  return response.data.access_token;
};