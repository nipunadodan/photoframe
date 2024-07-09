import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { SettingsContext } from '../../../context/SettingsContext.jsx';
import './canvasHolder.css'
import exifr from 'exifr';
import { fractions, getTextWidth } from '../../../utils/index.js';
import { useCalculatedCanvasDimensions } from '../../../custom-hooks/calcCanvasDim.js';

// eslint-disable-next-line react/display-name
export const CanvasHolder = forwardRef(({width, height, className}, ref) => {
    CanvasHolder.propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        className: PropTypes.string,
    }

    const [isImgUploaded, setIsImgUploaded] = useState(false);
    const {settings, setSettings} = useContext(SettingsContext);
    const [exifDim, setExifDim] = useState('');

    const canvasRef = useRef();

    const uploadImage = (e) => {
        e.preventDefault();

        thumbnail(canvasRef, e.target.files[0]);
    }

    function thumbnail(ref, blob){
        const ctx = ref.current.getContext('2d');
        const reader = new FileReader();

        reader.onload = function(event){
            const img = new Image();

            img.onload = function(){
                const offsetX1 = img.width * (1 - 1.3) / 2;
                const offsetY1 = img.height * (1 - 1.3) / 2;
                const offsetX2 = img.width * (1 - settings.foreground_image_scale) / 2;
                const offsetY2 = img.height * (1 - settings.foreground_image_scale) / 2;

                ref.current.width = img.width;
                ref.current.height = img.height;

                ctx.save();

                ctx.filter = 'blur('+settings.background_blur+'px)';
                ctx.scale(1.3, 1.3);
                ctx.drawImage(img, offsetX1, offsetY1);

                ctx.restore();
                ctx.beginPath();
                ctx.fillStyle = settings.background === 'dark' ? '#000000' : '#ffffff';
                ctx.filter = 'opacity('+settings.background_overlay_opacity+')';
                ctx.fillRect(0, 0, img.width, img.height);

                ctx.restore();
                ctx.filter = 'none';
                ctx.drawImage(img, offsetX2, offsetY2, img.width * settings.foreground_image_scale, img.height * settings.foreground_image_scale);
            }

            img.src = event.target.result;
        }

        reader.readAsDataURL(blob);

        readExif(blob);

        setIsImgUploaded(true);
    }

    useImperativeHandle(ref, () => {
        return {
            copy() {
                copyImage();
            },
            save() {
                saveImage();
            }
        }
    }, []);

    const copyImage = () => {
        const el = canvasRef.current;

        el.toBlob((blob) => {
            navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
                .then(() => {
                    console.log('copied');
                })
        });
    }

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
                const camera_make = (output.Make === 'NIKON CORPORATION' ? '' : output.Make) + ' ' + output.Model;
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

    useEffect(() => {
        const exifWidth = getTextWidth(settings.exif, 'normal 16px Inter');
        setExifDim('0 0 ' + exifWidth + ' 16');
    }, [settings.exif]);

    return (
        <label htmlFor={'uploadImg'} className={className} style={{
            flexShrink: 0,
            width,
            height,
            display: 'block',
            position: 'relative',
            overflow: 'clip',
            border: (!isImgUploaded ? '3px dashed #364462' : 'none'),
            borderRadius: (!isImgUploaded ? '30px' : '0'),
            cursor: 'pointer',
        }}>
            <input type={'file'} id="uploadImg" onChange={uploadImage} onDrop={uploadImage} className={'hidden'} />
            <canvas ref={canvasRef} style={{
                position:'absolute',
                top: 0,
                width: '100%',
            }}></canvas>
        </label>
    );
});