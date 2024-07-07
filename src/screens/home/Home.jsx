import { useContext, useEffect, useRef } from 'react';
import { CanvasHolder } from '../../components/imagePlaceholder/canvasHolder/CanvasHolder.jsx';
import { SettingsPanel } from '../../components/settingsPanel/SettingsPanel.jsx';
import { SettingsActions } from '../../components/settingsPanel/SettingsActions.jsx';
import { SettingsContext } from '../../context/SettingsContext.jsx';

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
            }
        }
    }

    useEffect(() => {

    }, [settings.ratio_height, settings.ratio_height]);

    return (
        <div className={'flex flex-row gap-6 justify-center items-center w-screen h-screen'}>
            <CanvasHolder ref={canvasRef} width={settings.width} height={settings.height} className={'canvas-holder'} />
            <div>
                <SettingsPanel />
                <SettingsActions command={onCommand} commandStatus={''} />
            </div>
        </div>
    );
};