import { useState } from 'react';
import PropTypes from 'prop-types';

export const Toggler = ({name, list, status, onChange}) => {
    Toggler.propTypes = {
        name: PropTypes.string,
        label: PropTypes.string,
        list: PropTypes.array,
        status: PropTypes.string,
        onChange: PropTypes.func,
    };

    const [selectedItem, setSelectedItem] = useState(status);

    const selectOption = (selectedItem) => {
        setSelectedItem(selectedItem);
        onChange(name, selectedItem);
    }

    return (
        <div className="inline-flex flex-row gap-3 bg-gray-100 p-2 rounded-full">
            {list.map((item, index) => (
                <div key={index} className={'action-button ' + (selectedItem === item.value ? 'active' : '')} onClick={() => selectOption(item.value)}>
                    {item.label}
                </div>
            ))}
        </div>
    );
};