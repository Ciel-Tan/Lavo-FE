import type { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Textarea } from '../../../ui/textarea';
import { Button } from '../../../ui/button';

interface ReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  description?: ReactNode;
}

export default function ReasonDialog(props: ReasonDialogProps) {
  const {
    open,
    onOpenChange,
    title,
    value,
    onChange,
    onConfirm,
    confirmDisabled,
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Hủy',
    description,
  } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-semibold text-center text-lg">{title}</DialogTitle>
        </DialogHeader>
        <div>
          {description}
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="...."
            className="min-h-[200px] border border-gray-300 text-gray-900 resize-none"
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              variant="outline"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              disabled={!!confirmDisabled}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


