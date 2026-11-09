const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.85;

export interface ProcessedImage {
  base64: string;
  mime: "image/jpeg";
  width: number;
  height: number;
  originalSize: number;
  processedSize: number;
}

export async function processImage(file: File): Promise<ProcessedImage> {
  const originalSize = file.size;

  const img = await loadImage(file);
  const { width, height } = scaleDimensions(img.width, img.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context alınamadı");

  ctx.drawImage(img, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  const base64 = dataUrl.split(",")[1];

  return {
    base64,
    mime: "image/jpeg",
    width,
    height,
    originalSize,
    processedSize: Math.round((base64.length * 3) / 4),
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Fotoğraf yüklenemedi"));
    };
    img.src = url;
  });
}

function scaleDimensions(w: number, h: number): { width: number; height: number } {
  if (w <= MAX_DIMENSION && h <= MAX_DIMENSION) {
    return { width: w, height: h };
  }

  if (w >= h) {
    return {
      width: MAX_DIMENSION,
      height: Math.round((h / w) * MAX_DIMENSION),
    };
  }

  return {
    width: Math.round((w / h) * MAX_DIMENSION),
    height: MAX_DIMENSION,
  };
}
