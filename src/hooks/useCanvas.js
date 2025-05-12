import {useRef, useCallback} from 'react';
import {loadFont} from '../services/FontLoader';

/**
 * Custom hook for canvas operations
 * @param {Object} options - Options for canvas operations
 * @returns {Object} - Canvas operations and references
 */
export const useCanvas = () => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const imageRef = useRef(null);

    /**
     * Gets the canvas rendering context
     * @returns {CanvasRenderingContext2D|null} - The canvas context
     */
    const getContext = useCallback(() => {
        if (!canvasRef.current) return null;

        const ctx = ctxRef.current || canvasRef.current.getContext('2d');
        ctxRef.current = ctx;
        return ctx;
    }, []);

    /**
     * Initializes the canvas with text
     * @param {string} text - The text to display
     * @param {number} width - The canvas width
     * @param {number} height - The canvas height
     */
    const initializeCanvas = useCallback(async (text, width, height) => {
        const ctx = getContext();
        if (!ctx) return;

        // Load the Inter font
        await loadFont('Inter');

        // Set canvas dimensions
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        // Draw the text
        ctx.save();
        ctx.font = '15px Inter';
        const approxFontHeight = parseInt(ctx.font);
        ctx.fillStyle = '#afafaf';
        ctx.textAlign = 'center';
        ctx.fillText(
            text,
            width / 2,
            (height / 2) + approxFontHeight / 2,
        );
        ctx.restore();
    }, [getContext]);

    /**
     * Clears the canvas
     */
    const clearCanvas = useCallback(() => {
        const ctx = getContext();
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }, [getContext]);

    /**
     * Sets the current image
     * @param {Image} img - The image to set
     */
    const setImage = useCallback((img) => {
        imageRef.current = img;
    }, []);

    /**
     * Gets the current image
     * @returns {Image|null} - The current image
     */
    const getImage = useCallback(() => {
        return imageRef.current;
    }, []);

    return {
        canvasRef,
        ctxRef,
        getContext,
        initializeCanvas,
        clearCanvas,
        setImage,
        getImage,
    };
};
