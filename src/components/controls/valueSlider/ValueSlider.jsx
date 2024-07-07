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
    const onRangeChange = (e) => {
        onChange(name, parseFloat(e.target.value));
    }

    return (
        <input
            name={name}
            type={'range'}
            value={value}
            min={(min ?? 0)}
            max={(max ?? 100)}
            step={step}
            onChange={onRangeChange}
            className={'value-slider'}
        />
    );
};