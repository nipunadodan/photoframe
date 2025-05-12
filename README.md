# Photo with Frame

<p align="center">
  <img src="public/logo.svg" alt="Photo with Frame Logo" width="200" />
</p>

Photo with Frame is a React-based web application for enhancing your photographs with professional-looking frames,
captions, and EXIF data display. Perfect for photographers, social media creators, and anyone looking to showcase their
images with style.

## 🎯 Features

- **Image Upload**: Drag-and-drop or file picker interface
- **Custom Framing**: Adjustable frames with background blur effects
- **EXIF Data Display**: Show camera settings, lens info, and other metadata
- **Custom Captions**: Add stylized text with multiple font options
- **Image Export**: Copy to clipboard or save to disk
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Theme toggling for different viewing preferences

## 🏗️ Architecture

The application follows a modular, service-oriented architecture for better maintainability, testability, and
scalability.

### Core Modules

#### Services

| Service           | Description                                    |
|-------------------|------------------------------------------------|
| **FontLoader**    | Manages loading and caching of custom fonts    |
| **ImageService**  | Handles image loading and EXIF extraction      |
| **ImageDrawer**   | Canvas drawing operations for rendering images |
| **ImageExporter** | Image export functions (copy, save)            |

#### Custom Hooks

| Hook                              | Purpose                                                    |
|-----------------------------------|------------------------------------------------------------|
| **useCanvas**                     | Canvas management and context operations                   |
| **useImageProcessor**             | Image handling workflow                                    |
| **useDragAndDrop**                | Drag and drop functionality                                |
| **useCalculatedCanvasDimensions** | Dynamic calculation of canvas dimensions based on settings |

#### Key Components

- **CanvasHolder**: Main component for displaying and interacting with images
- **SettingsPanel**: Controls for adjusting image properties and display options
- **SettingsActions**: Action buttons for operations like save, copy, and reset
- **ThemeToggle**: Component for switching between light and dark themes

#### Core Utilities

| Utility            | Function                                                             |
|--------------------|----------------------------------------------------------------------|
| **calcObjectFill** | Functions for calculating object dimensions (contain/cover)          |
| **drawFunctions**  | Canvas drawing primitives for image rendering                        |
| **textWidth**      | Text measurement and positioning utilities                           |
| **fractions**      | Conversion of decimal numbers to readable fractions for EXIF display |

### Design Philosophy

Photo with Frame follows several key design principles:

1. **Separation of Concerns**
    - UI components are separated from business logic
    - Image processing is handled by dedicated services
    - State management is centralized in context providers

2. **Declarative Programming**
    - Components define what should happen rather than how
    - Side effects are isolated in hooks and effect handlers
    - Pure functions are used where possible for predictability

3. **Progressive Enhancement**
    - Core functionality works with minimal dependencies
    - Advanced features gracefully degrade when not supported
    - Performance optimizations are implemented strategically

4. **Responsive and Accessible Design**
    - The interface adapts to different screen sizes
    - Keyboard navigation is supported for accessibility
    - Color contrast meets WCAG guidelines

### Data Flow
