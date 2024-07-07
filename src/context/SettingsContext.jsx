import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const INIT = {
    width: 378,
    height: 840,
    ratio_width: 9,
    ratio_height: 20,
    longest_edge: 840,
    background: 'light',
    background_overlay_opacity: 0.20,
    background_blur: 20,
    border_radius: 20,
    foreground_image_scale: 0.8,
    caption: '',
    watermark: true,
    exif: true,
    camera_make: false,
    lens_info: false,
};

const getInitialSettings = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('pwf-settings');
        if (typeof storedPrefs === 'string') {
            return JSON.parse(storedPrefs);
        }
    }

    return INIT;
};

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    SettingsProvider.propTypes = {
        children: PropTypes.node
    };

    const [settings, setSettings] = useState(getInitialSettings);

    const saveSettings = () => {
        localStorage.setItem('pwf-settings', JSON.stringify(settings));
    }

    const resetSettings = () => {
        setSettings(INIT);
    }

    useEffect(() => {
        saveSettings();
    }, [settings]);

    return <SettingsContext.Provider value={{settings, setSettings, resetSettings}}>{children}</SettingsContext.Provider>;
}