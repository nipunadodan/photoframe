import {dimsContain, dimsCover} from '../utils/calcObjectFill.js';
import {drawImageContain, drawImageCover} from '../utils/drawFunctions.js';
import {calcTextDims} from '../utils/textWidth.js';

/**
 * Creates an image drawer with the specified context and settings
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {Object} settings - The drawing settings
 * @returns {Object} - The image drawer object with drawing methods
 */
export const createImageDrawer = (ctx, settings) => {
    /**
     * Draws the background image with blur effect
     * @param {Image} img - The image to draw
     */
    const drawBackground = (img) => {
        ctx.save();
        ctx.filter = `blur(${settings.background_blur}px)`;

        drawImageCover(
            ctx,
            img,
            0, 0,
            ctx.canvas.width,
            ctx.canvas.height,
            settings,
            1.3,
        );
    };

    /**
     * Draws the semi-transparent overlay on top of the background
     */
    const drawOverlay = () => {
        ctx.restore();
        ctx.beginPath();
        ctx.fillStyle = settings.background === 'dark' ? '#000000' : '#ffffff';
        ctx.filter = `opacity(${settings.background_overlay_opacity})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Reset filters
        ctx.restore();
        ctx.filter = 'none';
    };

    /**
     * Draws the foreground image with proper sizing and border radius
     * @param {Image} img - The image to draw
     */
    const drawForeground = (img) => {
        ctx.save();

        const {drawWidth, drawHeight, offsetX, offsetY} = dimsContain(
            img,
            0, 0,
            ctx.canvas.width,
            ctx.canvas.height,
            settings.foreground_image_scale,
        );

        // Apply rotation if needed
        if (settings.image_rotation > 0 && settings.image_rotation < 360) {
            const centerX = offsetX + drawWidth / 2;
            const centerY = offsetY + drawHeight / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(settings.image_rotation * Math.PI / 180);
            ctx.translate(-centerX, -centerY);
        }

        // Create rounded rectangle mask
        ctx.beginPath();
        ctx.roundRect(offsetX, offsetY, drawWidth, drawHeight, settings.border_radius);
        ctx.closePath();
        ctx.clip();

        // Draw the foreground image
        drawImageContain(
            ctx,
            img,
            0, 0,
            ctx.canvas.width,
            ctx.canvas.height,
            settings.foreground_image_scale,
        );

        ctx.restore();
    };

    /**
     * Draws EXIF data and captions
     * @param {Object} textDims - The text dimensions and position
     * @param {number} foreImgWidth - The width of the foreground image
     * @param {number} foreImgHeight - The height of the foreground image
     */
    const drawExifData = (textDims, foreImgWidth, foreImgHeight) => {
        const {offsetX, offsetY, font} = textDims;

        ctx.font = font.fontSize + 'px Inter';
        ctx.fillStyle = '#fff';

        // Apply rotation if needed
        if (settings.image_rotation > 0 && settings.image_rotation < 360) {
            const centerX = offsetX + foreImgWidth / 2;
            const centerY = offsetY + foreImgHeight / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(settings.image_rotation * Math.PI / 180);
            ctx.translate(-centerX, -centerY);
        }

        // Draw EXIF data
        if (settings.exif_enabled && settings.exif) {
            ctx.textAlign = 'left';
            ctx.fillText(settings.exif, offsetX + foreImgWidth * .01, offsetY);

            // Draw camera make
            if (settings.camera_make_enabled && settings.camera_make) {
                ctx.fillText(
                    settings.camera_make,
                    offsetX + foreImgWidth * .01,
                    offsetY + font.lineHeight,
                );
            }

            // Draw lens info
            if (settings.lens_info_enabled && settings.lens_info) {
                const yPos = offsetY + (
                    settings.camera_make_enabled && settings.camera_make
                        ? font.lineHeight * 2
                        : font.lineHeight
                );
                ctx.fillText(settings.lens_info, offsetX + foreImgWidth * .01, yPos);
            }
        }

        // Draw caption
        if (settings.caption_enabled && settings.caption) {
            const fontFamily = settings.caption_fonts[settings.caption_font].font;

            ctx.letterSpacing = settings.caption_letter_spacing ? font.letterSpacing + 'px' : 'normal';
            ctx.font = 'bold ' + font.fontSize + 'px ' + fontFamily;
            ctx.textAlign = 'right';
            ctx.fillText(settings.caption, offsetX + foreImgWidth, offsetY);
        }
    };

    /**
     * Draws text elements (EXIF data, camera info, captions)
     * @param {Image} img - The image used to calculate dimensions
     */
    const drawText = (img) => {
        const foreImgDims = dimsContain(
            img,
            0, 0,
            ctx.canvas.width,
            ctx.canvas.height,
            settings.foreground_image_scale,
        );

        const textDims = calcTextDims(
            foreImgDims,
            settings.longest_edge,
            settings.image_rotation,
        );

        drawExifData(textDims, foreImgDims.drawWidth, foreImgDims.drawHeight);
    };

    /**
     * Draws the complete image with background, foreground, and text
     * @param {Image} img - The image to draw
     */
    const draw = (img) => {
        const canvas = ctx.canvas;
        canvas.width = settings.width;
        canvas.height = settings.height;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the components in order
        drawBackground(img);
        drawOverlay();
        drawForeground(img);
        drawText(img);
    };

    return {
        draw,
        drawBackground,
        drawOverlay,
        drawForeground,
        drawText,
        drawExifData,
    };
};
