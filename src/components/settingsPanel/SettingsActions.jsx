import { useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext.jsx';
import PropTypes from 'prop-types';
import ThemeToggle from '../controls/theme/ThemeToggle.jsx';

export const SettingsActions = ({command, commandStatus}) => {
    SettingsActions.propTypes = {
        command: PropTypes.func,
        commandStatus: PropTypes.string,
    }
    const {resetSettings} = useContext(SettingsContext);

    return (
        <div className={'flex flex-row justify-between gap-2 py-6 px-3'}>
            <ThemeToggle />
            <div className={'flex flex-row justify-end gap-2'}>
                <input
                    type={'submit'} className={'cta transparent'}
                    value={'RESET SETTINGS'}
                    onClick={resetSettings}
                />
                <input type={'submit'} className={'cta'} value={'SAVE'} onClick={() => command('save')}/>
                <input type={'submit'} className={'cta active'} value={commandStatus === 'success' ? 'COPIED!' : 'COPY'} onClick={() => command('copy')}/>
            </div>
        </div>
    );
};