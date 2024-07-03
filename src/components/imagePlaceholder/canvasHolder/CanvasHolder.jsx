import PropTypes from 'prop-types';
import './canvasHolder.css'
import { useContext, useRef, useState } from 'react';
import { SettingsContext } from '../../../context/SettingsContext.jsx';
import html2canvas from 'html2canvas';

export const CanvasHolder = ({width, height, className}) => {
    CanvasHolder.propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        className: PropTypes.string,
    }

    const [isImgUploaded, setIsImgUploaded] = useState(false);
    const {settings} = useContext(SettingsContext);

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

    return (
        <label htmlFor={'uploadImg'} className={className} style={{
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
                transform: 'scale(1.08)',
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
                filter: 'opacity('+settings.background_overlay_opacity+')'
            }}></div>
            <canvas
                ref={canvasForeRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    zIndex: 10,
                    height: '100%',
                    width: '100%',
                    transform: 'translateX(-50%) scale(' + settings.foreground_image_scale + ')',
                    borderRadius: settings.border_radius + 'px',
                    left: '50%',
                }}
            ></canvas>
        </label>
    );
};