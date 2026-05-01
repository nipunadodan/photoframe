import {forwardRef, useContext, useEffect, useImperativeHandle, useState, useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import {SettingsContext} from '../../../context/SettingsContext.jsx';
import {useCanvas} from '../../../hooks/useCanvas.js';
import {useImageProcessor} from '../../../hooks/useImageProcessor.js';
import {useDragAndDrop} from '../../../hooks/useDragAndDrop.js';
import {copyToClipboard, saveToFile} from '../../../services/ImageExporter.js';
import {loadFont} from '../../../services/FontLoader.js';

// eslint-disable-next-line react/display-name
export const CanvasHolder = forwardRef(({className}, ref) => {
    const [isImgUploaded, setIsImgUploaded] = useState(false);
    const [wHeight, setWHeight] = useState(window.innerHeight);
    const {settings, setSettings} = useContext(SettingsContext);


    // Use our custom hooks
    const {
        canvasRef,
        getContext,
        initializeCanvas,
        clearCanvas,
        setImage,
        getImage,
    } = useCanvas();

    const {processImage, redrawImage} = useImageProcessor({
        canvasRef,
        getContext,
        setImage,
        settings,
        setSettings,
    });

    const {isDragging, dragProps} = useDragAndDrop({
        onDrop: (file) => {
            handleImageFile(file);
        },
    });

    // Initialize canvas with prompt text
    useEffect(() => {
        const initialHeight = 840;
        const initialWidth = settings.width * initialHeight / settings.height;
        initializeCanvas('Click to pick an image', initialWidth, initialHeight);

        const handleResize = () => setWHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Redraw when settings change
    useEffect(() => {
        if (isImgUploaded) {
            redrawImage(getImage());
        }
    }, [settings, redrawImage, getImage, isImgUploaded]);

    // Load font when caption font changes
    useEffect(() => {
        if (settings.caption_fonts && settings.caption_fonts[settings.caption_font]) {
            const font = settings.caption_fonts[settings.caption_font];
            loadFont(font.font_family, font.font_url);
        }
    }, [settings.caption_font]);

    // Handle image file upload or drop
    const handleImageFile = useCallback(async (file) => {
        if (!file) return;

        const success = await processImage(file);
        if (success) {
            setIsImgUploaded(true);
        }
    }, [processImage]);

    // Handle file input change
    const handleFileUpload = useCallback((e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
            e.target.value = '';
        }
    }, [handleImageFile]);

    // Reset the thumbnail
    const resetThumbnail = useCallback(() => {
        setIsImgUploaded(false);
        clearCanvas();
        const initialHeight = 840;
        const initialWidth = settings.width * initialHeight / settings.height;
        initializeCanvas('Click to pick an image', initialWidth, initialHeight);
    }, [clearCanvas, initializeCanvas, settings.width, settings.height]);

    // Copy the image to clipboard
    const copyImage = useCallback(async () => {
        setSettings(prev => ({
            ...prev,
            copying: 1,
        }));

        try {
            await copyToClipboard(canvasRef.current);

            setSettings(prev => ({
                ...prev,
                copying: 2,
            }));

            setTimeout(() => {
                setSettings(prev => ({
                    ...prev,
                    copying: 0,
                }));
            }, 8000);
        } catch (error) {
            console.error('Failed to copy image:', error);
            setSettings(prev => ({
                ...prev,
                copying: 0,
            }));
        }
    }, [canvasRef, setSettings]);

    // Save the image to disk
    const saveImage = useCallback(() => {
        saveToFile(canvasRef.current, settings.caption);
    }, [canvasRef, settings.caption]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        copy: copyImage,
        save: saveImage,
        resetThumb: resetThumbnail,
    }), [copyImage, saveImage, resetThumbnail]);

    // Render the component
    return (
        <label
            htmlFor="uploadImg"
            className={`${className} ${isDragging ? 'dragging' : ''}`}
            style={{
                flexShrink: 0,
                height: wHeight <= 768 ? 680 : 840,
                maxWidth: 1000,
                display: 'flex',
                overflow: 'clip',
                border: (!isImgUploaded ? '3px dashed #364462' : 'none'),
                borderRadius: (!isImgUploaded ? '30px' : '0'),
                cursor: 'pointer',
                transition: 'border 0.2s, background-color 0.2s',
            }}
            {...dragProps}
        >
            <input
                type="file"
                id="uploadImg"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*"
            />
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    objectFit: 'contain',
                }}
            />
        </label>
    );
});

CanvasHolder.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string,
};
