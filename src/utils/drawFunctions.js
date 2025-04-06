import { dimsContain, dimsCover } from './calcObjectFill.js';

export const drawImageCover = (ctx, img, x, y, width, height, scale = 1) => {
    const {drawWidth, drawHeight, offsetX, offsetY} = dimsCover(img, x, y, width, height, scale)

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
}

export const drawImageContain = (ctx, img, x, y, width, height, scale = 1) => {
    const {drawWidth, drawHeight, offsetX, offsetY} = dimsContain(img, x, y, width, height, scale);

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
}

export const drawExif = (ctx, {offsetX, offsetY, font}, foreImgWidth, settings) => {
    const halfWidth = foreImgWidth / 2;

    ctx.font = font.fontSize + 'px Inter';
    ctx.fillStyle = '#afafaf';

    if (settings.exif_enabled && settings.exif !== '') {
        ctx.textAlign = 'left';
        ctx.fillText(settings.exif, offsetX + foreImgWidth * .01, offsetY);

        if(settings.camera_make_enabled && settings.camera_make){
            ctx.fillText(settings.camera_make, offsetX + foreImgWidth * .01, offsetY + font.lineHeight);
        }

        if(settings.lens_info_enabled && settings.lens_info){
            ctx.fillText(settings.lens_info, offsetX + foreImgWidth * .01, offsetY + (settings.camera_make_enabled && settings.camera_make ? font.lineHeight * 2 : font.lineHeight));
        }
    }

    if (settings.caption_enabled && settings.caption !== '') {
        ctx.letterSpacing = font.letterSpacing + 'px';
        ctx.font = 'bold ' + font.fontSize + 'px Inter';
        ctx.textAlign = "right";
        ctx.fillText(settings.caption.toUpperCase(), offsetX + foreImgWidth, offsetY, halfWidth);
    }
}