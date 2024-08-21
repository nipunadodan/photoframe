import { useContext, useEffect } from 'react';
import { Check, Toggler, ValueSlider, TextInput } from '../controls/index.js';
import { SettingsContext } from '../../context/SettingsContext.jsx';
import { useCalculatedCanvasDimensions } from '../../custom-hooks/calcCanvasDim.js';

export const SettingsPanel = () => {
    const {settings, setSettings} = useContext(SettingsContext);
    const {calcWidth, calcHeight} = useCalculatedCanvasDimensions();

    const setSettingsGlobal = (name, value) => {
        setSettings({
            ...settings,
            [name]: value,
        });
    };
    useEffect(() => {
        setSettings({
            ...settings,
            width: calcWidth,
            height: calcHeight,
        });
    }, [settings.longest_edge, settings.ratio_height, settings.ratio_width]);

    useEffect(() => {
        if (settings.background === 'off') {
            setSettings({
                ...settings,
                background_overlay_opacity: 1,
            })
        }
    }, [settings.background])

    return (
        <div>
            <aside className={'justify-center w-full p-4 inline-flex flex-col gap-6'}>
                <div className={'flex flex-col items-start gap-2'}>
                    <label>Background</label>
                    <Toggler
                        name={'background'}
                        list={[
                            {label: 'DARK', value: 'dark'},
                            {label: 'LIGHT', value: 'light'},
                            {label: 'OFF', value: 'off'},
                        ]}
                        status={settings.background}
                        onChange={setSettingsGlobal}
                    />
                </div>

                <div className={'flex flex-col gap-3'}>
                    <label>Background Overlay Opacity</label>
                    <div className={'flex flex-row gap-3 items-center'}>
                        <ValueSlider
                            name={'background_overlay_opacity'}
                            value={settings.background_overlay_opacity}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={setSettingsGlobal}
                        />
                        <div className={'text-center'}>{settings.background_overlay_opacity}</div>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <label>Background Blur</label>
                    <div className={'flex flex-row gap-3 items-center'}>
                        <ValueSlider
                            name={'background_blur'}
                            value={settings.background_blur}
                            min={0}
                            max={80}
                            step={1}
                            onChange={setSettingsGlobal}
                        />
                        <div className={'text-center'}>{settings.background_blur}</div>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <label>Border Radius</label>
                    <div className={'flex flex-row gap-3 items-center'}>
                        <ValueSlider
                            name={'border_radius'}
                            value={settings.border_radius}
                            min={0}
                            max={55}
                            step={1}
                            onChange={setSettingsGlobal}
                        />
                        <div className={'text-center'}>{settings.border_radius}</div>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <label>Foreground Image Scale</label>
                    <div className={'flex flex-row gap-3 items-center'}>
                        <ValueSlider
                            name={'foreground_image_scale'}
                            value={settings.foreground_image_scale}
                            min={0}
                            max={1.5}
                            step={0.01}
                            onChange={setSettingsGlobal}
                        />
                        <div className={'text-center'}>{settings.foreground_image_scale}</div>
                    </div>
                </div>

                <div className={'inline-flex gap-16'}>
                    <div className={'flex flex-col gap-3'}>
                        <label>Canvas Ratio</label>
                        <div className={'inline-flex flex-row gap-3 items-center'}>
                            <div className={'flex flex-col gap-2 items-center'}>
                                <TextInput
                                    name={'ratio_width'}
                                    type={'text'}
                                    initval={settings.ratio_width}
                                    onChange={setSettingsGlobal}
                                    className={'w-[50px] text-center'}
                                />
                                <div className={'text-3xs'}>Width</div>
                            </div>
                            <span>×</span>
                            <div className={'flex flex-col gap-2 items-center'}>
                                <TextInput
                                    name={'ratio_height'}
                                    type={'text'}
                                    initval={settings.ratio_height}
                                    onChange={setSettingsGlobal}
                                    className={'w-[50px] text-center'}
                                />
                                <div className={'text-3xs'}>Height</div>
                            </div>
                        </div>
                    </div>
                    <div className={'flex flex-col gap-3'}>
                        <label>Longest Edge</label>
                        <div className={'inline-flex gap-3 items-center'}>
                            <TextInput
                                name={'longest_edge'}
                                type={'text'}
                                initval={settings.longest_edge}
                                onChange={setSettingsGlobal}
                                className={'w-[100px] text-right'}
                            />
                            <span>px</span>
                        </div>
                    </div>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <label>Caption</label>
                    <div>
                        <TextInput
                            name={'caption'}
                            type={'text'}
                            initval={settings.caption}
                            placeholder={'Image Caption'}
                            onChange={setSettingsGlobal}
                            className={''}
                        />
                    </div>
                </div>

                <div className={'flex flex-row gap-8'}>
                    <Check
                        name={'watermark_enabled'}
                        label={'Watermark'}
                        status={settings.watermark_enabled}
                        onChange={setSettingsGlobal}
                    />
                    <Check
                        name={'exif_enabled'}
                        label={'EXIF'}
                        status={settings.exif_enabled}
                        onChange={setSettingsGlobal}
                    />
                    <Check
                        name={'caption_enabled'}
                        label={'Caption'}
                        status={settings.caption_enabled}
                        onChange={setSettingsGlobal}
                    />
                </div>
            </aside>
        </div>
    );
};