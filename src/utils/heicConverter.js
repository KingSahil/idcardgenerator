import heic2any from 'heic2any';

/**
 * Converts a file to an Image object. Handles HEIC/HEIF format conversion for iOS uploads.
 * @param {File} file 
 * @returns {Promise<{img: HTMLImageElement, url: string}>}
 */
export async function processImageFile(file) {
  return new Promise(async (resolve, reject) => {
    let imageBlob = file;
    const fileName = file.name.toLowerCase();

    // Check if image is HEIC/HEIF
    if (fileName.endsWith('.heic') || fileName.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif') {
      try {
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9
        });
        imageBlob = Array.isArray(converted) ? converted[0] : converted;
      } catch (err) {
        console.warn('HEIC conversion warning, attempting direct read:', err);
      }
    }

    const objectUrl = URL.createObjectURL(imageBlob);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      resolve({ img, url: objectUrl, width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load uploaded image. Please try a different photo format.'));
    };

    img.src = objectUrl;
  });
}
