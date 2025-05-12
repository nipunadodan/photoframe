/**
 * Converts a canvas to a blob
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {string} [type='image/jpeg'] - The image type
 * @param {number} [quality=0.95] - The image quality
 * @returns {Promise<Blob>} - The image blob
 */
export const canvasToBlob = (canvas, type = 'image/jpeg', quality = 0.95) => {
    return new Promise((resolve) => {
        canvas.toBlob(blob => resolve(blob), type, quality);
    });
};

/**
 * Copies the canvas image to the clipboard
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const copyToClipboard = async (canvas) => {
    try {
        const blob = await canvasToBlob(canvas);
        await navigator.clipboard.write([
            new ClipboardItem({'image/png': blob}),
        ]);
        return true;
    } catch (error) {
        console.error('Failed to copy image to clipboard:', error);
        throw error;
    }
};

/**
 * Saves the canvas image as a file
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {string} [caption='photo-with-frame'] - The caption to use as filename
 */
export const saveToFile = (canvas, caption = 'photo-with-frame') => {
    try {
        const filename = caption
            ? caption.toLowerCase().replace(/\s+/g, '-') + '.jpg'
            : 'photo-with-frame.jpg';

        canvasToBlob(canvas).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();

            // Clean up
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        });
    } catch (error) {
        console.error('Failed to save image:', error);
    }
};
