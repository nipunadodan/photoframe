import React from 'react';
import PropTypes from 'prop-types';
import {ThemeContext} from '../../../../context/ThemeContext.jsx';

const ThemeToggle = ({className, disabled}) => {
    ThemeToggle.propTypes = {
        className: PropTypes.string,
        disabled: PropTypes.bool,
    };
    const {theme, setTheme} = React.useContext(ThemeContext);

    return (
        <button
            className={'inline-block text-center transition duration-500 ease-in-out rounded-full cursor-pointer ' + className}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            disabled={disabled}
        >
            {theme === 'dark' ? (
                /*<i className={'text-gray-500 dark:text-gray-400 la-fw la la-moon'}/>*/
                <span className={'material-symbols-outline material-symbols-rounded'}>nightlight</span>
            ) : (
                /*<i className={'text-gray-500 dark:text-gray-400 la-fw la la-sun'}/>*/
                <span className={'material-symbols-outline material-symbols-rounded'}>light_mode</span>
            )
            }
        </button>
    )
        ;
};

export default ThemeToggle;
