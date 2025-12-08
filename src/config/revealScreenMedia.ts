/**
 * Reveal Screen Media Configuration
 * 
 * Place your custom media files in the /public/media directory:
 * - Audio files: /public/media/your-song.mp3
 * - GIF file: /public/media/your-animation.gif
 * 
 * Then update the filenames below to use your custom files.
 */

export const REVEAL_SCREEN_MEDIA = {
  // Background music configuration
  audio: {
    // Array of audio filenames (must be in /public/media/)
    // One will be randomly selected each time the reveal screen loads
    // Supported formats: .mp3, .wav, .ogg
    filenames: [
      'christmas-song.mp3',
      'christmas-song-2.mp3',
      'christmas-song-3.mp3',
      'christmas-song-4.mp3'
    ],
    
    // Volume level (0.0 to 1.0)
    volume: 0.3,
    
    // Whether to loop the audio
    loop: true,
  },

  // Background GIF configuration
  background: {
    // Set the filename of your GIF file (must be in /public/media/)
    // Can also be .jpg, .png, or other image formats
    filename: 'christmas-animation.gif',
    
    // Opacity of the background (0.0 to 1.0)
    // Higher values make the background more visible
    // Lower values make text more readable
    opacity: 0.7,
  },
};
