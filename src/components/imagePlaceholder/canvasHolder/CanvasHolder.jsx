import {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {SettingsContext} from '../../../context/SettingsContext.jsx';
import './canvasHolder.css';
import exifr from 'exifr';
import {dimsContain, drawImageContain, drawImageCover, fractions} from '../../../utils/index.js';
import {useCalculatedCanvasDimensions} from '../../../custom-hooks/calcCanvasDim.js';
import {drawExif} from '../../../utils/drawFunctions.js';
import {calcTextDims} from '../../../utils/textWidth.js';

// eslint-disable-next-line react/display-name,no-unused-vars
export const CanvasHolder = forwardRef(({width, height, className}, ref) => {
    CanvasHolder.propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        className: PropTypes.string,
    };

    const [isImgUploaded, setIsImgUploaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    // const [exifDim, setExifDim] = useState('');

    const {settings, setSettings} = useContext(SettingsContext);
    const {calcWidth, calcHeight} = useCalculatedCanvasDimensions();

    const settingsRef = useRef(settings);
    const canvasRef = useRef();
    const ctxRef = useRef();
    const imgRef = useRef();

    useEffect(() => {
        drawInitCanvas('Click to pick an image');
    }, []);

    useEffect(() => {
        settingsRef.current = settings;

        if (ctxRef.current && imgRef.current) {
            clearThumbnail();
            drawThumbnail(ctxRef.current, imgRef.current);
        }
    }, [settings]);

    useEffect(() => {
        if (typeof settings !== 'undefined' && typeof settings.caption_fonts !== 'undefined') {
            loadFont(settings?.caption_fonts[settings.caption_font]);
        }
    }, [settings.caption_font]);

    useImperativeHandle(ref, () => {
        return {
            copy() {
                copyImage();
            },
            save() {
                saveImage();
            },
            resetThumb() {
                resetThumbnail();
            },
        };
    }, []);

    const loadFont = async (font) => {
        const fontLoaded = new FontFace(font.font_family, `url(${font.font_url})`);
        await fontLoaded.load();
        document.fonts.add(fontLoaded);
    };

    const drawInitCanvas = async (text) => {
        const interApiUrl = 'https://fonts.gstatic.com/s/inter/v13/UcCo3FwrK3iLTfvlaQc78lA2.ttf';
        const font = new FontFace('Inter', `url(${interApiUrl})`);
        await font.load();
        document.fonts.add(font);

        const ctx = ctxRef.current || canvasRef.current.getContext('2d');
        ctxRef.current = ctxRef.current ?? ctx;

        const height = 840;
        const width = settings.width * height / settings.height;
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        // save the unaltered context
        ctx.save();

        ctx.font = '15px Inter';
        const approxFontHeight = parseInt(ctx.font);
        ctx.fillStyle = '#afafaf';
        ctx.textAlign = 'center';
        ctx.fillText(text, width / 2, (height / 2) + approxFontHeight / 2);

        // restore the unaltered context
        ctx.restore();
    };

    const uploadImage = (e) => {
        e.preventDefault();
        thumbnail(e.target.files[0]);
        e.target.value = '';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer?.files?.length) {
            const file = e.dataTransfer.files[0];
            thumbnail(file);
        }
    };

    function thumbnail(blob) {
        const ctx = ctxRef.current || canvasRef.current.getContext('2d');
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();

            img.onload = function () {
                drawThumbnail(ctx, img);
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(blob);

        readExif(blob);

        setIsImgUploaded(true);
    }

    const drawThumbnail = (ctx, img) => {
        const canvasWidth = calcWidth;
        const canvasHeight = calcHeight;

        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;
        imgRef.current = img;

        ctx.save();

        // draw background image with a blur
        ctx.filter = 'blur(' + settings.background_blur + 'px)';
        drawImageCover(ctx, img, 0, 0, canvasWidth, canvasHeight, settings, 1.3);

        // draw overlay
        ctx.restore();
        ctx.beginPath();
        ctx.fillStyle = settings.background === 'dark' ? '#000000' : '#ffffff';
        ctx.filter = 'opacity(' + settings.background_overlay_opacity + ')';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // reset filters
        ctx.restore();
        ctx.filter = 'none';

        ctx.save();

        let {drawWidth, drawHeight, offsetX, offsetY} = dimsContain(img, 0, 0, canvasWidth, canvasHeight, settings.foreground_image_scale);

        // Apply rotation if needed
        if (settings.image_rotation > 0 && settings.image_rotation < 360) {
            // Calculate the center of the image
            const centerX = offsetX + drawWidth / 2;
            const centerY = offsetY + drawHeight / 2;

            // Translate to the center, rotate, and translate back
            ctx.translate(centerX, centerY);
            ctx.rotate(settings.image_rotation * Math.PI / 180);
            ctx.translate(-centerX, -centerY);
        }

        // create rounded rectangle
        ctx.beginPath();
        ctx.roundRect(offsetX, offsetY, drawWidth, drawHeight, settings.border_radius);
        ctx.closePath();
        ctx.clip();


        // draw foreground image
        drawImageContain(ctx, img, 0, 0, canvasWidth, canvasHeight, settings.foreground_image_scale);
        ctx.restore();

        const foreImgDims = dimsContain(img, 0, 0, canvasWidth, canvasHeight, settings.foreground_image_scale);
        const textDims = calcTextDims(foreImgDims, settings.longest_edge, settings.image_rotation);

        drawExif(ctx, textDims, foreImgDims.drawWidth, foreImgDims.drawHeight, settings);
    };

    const clearThumbnail = () => {
        ctxRef.current.clearRect(0, 0, imgRef.current.width, imgRef.current.height);
    };

    const resetThumbnail = () => {
        setIsImgUploaded(false);
        clearThumbnail();
        drawInitCanvas('Click to pick an image');
    };

    const copyImage = () => {
        const el = canvasRef.current;

        setSettings({
            ...settingsRef.current,
            copying: 1,
        });

        el.toBlob((blob) => {
            navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
                     .then(() => {
                         setSettings({
                             ...settingsRef.current,
                             copying: 2,
                         });

                         setTimeout(() => {
                             setSettings({
                                 ...settingsRef.current,
                                 copying: 0,
                             });
                         }, 8000);
                     });
        });
    };

    const saveImage = () => {
        const el = canvasRef.current;
        const caption = settings.caption ? settings.caption.toLowerCase().replace(/\s+/g, '-') : 'photo-with-frame';

        el.toBlob((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = caption + '.jpg';
            link.click();
        });
    };

    const readExif = async (blob) => {
        let file = await exifr.readBlobAsArrayBuffer(blob);

        exifr.parse(file)
             .then((output) => {
                 const camera_make = (output.Make === 'NIKON CORPORATION' ? '' : (output.Make + ' ')) + output.Model;

                 const lens_info = output.LensModel ?? '';

                 const exif = (output.ExposureTime < 0.1 ? fractions(output.ExposureTime) : output.ExposureTime) + ' s • f/' + output.FNumber + ' • ' + output.FocalLength + ' mm • ISO ' + output.ISO;

                 setSettings({
                     ...settings,
                     camera_make,
                     lens_info,
                     exif,
                 });
             });
    };

    return (
        <label htmlFor={'uploadImg'} className={`${className} ${isDragging ? 'dragging' : ''}`} style={{
            flexShrink: 0,
            height: 840,
            maxWidth: 1000,
            display: 'flex',
            // alignItems: 'center',
            // position: 'relative',
            overflow: 'clip',
            border: (!isImgUploaded ? '3px dashed #364462' : 'none'),
            borderRadius: (!isImgUploaded ? '30px' : '0'),
            cursor: 'pointer',
            transition: 'border 0.2s, background-color 0.2s',
        }}
               onDragOver={handleDragOver}
               onDragEnter={handleDragEnter}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}>

            <input type={'file'} id="uploadImg" onChange={uploadImage} className={'hidden'} />
            <canvas ref={canvasRef} style={{
                //position:'absolute',
                //top: '',
                width: '100%',
                objectFit: 'contain',
            }}></canvas>
        </label>
    );
});
