import {createContext, useEffect, useState} from 'react';
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
    image_rotation: 0,
    caption: '',
    caption_enabled: true,
    watermark_enabled: true,
    exif_enabled: true,
    camera_make_enabled: false,
    lens_info_enabled: false,
    watermark: '',
    exif: '',
    camera_make: '',
    lens_info: '',
    copying: 0,
    caption_fonts: [
        {
            font: 'Inter',
            font_url: 'https://fonts.gstatic.com/s/inter/v13/UcCo3FwrK3iLTfvlaQc78lA2.ttf',
        }, {
            font: 'Sacramento',
            font_url: 'https://fonts.gstatic.com/s/sacramento/v15/buEzpo6gcdjy0EiZMBUG4Csf-A.ttf',
        }, {
            font: 'Shadows Into Light Two',
            font_url: 'https://fonts.gstatic.com/s/shadowsintolighttwo/v17/4iC86LVlZsRSjQhpWGedwyOoW-0A6_kpsyNmlAvNGLNnIF0.ttf',
        },
    ],
    caption_font: 0,
    caption_letter_spacing: 0,
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

export const SettingsProvider = ({children}) => {
    SettingsProvider.propTypes = {
        children: PropTypes.node,
    };

    const [settings, setSettings] = useState(getInitialSettings);

    const saveSettings = () => {
        localStorage.setItem('pwf-settings', JSON.stringify({
            ...settings,
            watermark: '',
            exif: '',
            camera_make: '',
            lens_info: '',
        }));
    };

    const resetSettings = () => {
        setSettings({
            ...INIT,
            watermark: settings.watermark,
            exif: settings.exif,
            camera_make: settings.camera_make,
            lens_info: settings.lens_info,
        });
    };

    useEffect(() => {
        saveSettings();
    }, [settings]);

    return <SettingsContext.Provider value={{settings, setSettings, resetSettings}}>{children}</SettingsContext.Provider>;
};
