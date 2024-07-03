import { useState } from 'react';
import PropTypes from 'prop-types';

export const TextInput = ({name, type, initval, placeholder, onChange, className}) => {
    TextInput.propTypes = {
        name: PropTypes.string,
        type: PropTypes.string,
        initval: PropTypes.string | PropTypes.number,
        placeholder: PropTypes.string,
        className: PropTypes.string,
        onChange: PropTypes.func,
    };
    const [value, setValue] = useState(initval);

    const handleOnChange = (e) => {
        setValue(e.target.value);
        onChange(name, e.target.value);
    }

    return (
        <input type={type} name={'text'} value={value} onChange={handleOnChange} className={'border border-gray-200 outline-0 py-2 px-3 rounded-lg inline-flex ' + className} placeholder={placeholder} />
    );
};