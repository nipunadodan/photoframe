import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext.jsx';

export const useCalculatedCanvasDimensions = () => {
    const {settings} = useContext(SettingsContext);
    
    const longest_edge = parseInt(settings.longest_edge);
    const ratio_height = parseInt(settings.ratio_height);
    const ratio_width = parseInt(settings.ratio_width);

    let calcWidth, calcHeight;

    if (ratio_height === ratio_width) {
        calcWidth = calcHeight = longest_edge;
    } else if (ratio_height > ratio_width) {
        calcHeight = longest_edge;
        calcWidth = longest_edge / ratio_height * ratio_width;
    } else {
        calcHeight = longest_edge / ratio_width * ratio_height;
        calcWidth = longest_edge;
    }

    return {calcWidth, calcHeight}
}