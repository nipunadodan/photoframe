/**
 * Gets the default URL for a known font
 * @param {string} fontFamily - The font family name
 * @returns {string} - The URL to the font file
 */
export const getDefaultFontUrl = (fontFamily) => {
    const fontUrls = {
        'Inter': 'https://fonts.gstatic.com/s/inter/v13/UcCo3FwrK3iLTfvlaQc78lA2.ttf',
        'Sacramento': 'https://fonts.gstatic.com/s/sacramento/v15/buEzpo6gcdjy0EiZMBUG4Csf-A.ttf',
        'Shadows Into Light Two': 'https://fonts.gstatic.com/s/shadowsintolighttwo/v17/4iC86LVlZsRSjQhpWGedwyOoW-0A6_kpsyNmlAvNGLNnIF0.ttf',
    };

    return fontUrls[fontFamily] || fontUrls['Inter'];
};

/**
 * Loads a font from a URL and adds it to the document
 * @param {string} fontFamily - The font family name
 * @param {string} fontUrl - The URL to the font file
 * @returns {Promise<FontFace>} - The loaded font
 */
export const loadFont = async (fontFamily, providedFontUrl) => {
    try {
        const fontUrl = providedFontUrl || getDefaultFontUrl(fontFamily);
        const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
        const loadedFont = await fontFace.load();
        document.fonts.add(loadedFont);
        return loadedFont;
    } catch (error) {
        console.error(`Failed to load font ${fontFamily}:`, error);
        throw error;
    }
};
