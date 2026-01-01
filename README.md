# Web Music Player

A modern, web-based music player built with React, TypeScript, and Vite. This application allows users to upload, organize, and play their music files directly in the browser with a clean, intuitive interface.

## Features

- **File Upload**: Drag and drop music files or use the upload button to add tracks to your library
- **Audio Playback**: Play, pause, skip forward/backward, and control volume
- **Queue Management**: Add tracks to a queue, reorder, and manage playback order
- **Keyboard Controls**: Use keyboard shortcuts for common actions (play/pause, skip, volume)
- **Persistent State**: Your player settings, queue, and library are saved across sessions
- **Media Session Integration**: Control playback through browser media keys and notifications
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Library Organization**: Browse and manage your uploaded tracks

## Technologies Used

- **React**: UI framework for building the user interface
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Fast build tool and development server
- **Zustand**: State management for React
- **Tailwind CSS**: Utility-first CSS framework (if applicable, based on styles)
- **ESLint**: Code linting and formatting

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RJPalmer/web-music-player.git
   cd web-music-player
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload Music**: Click the upload button or drag and drop audio files (MP3, WAV, etc.) into the drop zone
2. **Play Tracks**: Click on any track in your library to start playing
3. **Control Playback**: Use the now playing controls to play/pause, skip, and adjust volume
4. **Manage Queue**: Add tracks to the queue and reorder them as needed
5. **Keyboard Shortcuts**:
   - Space: Play/Pause
   - Arrow Left/Right: Previous/Next track
   - Arrow Up/Down: Volume up/down

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DropZone.tsx    # File upload area
│   ├── NowPlaying.tsx  # Current track display and controls
│   └── QueueList.tsx   # Queue management interface
├── features/           # Feature-specific modules
│   └── uploads/        # File upload functionality
├── hooks/              # Custom React hooks
├── persistence/        # Data persistence utilities
├── services/           # External service integrations
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
