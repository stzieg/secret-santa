# Custom Media Setup Guide

This guide shows you how to add your own Christmas music and animated background to the Secret Santa reveal screen.

## Quick Start

### 1. File Structure

```
secret-santa/
├── public/
│   └── media/                          ← Put your files here!
│       ├── christmas-song.mp3          ← Your audio file
│       ├── christmas-animation.gif     ← Your GIF/image file
│       └── README.md                   ← Detailed instructions
└── src/
    └── config/
        └── revealScreenMedia.ts        ← Configure filenames here
```

### 2. Add Your Files

Drop your files into `public/media/`:

**Audio File:**
- Supported formats: `.mp3`, `.wav`, `.ogg`
- Recommended: MP3 for best compatibility
- Keep under 5MB for faster loading

**Background File:**
- Supported formats: `.gif`, `.jpg`, `.png`, `.webp`
- Recommended: GIF for animations
- Keep under 2MB for better performance

### 3. Update Configuration

Open `src/config/revealScreenMedia.ts` and update the filenames:

```typescript
export const REVEAL_SCREEN_MEDIA = {
  audio: {
    filename: 'christmas-song.mp3',     // ← Change to your audio filename
    volume: 0.3,                         // ← Adjust volume (0.0 - 1.0)
    loop: true,                          // ← Loop the music?
  },
  background: {
    filename: 'christmas-animation.gif', // ← Change to your image filename
    opacity: 0.3,                        // ← Adjust opacity (0.0 - 1.0)
  },
};
```

### 4. Test It Out

1. Save your changes
2. Refresh your browser
3. Generate assignments to see the reveal screen with your custom media!

## Configuration Options

### Audio Settings

- **filename**: Name of your audio file in `public/media/`
- **volume**: Volume level from 0.0 (silent) to 1.0 (full volume)
- **loop**: `true` to repeat the song, `false` to play once

### Background Settings

- **filename**: Name of your image/GIF file in `public/media/`
- **opacity**: Transparency from 0.0 (invisible) to 1.0 (fully visible)
  - Lower values (0.2-0.4) make text more readable
  - Higher values (0.5-0.8) make the background more prominent

## Tips

- **Audio doesn't play?** Some browsers block autoplay. Click anywhere on the page to start the audio.
- **Background not showing?** Check that the filename matches exactly (including file extension).
- **Text hard to read?** Lower the background opacity in the config.
- **Music too loud/quiet?** Adjust the volume setting in the config.

## Finding Free Media

### Royalty-Free Music
- [Free Music Archive](https://freemusicarchive.org/)
- [Incompetech](https://incompetech.com/music/royalty-free/)
- [YouTube Audio Library](https://www.youtube.com/audiolibrary)

### Free GIFs & Animations
- [Giphy](https://giphy.com/) - Search "christmas" or "snow"
- [Tenor](https://tenor.com/) - Animated GIFs
- [Pixabay](https://pixabay.com/) - Free images and videos

**Important:** Always use royalty-free content or content you have permission to use!

## Troubleshooting

### Audio Not Playing
- Check browser console for errors
- Verify the file is in `public/media/`
- Try clicking on the page (browsers may block autoplay)
- Check file format is supported (.mp3, .wav, .ogg)

### Background Not Showing
- Verify filename matches exactly in config
- Check file is in `public/media/`
- Try a different image format
- Check browser console for 404 errors

### Performance Issues
- Reduce file sizes (compress audio/images)
- Use MP3 for audio (smaller than WAV)
- Optimize GIFs (use tools like ezgif.com)

## Example Configuration

Here's a complete example with custom settings:

```typescript
export const REVEAL_SCREEN_MEDIA = {
  audio: {
    filename: 'jingle-bells.mp3',
    volume: 0.25,        // Quieter background music
    loop: true,
  },
  background: {
    filename: 'snowfall.gif',
    opacity: 0.4,        // More visible background
  },
};
```

Enjoy your festive Secret Santa reveal! 🎄🎅
