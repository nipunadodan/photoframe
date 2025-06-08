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

## 🔧 Technical Implementation

### Image Processing Workflow

1. User uploads an image via drag-and-drop or file picker
2. Image is loaded and EXIF data is extracted
3. Canvas is initialized with appropriate dimensions
4. Background is drawn with blur effect
5. Overlay is applied for contrast
6. Foreground image is drawn with border radius
7. EXIF data and captions are rendered
8. User can adjust settings and see real-time updates
9. Final image can be exported via clipboard or saved as a file

### Performance Optimizations

- **Canvas Redraw Optimization**: Canvas is only redrawn when necessary
- **Font Caching**: Fonts are loaded once and cached for reuse
- **Memoization**: React's useMemo and useCallback are used to prevent unnecessary re-renders
- **Lazy Loading**: Components and resources are loaded only when needed

## 🔒 Security

The application implements several security best practices:

- **Content Security Policy**: Restricts the sources from which content can be loaded
- **Secure Font Loading**: Fonts are loaded from trusted sources
- **Local Processing**: All image processing happens locally in the browser, no data is sent to servers

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/photo-with-frame.git

# Navigate to the project directory
cd photo-with-frame

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

## 📚 Documentation

For more detailed documentation, please refer to the following resources in the `docs` folder:

- [Architecture Documentation](./docs/ARCHITECTURE.md): Detailed overview of the application architecture, design decisions, and technical implementation.
- [Changelog](./docs/CHANGELOG.md): Comprehensive documentation of all changes made in the recent development branch.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
