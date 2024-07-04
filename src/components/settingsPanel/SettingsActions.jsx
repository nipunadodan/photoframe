import { useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext.jsx';
import PropTypes from 'prop-types';

export const SettingsActions = ({command}) => {
    SettingsActions.propTypes = {
        command: PropTypes.func
    }
    const {resetSettings} = useContext(SettingsContext);

    return (
        <div className={'flex flex-row justify-end gap-2 py-6'}>
            <input
                type={'submit'} className={'cta transparent'}
                value={'RESET SETTINGS'}
                onClick={resetSettings}
            />
            <input type={'submit'} className={'cta'} value={'SAVE'}/>
            <input type={'submit'} className={'cta active'} value={'COPY'} onClick={() => command('copy')}/>
        </div>
    );
};