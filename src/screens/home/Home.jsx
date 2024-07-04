import { useRef } from 'react';
import { CanvasHolder } from '../../components/imagePlaceholder/canvasHolder/CanvasHolder.jsx';
import { SettingsPanel } from '../../components/settingsPanel/SettingsPanel.jsx';
import { SettingsActions } from '../../components/settingsPanel/SettingsActions.jsx';

export const Home = () => {
    const canvasRef = useRef();

    const onCommand = (command) => {
      switch (command) {
          case 'copy':
              copy();
              break;
          case 'save':
              save();
              break;
      }
    }

    const copy = () => {
        if (canvasRef.current) {
            canvasRef.current.copy(true);
        }
    }

    const save = () => {

    }

    return (
        <div className={'flex flex-row gap-6 justify-center items-center w-screen h-screen'}>
            <CanvasHolder ref={canvasRef} width={500} height={840} className={'canvas-holder'} />
            <div>
                <SettingsPanel />
                <SettingsActions command={onCommand} />
            </div>
        </div>
    );
};