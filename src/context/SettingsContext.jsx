import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    SettingsProvider.propTypes = {
        children: PropTypes.node
    };

    const [settings, setSettings] = useState({
        background: 'light',
        background_overlay_opacity: 0.10,
        background_blur: 0.10,
        border_radius: 20,
        foreground_image_scale: 1,
        longest_edge: 1080,
        ratio_width: 4,
        ratio_height: 5,
        caption: '',
        watermark: true,
        exif: true,
        camera_make: false,
        lens_info: false,
    });

    return <SettingsContext.Provider value={{settings, setSettings}}>{children}</SettingsContext.Provider>;
}