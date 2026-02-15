import exifr from 'exifr';
import {fractions} from '../utils/index.js';

/**
 * Loads an image from a blob or file
 * @param {Blob} blob - The image blob or file to load
 * @returns {Promise<Image>} - The loaded image
 */
export const loadImage = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = event.target.result;
        };

        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(blob);
    });
};

/**
 * Formats the camera make and model into a readable string
 * @param {Object} output - The EXIF data
 * @returns {string} - The formatted camera make and model
 */
export const formatCameraMake = (output) => {
    if (!output || !output.Make || !output.Model) return '';

    return (output.Make === 'NIKON CORPORATION' ? '' : (output.Make + ' ')) + output.Model;
};

/**
 * Formats exposure details into a readable string
 * @param {Object} output - The EXIF data
 * @returns {string} - The formatted exposure details
 */
export const formatExifData = (output) => {
    if (!output || !output.ExposureTime || !output.FNumber || !output.FocalLength || !output.ISO) {
        return '';
    }

    const exposureTime = output.ExposureTime < 0.1
        ? fractions(output.ExposureTime)
        : output.ExposureTime;

    return `${exposureTime} s • f/${output.FNumber} • ${output.FocalLength} mm • ISO ${output.ISO}`;
};

/**
 * Extracts EXIF data from an image file or blob
 * @param {Blob} blob - The image blob or file to process
 * @returns {Promise<Object>} - The extracted EXIF data in a formatted object
 */
export const processExif = async (blob) => {
    try {
        const file = await exifr.readBlobAsArrayBuffer(blob);
        const output = await exifr.parse(file);

        if (!output) {
            return {
                camera_make: '',
                lens_info: '',
                exif: '',
            };
        }

        return {
            camera_make: formatCameraMake(output),
            lens_info: output.LensModel || '',
            exif: formatExifData(output),
        };
    } catch (error) {
        console.error('Failed to process EXIF data:', error);
        return {
            camera_make: '',
            lens_info: '',
            exif: '',
        };
    }
};
