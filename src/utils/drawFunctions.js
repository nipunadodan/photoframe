import {dimsContain, dimsCover} from './calcObjectFill.js';

export const drawImageCover = (ctx, img, x, y, width, height, settings, scale = 1) => {
    const {drawWidth, drawHeight, offsetX, offsetY} = dimsCover(img, x, y, width, height, scale);

    if (settings.image_rotation > 0 && settings.image_rotation < 360) {
        // Calculate the center of the image
        const centerX = offsetX + drawWidth / 2;
        const centerY = offsetY + drawHeight / 2;

        // Translate to the center, rotate, and translate back
        ctx.translate(centerX, centerY);
        ctx.rotate(settings.image_rotation * Math.PI / 180);
        ctx.translate(-centerX, -centerY);
    }

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
};

export const drawImageContain = (ctx, img, x, y, width, height, scale = 1) => {
    const {drawWidth, drawHeight, offsetX, offsetY} = dimsContain(img, x, y, width, height, scale);

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
};

export const drawExif = async (ctx, {offsetX, offsetY, font}, foreImgWidth, foreImgHeight, settings) => {
    ctx.font = font.fontSize + 'px Inter';
    ctx.fillStyle = '#fff';

    if (settings.exif_enabled && settings.exif !== '') {
        ctx.textAlign = 'left';
        ctx.fillText(settings.exif, offsetX + foreImgWidth * .01, offsetY);

        if (settings.camera_make_enabled && settings.camera_make) {
            ctx.fillText(settings.camera_make, offsetX + foreImgWidth * .01, offsetY + font.lineHeight);
        }

        if (settings.lens_info_enabled && settings.lens_info) {
            ctx.fillText(settings.lens_info, offsetX + foreImgWidth * .01, offsetY + (settings.camera_make_enabled && settings.camera_make ? font.lineHeight * 2 : font.lineHeight));
        }
    }

    if (settings.caption_enabled && settings.caption !== '') {
        font.font_family = settings.caption_fonts[settings.caption_font].font;
        font.font_url = settings.caption_fonts[settings.caption_font].font_url;

        ctx.letterSpacing = font.letterSpacing + 'px';
        ctx.font = 'bold ' + font.fontSize + 'px ' + font.font_family;
        ctx.textAlign = 'right';

        if (settings.image_rotation > 0 && settings.image_rotation < 360) {
            // Calculate the center of the image
            const centerX = offsetX + foreImgWidth / 2;
            const centerY = offsetY + foreImgHeight / 2;

            // Translate to the center, rotate, and translate back
            ctx.translate(centerX, centerY);
            ctx.rotate(settings.image_rotation * Math.PI / 180);
            ctx.translate(-centerX, -centerY);
        }

        ctx.fillText(settings.caption, offsetX + foreImgWidth, offsetY);
    }
};