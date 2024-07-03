import { useState } from 'react';
import PropTypes from 'prop-types';

export const Check = ({name, label, status, onChange}) => {
    Check.propTypes = {
        name: PropTypes.string,
        label: PropTypes.string,
        status: PropTypes.bool,
        onChange: PropTypes.func,
    };

    const [isChecked, setIsChecked] = useState(status);

    const changeCheckStatus = () => {
        const sts = isChecked;

        setIsChecked(!sts);
        onChange(name, !sts);
    }

    return (
        <div className={'cursor-pointer inline-flex flex-row gap-2 text-cta'} onClick={changeCheckStatus}>
            {isChecked
                ? <span className={'material-symbols-filled material-symbols-rounded'}>check_circle</span>
                : <span className={'material-symbols-outline material-symbols-rounded'}>radio_button_unchecked</span>
            }
            <span className={'text-gray-700'}>{label}</span>
        </div>
    );
};