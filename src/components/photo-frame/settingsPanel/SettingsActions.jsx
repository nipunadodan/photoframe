import {useContext} from 'react';
import {SettingsContext} from '../../../context/SettingsContext.jsx';
import PropTypes from 'prop-types';
import ThemeToggle from '../controls/theme/ThemeToggle.jsx';

export const SettingsActions = ({command}) => {
    SettingsActions.propTypes = {
        command: PropTypes.func,
        commandStatus: PropTypes.string,
    };
    const {settings, resetSettings} = useContext(SettingsContext);

    return (
        <>
            <div className={'flex flex-row justify-between gap-2 py-6 px-3'}>
                <ThemeToggle />
                <div className={'flex flex-row justify-end gap-2'}>
                    <input
                        type={'submit'} className={'cta transparent'}
                        value={'RESET SETTINGS'}
                        onClick={() => {
                            resetSettings();
                            // command('resetThumb');
                        }}
                    />
                    <input type={'submit'} className={'cta'} value={'SAVE'} onClick={() => command('save')} />
                    <input type={'submit'} className={'cta active'}
                           value={(settings.copying === 1 ? 'COPYING...' : (settings.copying === 2 ? 'COPIED' : 'COPY'))} onClick={() => command('copy')} />
                </div>
            </div>
            <footer className={'px-3 text-xs text-gray-300 dark:text-gray-600'}>Photo with Frame | Created with ❤️ by <a className={'underline'} href={'https://nipunadodan.com'}>Nipuna Dodantenna</a> | ver. 2.3</footer>
        </>
    );
};