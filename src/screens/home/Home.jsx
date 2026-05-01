import {useContext, useEffect, useRef} from 'react';
// import { CanvasHolder } from '../../components/imagePlaceholder/canvasHolder/CanvasHolder.jsx';
import {SettingsPanel} from '../../components/photo-frame/settingsPanel/SettingsPanel.jsx';
import {SettingsActions} from '../../components/photo-frame/settingsPanel/SettingsActions.jsx';
import {SettingsContext} from '../../context/SettingsContext.jsx';
import {CanvasHolder} from '../../components/photo-frame/canvas/CanvasHolder.jsx';

export const Home = () => {
    const {settings} = useContext(SettingsContext);
    const canvasRef = useRef();

    const onCommand = (command) => {
        if (canvasRef.current) {
            switch (command) {
                case 'copy':
                    canvasRef.current.copy();
                    break;
                case 'save':
                    canvasRef.current.save();
                    break;
                case 'resetThumb':
                    canvasRef.current.resetThumb();
                    break;
            }
        }
    };

    useEffect(() => {

    }, [settings.ratio_height, settings.ratio_height]);

    return (
        <div className={'flex flex-row gap-6 py-6 justify-center items-center min-w-screen min-h-screen'}>
            <CanvasHolder ref={canvasRef} className={'canvas-holder'}/>
            <div>
                <SettingsPanel/>
                <SettingsActions command={onCommand}/>
            </div>
        </div>
    );
};