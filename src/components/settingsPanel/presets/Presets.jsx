import { presets } from './presetsConfig.js';
import { Preset } from './Preset.jsx';

export const Presets = () => {
    return (
        <>
            {Object.keys(presets).map((preset, index) => (
                <Preset key={index} preset={preset} />
            ))}
        </>
    )
};