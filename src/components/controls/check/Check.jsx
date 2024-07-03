import PropTypes from 'prop-types';

export const Check = ({name, label, status, onChange}) => {
    Check.propTypes = {
        name: PropTypes.string,
        label: PropTypes.string,
        status: PropTypes.bool,
        onChange: PropTypes.func,
    };

    const changeCheckStatus = () => {
        onChange(name, !status);
    }

    return (
        <div className={'cursor-pointer inline-flex flex-row gap-2 text-cta'} onClick={changeCheckStatus}>
            {status
                ? <span className={'material-symbols-filled material-symbols-rounded'}>check_circle</span>
                : <span className={'material-symbols-outline material-symbols-rounded'}>radio_button_unchecked</span>
            }
            <span className={'text-gray-700'}>{label}</span>
        </div>
    );
};