import { useEffect } from 'react';
import { Dialog, DialogContent } from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  index: number;
  onIndexChange: (next: number) => void;
}

export default function ImagePreviewDialog({ open, onOpenChange, images, index, onIndexChange }: ImagePreviewDialogProps) {
  const safeIndex = Math.max(0, Math.min(index, Math.max(0, images.length - 1)));
  const goPrev = () => images.length > 0 && onIndexChange((safeIndex - 1 + images.length) % images.length);
  const goNext = () => images.length > 0 && onIndexChange((safeIndex + 1) % images.length);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, safeIndex, images.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl bg-black/90">
        <div className="w-full flex items-center gap-4">
          <Button type="button" onClick={goPrev} className="p-3 rounded-full bg-white/90 hover:bg-white">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </Button>
          <div className="flex-1">
            {images.length > 0 && (
              <img src={images[safeIndex]} alt="preview" className="w-full h-auto object-contain" />
            )}
          </div>
          <Button type="button" onClick={goNext} className="p-3 rounded-full bg-white/90 hover:bg-white">
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


