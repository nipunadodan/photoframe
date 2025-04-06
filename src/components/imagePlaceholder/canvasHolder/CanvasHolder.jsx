import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { SettingsContext } from '../../../context/SettingsContext.jsx';
import './canvasHolder.css'
import exifr from 'exifr';
import { dimsContain, drawImageContain, drawImageCover, fractions } from '../../../utils/index.js';
import { useCalculatedCanvasDimensions } from '../../../custom-hooks/calcCanvasDim.js';
import { drawExif } from '../../../utils/drawFunctions.js';
import { calcTextDims } from '../../../utils/textWidth.js';
import interUrl from '/src/assets/fonts/inter-v.ttf'

// eslint-disable-next-line react/display-name
export const CanvasHolder = forwardRef(({width, height, className}, ref) => {
    CanvasHolder.propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        className: PropTypes.string,
    }

    const [isImgUploaded, setIsImgUploaded] = useState(false);
    const [exifDim, setExifDim] = useState('');

    const {settings, setSettings} = useContext(SettingsContext);
    const {calcWidth, calcHeight} = useCalculatedCanvasDimensions();

    const settingsRef = useRef(settings);
    const canvasRef = useRef();
    const ctxRef = useRef();
    const imgRef = useRef();

    useEffect(() => {
        drawInitCanvas('Click to pick an Image');
    }, []);

    useEffect(() => {
        settingsRef.current = settings;

        if (ctxRef.current && imgRef.current) {
            clearThumbnail();
            drawThumbnail(ctxRef.current,imgRef.current);
        }
    }, [settings]);

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
            }
        }
    }, []);

    const drawInitCanvas = async (text) => {
        let font = new FontFace('Inter', `url(${interUrl})`);
        await font.load();
        document.fonts.add(font);

        const ctx = ctxRef.current || canvasRef.current.getContext('2d');
        ctxRef.current = ctxRef.current ?? ctx;

        const width = 1000;
        const height = 840;
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        // save the unaltered context
        ctx.save();

        ctx.font = "15px Inter";
        const approxFontHeight = parseInt(ctx.font);
        ctx.fillStyle = '#afafaf';
        ctx.textAlign = "center";
        ctx.fillText(text, width / 2, (height / 2) + approxFontHeight / 2);

        // restore the unaltered context
        ctx.restore();
    }

    const uploadImage = (e) => {
        e.preventDefault();

        thumbnail(e.target.files[0]);
        e.target.value = '';
    }

    function thumbnail(blob) {
        const ctx = ctxRef.current || canvasRef.current.getContext('2d');
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();

            img.onload = function () {
                drawThumbnail(ctx, img);
            }

            img.src = event.target.result;
        }

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
        ctx.filter = 'blur('+settings.background_blur+'px)';
        drawImageCover(ctx, img, 0, 0, canvasWidth, canvasHeight, 1.3);

        // draw overlay
        ctx.restore();
        ctx.beginPath();
        ctx.fillStyle = settings.background === 'dark' ? '#000000' : '#ffffff';
        ctx.filter = 'opacity('+settings.background_overlay_opacity+')';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // reset filters
        ctx.restore();
        ctx.filter = 'none';

        ctx.save();

        // create rounded rectangle
        ctx.beginPath();
        const {drawWidth, drawHeight, offsetX, offsetY} = dimsContain(img, 0, 0, canvasWidth, canvasHeight, settings.foreground_image_scale);
        ctx.roundRect(offsetX, offsetY, drawWidth, drawHeight, settings.border_radius);
        ctx.closePath();
        ctx.clip();

        // draw foreground image
        drawImageContain(ctx, img, 0, 0, canvasWidth, canvasHeight, settings.foreground_image_scale);
        ctx.restore();

        const foreImgDims = dimsContain(img, 0, 0, canvasWidth, canvasHeight, settings.foreground_image_scale);
        const textDims = calcTextDims(foreImgDims, settings.longest_edge);

        drawExif(ctx, textDims, foreImgDims.drawWidth, settings);
    }

    const clearThumbnail = () => {
        ctxRef.current.clearRect(0, 0, imgRef.current.width, imgRef.current.height);
    }

    const resetThumbnail = () => {
        setIsImgUploaded(false);
        clearThumbnail();
        drawInitCanvas('Click to pick an image');
    }

    const copyImage = () => {
        const el = canvasRef.current;

        setSettings({
            ...settingsRef.current,
            copying: 1,
        })

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
            const link = document.createElement("a");
            link.href = url;
            link.download = caption+".jpg";
            link.click();
        })
    }

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
    }

    return (
        <label htmlFor={'uploadImg'} className={className} style={{
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
        }}>
            <input type={'file'} id="uploadImg" onChange={uploadImage} onDrop={uploadImage} className={'hidden'} />
            <canvas ref={canvasRef} style={{
                //position:'absolute',
                //top: '',
                width: '100%',
                objectFit: 'contain',
            }}></canvas>
        </label>
    );
});