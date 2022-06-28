interface ConvertOptions {
  width: number;
  height: number;
  svg: SVGAElement;
}

export function convert(options: ConvertOptions): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const { width, height } = options;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const image = new Image();

    image.onload = () => {
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);

      resolve(canvas);
    };

    image.onerror = error => {
      reject(error);
    };
    image.src =
      'data:image/svg+xml;charset-utf-8,' +
      encodeURIComponent(options.svg.outerHTML);
  });
}
