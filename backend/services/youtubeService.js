 import { google } from 'googleapis';
import 'dotenv/config';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function findBestYouTubeVideos(query, maxResults = 2) {
  try {
    const response = await youtube.search.list({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults,
      order: 'relevance',
      videoDefinition: 'high',
      videoCategoryId: '27', // YouTube's Category ID for "Education"
    });

    if (response.data.items) {
      return response.data.items.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching from YouTube API:', error.message);
    return [];
  }
}