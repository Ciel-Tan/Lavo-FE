import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Textarea } from '../../../ui/textarea';
import { Input } from '../../../ui/input';
import { Checkbox } from '../../../ui/checkbox';
import { useMemo, useState } from 'react';
import { useDongSanPhamList } from '../../../../hooks/useDongSanPham';
import { useSanPhamList } from '../../../../hooks/useSanPham';

interface CreateWeekDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateWeek: (newWeek: {
    Tuan_id: string;
    Tuan_nd: string;
    Tieu_de: string;
    Ngay_bat_dau: string;
    Ngay_ket_thuc: string;
    Phan_hoi_noi_bo: string;
    Muc_tieu: string;
    Su_cu_the: string;
    Tinh_kha_thi: string;
    Muc_do_lien_quan: string;
    Trang_thai: number;
  }, selectedSkus: string[]) => void;
}

export default function CreateWeekDialog({ open, onOpenChange, onCreateWeek }: CreateWeekDialogProps) {
  const [dialogStep, setDialogStep] = useState(1);
  const [selectedProductLine, setSelectedProductLine] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [googleSheetLink, setGoogleSheetLink] = useState('');
  const [weekContent, setWeekContent] = useState('');
  const [objective, setObjective] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<{ suCuThe: string; tinhKhaThi: string; mucDoLienQuan: string; thoiGian: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { items: productLines } = useDongSanPhamList();
  const { items: products } = useSanPhamList();

  const filteredProducts = useMemo(() => (
    selectedProductLine ? products.filter(p => p.Dong_san_pham.Dong_sp_id === selectedProductLine) : products
  ), [products, selectedProductLine]);

  const handleProductToggle = (sku: string) => {
    setSelectedProducts(prev => prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]);
  };

  const handleAnalyzeObjective = async () => {
    if (!objective.trim()) return;
    setIsAnalyzing(true);

    const mockAnalysis = {
      suCuThe: `Mục tiêu: "${objective}" với ${selectedProducts.length} sản phẩm được chọn. Yêu cầu rõ ràng và có tiêu chí đo lường (tăng tương tác/doanh số).`,
      tinhKhaThi: selectedProducts.length > 0 ? 'Khả thi nếu phân bổ nội dung theo tuần và kênh phù hợp.' : 'Cần chọn sản phẩm và dữ liệu đầu vào rõ ràng hơn.',
      mucDoLienQuan: googleSheetLink ? 'Cao (đã có dữ liệu phản hồi nội bộ để tham chiếu).' : 'Trung bình (thiếu dữ liệu phản hồi nội bộ).',
      thoiGian: '4 tuần triển khai, review mỗi tuần, tối ưu theo hiệu suất.'
    };

    try {
      const response = await fetch('/api/analyze-objective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective,
          googleSheetLink,
          selectedProducts: selectedProducts.map(sku => products.find(p => p.Ma_SKU === sku))
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data?.analysis ?? mockAnalysis);
      } else {
        setAiAnalysis(mockAnalysis);
      }
    } catch (_error) {
      setAiAnalysis(mockAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetDialog = () => {
    setDialogStep(1);
    setSelectedProductLine('');
    setSelectedProducts([]);
    setGoogleSheetLink('');
    setWeekContent('');
    setObjective('');
    setAiAnalysis(null);
    setIsAnalyzing(false);
  };

  const handleConfirm = () => {
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + (8 - today.getDay()) % 7);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    const newWeek = {
      Tuan_id: `TUAN${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`,
      Tuan_nd: weekContent || `Nội dung tuần mới`,
      Tieu_de: objective || `Kế hoạch nội dung tuần mới`,
      Ngay_bat_dau: nextMonday.toISOString().split('T')[0],
      Ngay_ket_thuc: nextSunday.toISOString().split('T')[0],
      Phan_hoi_noi_bo: googleSheetLink || 'Chưa có phản hồi',
      Muc_tieu: objective || 'Mục tiêu tuần mới',
      Su_cu_the: aiAnalysis?.suCuThe || 'Chưa phân tích',
      Tinh_kha_thi: aiAnalysis?.tinhKhaThi || 'Chưa phân tích',
      Muc_do_lien_quan: aiAnalysis?.mucDoLienQuan || 'Chưa phân tích',
      Trang_thai: 0,
    };

    onCreateWeek(newWeek, selectedProducts);
    onOpenChange(false);
    resetDialog();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(openVal) => {
        onOpenChange(openVal);
        if (!openVal) resetDialog();
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] bg-white dark:bg-[#1a1a1a] border-gray-700 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">Định hướng nội dung</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {dialogStep === 1 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Thời gian</label>
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-4 py-3 rounded-lg">(Hệ thống tự động set)</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Tuần nội dung</label>
                <Input
                  type="text"
                  placeholder="Nhập tên tuần nội dung (ví dụ: Tuần ra mắt Q1)"
                  value={weekContent}
                  onChange={(e) => setWeekContent(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  data-testid="input-week-content"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Dòng sản phẩm cần đẩy mạnh</label>
                <Select value={selectedProductLine} onValueChange={setSelectedProductLine}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Chọn dòng sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {productLines.map((line) => (
                      <SelectItem key={line.Dong_sp_id} value={line.Dong_sp_id}>
                        {line.Ten_dong_sp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProductLine && filteredProducts.length > 0 && (
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-300 dark:border-gray-600">SKU</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-300 dark:border-gray-600">Tên SP</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white w-20"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product, index) => (
                        <tr key={product.Ma_SKU} className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-300 dark:border-gray-600">{product.Ma_SKU}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white border-r border-gray-300 dark:border-gray-600">{product.Ten}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={selectedProducts.includes(product.Ma_SKU)}
                                onCheckedChange={() => handleProductToggle(product.Ma_SKU)}
                                className="w-6 h-6 border-2 border-gray-400 dark:border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                data-testid={`checkbox-product-${index}`}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold" disabled={selectedProducts.length === 0} onClick={() => setDialogStep(2)} data-testid="button-next">
                  Tiếp theo
                </Button>
              </div>
            </>
          )}

          {dialogStep === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Tải lên dữ liệu phản hồi nội bộ của KH về sản phẩm</label>
                <Input
                  type="url"
                  placeholder="Link Google Sheet (open access)..."
                  value={googleSheetLink}
                  onChange={(e) => setGoogleSheetLink(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  data-testid="input-sheet-link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Mục tiêu<span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Nhập mục tiêu ..."
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white min-h-[100px]"
                  data-testid="textarea-objective"
                />
                <Button onClick={handleAnalyzeObjective} disabled={!objective.trim() || isAnalyzing} className="bg-blue-600 hover:bg-blue-700 text-white mt-2 px-6" data-testid="button-save-analyze">
                  {isAnalyzing ? 'Đang phân tích...' : 'Lưu'}
                </Button>
              </div>

              {aiAnalysis && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white italic">*AI phân tích mục tiêu</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sự cụ thể</label>
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm">{aiAnalysis.suCuThe}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tính khả thi</label>
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm">{aiAnalysis.tinhKhaThi}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mức độ liên quan</label>
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm">{aiAnalysis.mucDoLienQuan}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thời gian</label>
                    <div className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm">{aiAnalysis.thoiGian}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button onClick={() => setDialogStep(1)} className="bg-blue-600 hover:bg-blue-700 text-white px-8" data-testid="button-back">
                  Trước
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8" disabled={!aiAnalysis} onClick={handleConfirm} data-testid="button-confirm">
                  Xác nhận
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
