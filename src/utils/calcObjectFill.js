export const dimsCover = (img, x, y, width, height, scale = 1) => {
    const imageRatio = img.width / img.height;
    const containerRatio = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imageRatio > containerRatio) {
        drawWidth = height * imageRatio * scale;
        drawHeight = height * scale;
    } else {
        drawWidth = width * scale;
        drawHeight = (width / imageRatio) * scale;
    }

    offsetX = (width - drawWidth) / 2;
    offsetY = (height - drawHeight) / 2;

    return {drawWidth, drawHeight, offsetX, offsetY}
}

export const dimsContain = (img, x, y, width, height, scale = 1) => {
    const imageRatio = img.width / img.height;
    const containerRatio = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imageRatio > containerRatio) {
        drawWidth = width * scale;
        drawHeight = (width / imageRatio) * scale;
    } else {
        drawWidth = height * imageRatio * scale;
        drawHeight = height * scale;
    }

    offsetX = (width - drawWidth) / 2;
    offsetY = (height - drawHeight) / 2;

    return {drawWidth, drawHeight, offsetX, offsetY}
}

export const drawImageCover = (ctx, img, x, y, width, height, scale = 1) => {
    const {drawWidth, drawHeight, offsetX, offsetY} = dimsCover(img, x, y, width, height, scale)

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
}

export const drawImageContain = (ctx, img, x, y, width, height, scale = 1) => {
    const {drawWidth, drawHeight, offsetX, offsetY} = dimsContain(img, x, y, width, height, scale);

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
}