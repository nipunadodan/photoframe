import {useContext, useRef, useState} from 'react';
import {SettingsPanel} from '../../components/photo-frame/settingsPanel/SettingsPanel.jsx';
import {SettingsActions} from '../../components/photo-frame/settingsPanel/SettingsActions.jsx';
import {SettingsContext} from '../../context/SettingsContext.jsx';
import {CanvasHolder} from '../../components/photo-frame/canvas/CanvasHolder.jsx';
import {useIsMobile} from '../../hooks/useIsMobile.js';

const sections = [
    {id: 'background', label: 'Background'},
    {id: 'frame', label: 'Frame'},
    {id: 'canvas', label: 'Canvas'},
    {id: 'text', label: 'Text'},
];

export const Home = () => {
    const {settings} = useContext(SettingsContext);
    const canvasRef = useRef();
    const isMobile = useIsMobile();
    const [editing, setEditing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [section, setSection] = useState(sections[0].id);

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

    const copyLabel = settings.copying === 1 ? 'COPYING...' : (settings.copying === 2 ? 'COPIED' : 'COPY');

    return (
        <div className={'fixed inset-0 md:static flex flex-row gap-6 md:py-6 justify-center items-center md:min-h-screen'}>
            <div className={'w-full h-full md:w-auto md:h-auto'}>
                <CanvasHolder ref={canvasRef} className={'canvas-holder'} />
            </div>

            <div
                className={`${editing ? '' : 'hidden'} md:block fixed bottom-16 inset-x-0 max-h-[50vh] overflow-y-auto bg-white/30 dark:bg-black/30 backdrop-blur md:static md:max-h-none md:overflow-visible md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none rounded-t-3xl md:rounded-none pt-4 px-3`}>
                <SettingsPanel section={isMobile ? section : undefined} />
                <div className={'hidden md:block'}>
                    <SettingsActions command={onCommand} />
                </div>
            </div>

            <div className={'md:hidden fixed top-3 right-3 flex flex-col items-end gap-2'}>
                <div className={'flex gap-2'}>
                    <input type={'submit'} className={`cta ${editing ? 'active' : ''}`} value={editing ? 'DONE' : 'EDIT'}
                           onClick={() => setEditing(!editing)} />
                    <input type={'submit'} className={'cta'} value={'EXPORT'} onClick={() => setExporting(!exporting)} />
                </div>
                {exporting && (
                    <div className={'flex gap-2'}>
                        <input type={'submit'} className={'cta'} value={'SAVE'} onClick={() => onCommand('save')} />
                        <input type={'submit'} className={'cta active'} value={copyLabel} onClick={() => onCommand('copy')} />
                    </div>
                )}
            </div>

            {editing && (
                <nav className={'md:hidden fixed bottom-0 inset-x-0 h-16 flex items-center justify-around bg-white/40 dark:bg-black/40'}>
                    {sections.map(({id, label}) => (
                        <button key={id} className={`text-xs px-3 py-2 uppercase ${section === id ? 'font-black text-gray-50' : 'text-gray-400'}`}
                                onClick={() => setSection(id)}>{label}</button>
                    ))}
                </nav>
            )}
        </div>
    );
};
