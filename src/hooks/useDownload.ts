import { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';

export function useDownload() {
  const downloadRef = useRef<HTMLDivElement>(null);

  const download = useCallback(async (filename: string) => {
    if (downloadRef.current === null) return;

    try {
      const dataUrl = await toPng(downloadRef.current, {
        cacheBust: true,
        pixelRatio: 4, // Ultra high quality for social media
        backgroundColor: 'transparent',
      });


      const link = document.createElement('a');
      link.download = `${filename}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
    }
  }, []);


  return { downloadRef, download };
}
