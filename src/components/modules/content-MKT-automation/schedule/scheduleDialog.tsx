import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { formatDateTime, parseLocalDateTime } from "../../../../utils/formatters";
import { useBaiVietActions } from "../../../../hooks/useBaiViet";
import type { IBaiViet } from "../../../../types/bai_viet.type";
import { Calendar, Hash, FileText, Clock, CheckCircle2, Trash2, X } from "lucide-react";

const ScheduleDialog = ({ detailDialogOpen, setDetailDialogOpen, selectedBaiViet }: { detailDialogOpen: boolean, setDetailDialogOpen: (open: boolean) => void, selectedBaiViet: IBaiViet | null, setSelectedBaiViet: (baiViet: IBaiViet | null) => void }) => {
    const { remove } = useBaiVietActions()
    
    const getStatusBadge = (status: number) => {
        if (status === 9) {
            return (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30">
                    <Clock className="w-4 h-4 text-pink-400" />
                    <span className="text-pink-300 font-semibold">Đang chờ đăng</span>
                </div>
            );
        }
        if (status === 10) {
            return (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-semibold">Đã đăng bài</span>
                </div>
            );
        }
        return (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                <span className="text-blue-300 font-semibold">Trạng thái {status}</span>
            </div>
        );
    };

    return (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700">
                <DialogHeader className="border-b border-gray-700 pb-4">
                    <DialogTitle className="text-white font-bold text-2xl flex items-center gap-3">
                        {selectedBaiViet?.Tieu_de || 'Chi tiết bài viết'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Thông tin chi tiết về bài viết đã lên lịch
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    {/* ID và Ngày tạo - Grid 2 cột */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                                <Hash className="w-4 h-4 text-blue-400" />
                                Mã bài viết
                            </label>
                            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700 hover:border-blue-500/50 transition-colors">
                                <span className="text-gray-200 font-mono text-sm">{selectedBaiViet?.Bai_viet_id}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                Ngày tạo
                            </label>
                            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700 hover:border-purple-500/50 transition-colors">
                                <span className="text-gray-200 text-sm">
                                    {selectedBaiViet?.Ngay_tao ? formatDateTime(parseLocalDateTime(selectedBaiViet.Ngay_tao)) : '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Trạng thái */}
                    {selectedBaiViet?.Trang_thai !== undefined && selectedBaiViet?.Trang_thai !== null && (
                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                Trạng thái
                            </label>
                            <div className="flex items-start">
                                {getStatusBadge(selectedBaiViet.Trang_thai)}
                            </div>
                        </div>
                    )}

                    {/* Nội dung */}
                    {selectedBaiViet?.Noi_dung && (
                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-yellow-400" />
                                Nội dung bài viết
                            </label>
                            <div className="bg-gray-800/50 rounded-lg px-4 py-4 border border-gray-700 hover:border-yellow-500/50 transition-colors max-h-64 overflow-y-auto">
                                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                                    {selectedBaiViet.Noi_dung}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t border-gray-700 pt-4 gap-2">
                    <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
                        onClick={() => setDetailDialogOpen(false)}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Đóng
                    </Button>
                    <Button
                        variant="destructive"
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                        onClick={() => {
                            if (!selectedBaiViet) return;
                            void remove(String(selectedBaiViet.Bai_viet_id));
                            setDetailDialogOpen(false);
                        }}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa bài viết
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
 
export default ScheduleDialog;