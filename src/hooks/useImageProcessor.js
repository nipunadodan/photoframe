import {useCallback} from 'react';
import {loadImage, processExif} from '../services/ImageService';
import {createImageDrawer} from '../services/ImageDrawer';

/**
 * Custom hook for image processing operations
 * @param {Object} options - Options for image processing
 * @returns {Object} - Image processing operations
 */
export const useImageProcessor = ({getContext, setImage, settings, setSettings}) => {
    /**
     * Processes an image file and updates state
     * @param {File} file - The image file to process
     */
    const processImage = useCallback(async (file) => {
        if (!file) return;

        try {
            // Load the image
            const img = await loadImage(file);
            setImage(img);

            // Extract EXIF data
            const exifData = await processExif(file);

            // Update settings with EXIF data
            setSettings(prev => ({
                ...prev,
                ...exifData,
            }));

            // Draw the image on the canvas
            const ctx = getContext();
            if (ctx) {
                const drawer = createImageDrawer(ctx, settings);
                drawer.draw(img);
            }

            return true;
        } catch (error) {
            console.error('Failed to process image:', error);
            return false;
        }
    }, [getContext, setImage, setSettings, settings]);

    /**
     * Redraws the current image with updated settings
     * @param {Image} [img] - Optional image to draw (uses stored image if not provided)
     */
    const redrawImage = useCallback((img) => {
        const ctx = getContext();
        if (!ctx) return;

        const imageToUse = img || setImage(null);
        if (!imageToUse) return;

        const drawer = createImageDrawer(ctx, settings);
        drawer.draw(imageToUse);
    }, [getContext, settings, setImage]);

    return {
        processImage,
        redrawImage,
    };
};
