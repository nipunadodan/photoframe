import { dimsContain, dimsCover } from './calcObjectFill.js';

export const drawImageCover = (ctx, img, x, y, width, height, scale = 1) => {
    const {drawWidth, drawHeight, offsetX, offsetY} = dimsCover(img, x, y, width, height, scale)

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
}

export const drawImageContain = (ctx, img, x, y, width, height, scale = 1) => {
    const {drawWidth, drawHeight, offsetX, offsetY} = dimsContain(img, x, y, width, height, scale);

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
}

export const drawExif = async (ctx, {offsetX, offsetY, font}, foreImgWidth, settings) => {
    ctx.font = font.fontSize + 'px Inter';
    ctx.fillStyle = '#fff';

    if (settings.exif_enabled && settings.exif !== '') {
        ctx.textAlign = 'left';
        ctx.fillText(settings.exif, offsetX + foreImgWidth * .01, offsetY);
    }

    if (settings.caption_enabled && settings.caption !== '') {
        font.font_family = settings.caption_fonts[settings.caption_font].font;
        font.font_url = settings.caption_fonts[settings.caption_font].font_url;

        ctx.letterSpacing = font.letterSpacing + 'px';
        ctx.font = 'bold ' + font.fontSize + 'px ' + font.font_family;
        ctx.textAlign = "right";
        ctx.fillText(settings.caption, offsetX + foreImgWidth, offsetY);
    }
}