import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Textarea } from '../../../ui/textarea';
import { Button } from '../../../ui/button';

interface ImageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remainingEdits: number;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
}

export default function ImageEditDialog({ open, onOpenChange, remainingEdits, value, onChange, onConfirm }: ImageEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-semibold">Vui lòng nhập yêu cầu chỉnh sửa hình ảnh</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">{`Mỗi ảnh chỉ được chỉnh sửa tối đa 2 lần. Lần còn lại: ${remainingEdits}/2`}</div>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ví dụ: Làm sáng nền, chỉnh màu sắc, xóa vật thể ở góc trái..."
            className="min-h-[140px] border border-gray-300 text-gray-900 resize-none"
          />
          <div className="flex justify-end space-x-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              onClick={() => onOpenChange(false)}
              variant="outline"
            >
              Hủy
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              disabled={value.trim().length === 0 || remainingEdits <= 0}
              onClick={onConfirm}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


