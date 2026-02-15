export function getTextWidth(text, font) {
    // if given, use cached canvas for better performance else, create new canvas
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);

    return Math.round(metrics.width);
}

export const calcTextDims = (foreImgDims, longest_edge, rotation) => {
    const fontSize = 9 / 840 * longest_edge;
    const letterSpacing = 4 / 840 * longest_edge;
    const lineHeight = 15 / 840 * longest_edge;

    if (rotation > 0 && rotation < 360) {
        return {
            offsetX: Math.round(foreImgDims.offsetX + foreImgDims.drawHeight + (fontSize + foreImgDims.drawHeight * .035)),
            offsetY: Math.round(foreImgDims.offsetY),
            font: {
                fontSize,
                letterSpacing,
                lineHeight,
            },
        };
    }

    return {
        offsetX: Math.round(foreImgDims.offsetX),
        offsetY: Math.round(foreImgDims.offsetY + foreImgDims.drawHeight + (fontSize + foreImgDims.drawWidth * .035)),
        font: {
            fontSize,
            letterSpacing,
            lineHeight,
        },
    };
};