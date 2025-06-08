# Photo with Frame - Architecture Documentation

## Overview

This document provides a detailed overview of the architecture of the Photo with Frame application. It explains the design decisions, component structure, data flow, and technical implementation details.

## System Architecture

Photo with Frame follows a modular, service-oriented architecture that separates concerns and promotes reusability. The application is built using React and follows modern front-end development practices.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Components                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ CanvasHolder│  │SettingsPanel│  │Other UI Components  │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼───────────────┼─────────────────────┼─────────────┘
          │               │                     │
          ▼               ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                        Custom Hooks                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  useCanvas  │  │useImageProc.│  │  useDragAndDrop     │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼───────────────┼─────────────────────┼─────────────┘
          │               │                     │
          ▼               ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                         Services                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────┐ │
│  │ImageExporter│  │ ImageDrawer │  │ImageService │  │Font │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Layer

The component layer contains React components that make up the user interface. Key components include:

- **CanvasHolder**: The main component that displays the canvas and handles user interactions with the image.
- **SettingsPanel**: Contains controls for adjusting image properties, frame settings, and display options.
- **ThemeToggle**: Allows users to switch between light and dark themes.

### Custom Hooks Layer

Custom hooks encapsulate complex logic and state management, making components cleaner and more focused on rendering:

- **useCanvas**: Manages canvas operations, context, and image references.
- **useImageProcessor**: Handles image loading, processing, and EXIF data extraction.
- **useDragAndDrop**: Provides drag and drop functionality for image uploads.

### Services Layer

Services handle specific functionality domains and are designed to be reusable across the application:

- **ImageExporter**: Handles exporting images (copy to clipboard, save to file).
- **ImageDrawer**: Manages drawing operations on the canvas.
- **ImageService**: Handles image loading and EXIF data extraction.
- **FontLoader**: Manages loading and caching of custom fonts.

## Data Flow

The application follows a unidirectional data flow pattern:

1. User interactions trigger events in components
2. Components call hook methods to handle these events
3. Hooks use services to perform operations
4. Services return results to hooks
5. Hooks update state
6. Components re-render based on the new state

### State Management

State is managed at different levels:

- **Local Component State**: For UI-specific state that doesn't affect other components
- **Custom Hook State**: For domain-specific state that might be shared across multiple components
- **Context API**: For global state that needs to be accessed throughout the application

## Key Technical Implementations

### Canvas Rendering

The canvas rendering process follows these steps:

1. **Initialization**: Canvas is initialized with appropriate dimensions
2. **Background Drawing**: Background image is drawn with blur effect
3. **Overlay Application**: Semi-transparent overlay is applied for contrast
4. **Foreground Drawing**: Main image is drawn with border radius
5. **Text Rendering**: EXIF data and captions are rendered

### Image Processing

Image processing follows this workflow:

1. User uploads an image via drag-and-drop or file picker
2. Image is loaded using the ImageService
3. EXIF data is extracted and formatted
4. Canvas is prepared for drawing
5. ImageDrawer service renders the image with current settings
6. User can adjust settings and see real-time updates
7. Final image can be exported using the ImageExporter service

### Font Management

Custom fonts are loaded dynamically using the FontLoader service:

1. Font is requested by component or hook
2. FontLoader checks if font is already loaded
3. If not, font is loaded from URL
4. Font is added to document.fonts
5. Components can use the font for rendering

## Performance Considerations

Several performance optimizations are implemented:

- **Canvas Redraw Optimization**: Canvas is only redrawn when necessary
- **Font Caching**: Fonts are loaded once and cached for reuse
- **Memoization**: React's useMemo and useCallback are used to prevent unnecessary re-renders
- **Lazy Loading**: Components and resources are loaded only when needed

## Security Considerations

The application implements several security best practices:

- **Content Security Policy**: Restricts the sources from which content can be loaded
- **Secure Font Loading**: Fonts are loaded from trusted sources
- **Local Processing**: All image processing happens locally in the browser, no data is sent to servers

## Future Architecture Considerations

As the application evolves, several architectural improvements could be considered:

- **State Management Library**: For more complex state management needs
- **Web Workers**: For offloading heavy image processing tasks
- **Service Worker**: For offline capabilities and caching
- **Micro-Frontend Architecture**: For better scalability as features grow

## Conclusion

The Photo with Frame application follows a well-structured architecture that separates concerns, promotes reusability, and provides a solid foundation for future enhancements. The modular design allows for easy maintenance and extension of functionality.