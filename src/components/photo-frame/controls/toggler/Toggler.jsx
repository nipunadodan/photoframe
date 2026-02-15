import PropTypes from 'prop-types';

export const Toggler = ({name, list, status, onChange}) => {
    Toggler.propTypes = {
        name: PropTypes.string,
        label: PropTypes.string,
        list: PropTypes.array,
        status: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        onChange: PropTypes.func,
    };

    const selectOption = (selectedItem) => {
        onChange(name, selectedItem);
    };

    return (
        <div className="inline-flex flex-row gap-3 bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
            {list.map((item, index) => (
                <div key={index} className={'action-button ' + (status === item.value ? 'active' : '')} onClick={() => selectOption(item.value)}>
                    {item.label}
                </div>
            ))}
        </div>
    );
};