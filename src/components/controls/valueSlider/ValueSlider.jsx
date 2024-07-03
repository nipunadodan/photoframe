import { useState } from 'react';
import PropTypes from 'prop-types';

export const ValueSlider = ({name, value, min, max, step, onChange}) => {
    ValueSlider.propTypes = {
        name: PropTypes.string,
        value: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        onChange: PropTypes.func,
    };
    const [range, setRange] = useState(value);

    const onRangeChange = (e) => {
        setRange(e.target.value);
        onChange(name, e.target.value);
    }

    return (
        <input
            name={name}
            type={'range'}
            value={range}
            min={(min ?? 0)}
            max={(max ?? 100)}
            step={step}
            onChange={onRangeChange}
            className={'value-slider'}
        />
    );
};