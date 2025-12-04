# Media Assets for Reveal Screen

This directory contains the media files used in the Secret Santa reveal screen.

## How to Add Your Own Files

### 1. Add Your Audio File
- Place your Christmas song or background music in this directory
- Supported formats: `.mp3`, `.wav`, `.ogg`
- Recommended: Use MP3 format for best browser compatibility
- Example: `christmas-song.mp3`

### 2. Add Your GIF/Image File
- Place your festive animation or background image in this directory
- Supported formats: `.gif`, `.jpg`, `.png`, `.webp`
- Recommended: Use GIF for animations or JPG/PNG for static images
- Example: `christmas-animation.gif`

### 3. Update the Configuration
- Open `src/config/revealScreenMedia.ts`
- Update the `filename` values to match your file names:
  ```typescript
  audio: {
    filename: 'your-song-name.mp3',  // Change this
    volume: 0.3,
    loop: true,
  },
  background: {
    filename: 'your-animation.gif',  // Change this
    opacity: 0.3,
  }
  ```

### 4. Optional: Adjust Settings
You can also customize:
- **Volume**: Adjust `audio.volume` (0.0 = silent, 1.0 = full volume)
- **Loop**: Set `audio.loop` to `false` if you don't want the music to repeat
- **Opacity**: Adjust `background.opacity` (0.0 = invisible, 1.0 = fully visible)

## Tips

- **Audio File Size**: Keep audio files under 5MB for faster loading
- **GIF File Size**: Keep GIF files under 2MB for better performance
- **Testing**: After adding files, refresh your browser to see the changes
- **Fallback**: If files don't load, the app will use default colors/silence

## Example Files

You can download free Christmas music and GIFs from:
- Music: [Free Music Archive](https://freemusicarchive.org/)
- GIFs: [Giphy](https://giphy.com/), [Tenor](https://tenor.com/)

Make sure to use royalty-free content!
