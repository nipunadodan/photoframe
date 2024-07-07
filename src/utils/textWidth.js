export function getTextWidth(text, font) {
    // if given, use cached canvas for better performance else, create new canvas
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);

    return metrics.width;
}