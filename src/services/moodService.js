import apiClient from './apiClient';

/**
 * Service handling all mood-related backend API interactions.
 */
export const moodService = {
  /**
   * Analyze mood based on text input.
   * @param {string} text 
   * @returns {Promise<{mood: string}>}
   */
  async analyzeMood(text) {
    return await apiClient.post('/analyze_mood', { text });
  },

  /**
   * Fetch Spotify playlist based on detected mood.
   * @param {string} mood 
   * @returns {Promise<{tracks: string[]}>}
   */
  async getPlaylist(mood) {
    return await apiClient.post('/get_playlist', { mood });
  },

  /**
   * Transcribe and analyze voice audio file to get mood & playlist.
   * @param {Blob} audioBlob 
   * @param {string} [language='en']
   * @returns {Promise<{transcription: string, mood: string}>}
   */
  async analyzeVoice(audioBlob, language = 'en') {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', language);

    return await apiClient.postFormData('/analyze-voice', formData, { timeout: 60000 });
  },
};

export default moodService;
