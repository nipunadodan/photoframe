import { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { SettingsContext } from '../../../context/SettingsContext.jsx';
import domtoimage from 'dom-to-image';
import './canvasHolder.css'

// eslint-disable-next-line react/display-name
export const CanvasHolder = forwardRef(({width, height, className}, ref) => {
    CanvasHolder.propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        className: PropTypes.string,
    }

    const [isImgUploaded, setIsImgUploaded] = useState(false);
    const {settings} = useContext(SettingsContext);

    const canvasRef = useRef();
    const canvasBackRef = useRef();
    const canvasForeRef = useRef();

    const uploadImage = (e) => {
        e.preventDefault();

        thumbnail(e.target.files[0]);
    }

    function thumbnail(blob){
        const ctx = canvasBackRef.current.getContext('2d');
        const ctx2 = canvasForeRef.current.getContext('2d');
        const reader = new FileReader();

        reader.onload = function(event){
            const img = new Image();

            img.onload = function(){
                canvasBackRef.current.width = img.width;
                canvasBackRef.current.height = img.height;

                canvasForeRef.current.width = img.width;
                canvasForeRef.current.height = img.height;

                ctx.drawImage(img, 0, 0);
                ctx2.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }

        reader.readAsDataURL(blob);

        setIsImgUploaded(true);
    }

    useImperativeHandle(ref, () => {
        return {
            copy() {
                copyImage();
            }
        }
    }, []);

    const copyImage = () => {
        const el = canvasRef.current;
        const scale = window.devicePixelRatio;

        /* options are added to the following to mitigate the issue as described here: https://github.com/tsayen/dom-to-image/issues/361 */
        domtoimage.toBlob(el, {
            height: el.offsetHeight * scale,
            width: el.offsetWidth * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: `${el.offsetWidth}px`,
                height: `${el.offsetHeight}px`
            }
        })
            .then(blob => {
                navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
            });
    }

    return (
        <label ref={canvasRef} htmlFor={'uploadImg'} className={className} style={{
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
            <canvas ref={canvasBackRef} style={{
                position:'absolute',
                zIndex: -8,
                transform: 'scale(1.5)',
                filter: 'blur('+settings.background_blur+'px)',
                width: '100%', height: '100%',
                objectFit: 'cover',
            }}></canvas>

            <div style={{
                width, height,
                position: 'absolute',
                top: 0,
                zIndex: 0,
                background: settings.background === 'light' ? '#ffffff' : '#000000',
                filter: 'opacity('+settings.background_overlay_opacity+')',
            }}></div>
            <canvas
                ref={canvasForeRef}
                style={{
                    position: 'absolute',
                    zIndex: 10,
                    maxHeight: '100%',
                    maxWidth: '100%',
                    borderRadius: settings.border_radius + 'px',
                    transform: 'translateX(-50%) translateY(-50%) scale(' + settings.foreground_image_scale + ')',
                    left: '50%',
                    top: '50%',
                }}
            ></canvas>
        </label>
    );
});