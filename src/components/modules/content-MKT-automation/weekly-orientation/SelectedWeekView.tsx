import { useEffect, useState } from 'react';
import { Button } from '../../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Textarea } from '../../../ui/textarea';
import { Calendar as CalendarIcon, Check, FileText, Image as ImageIcon, RefreshCw, Wand2, Video, Pencil, ArrowLeft } from 'lucide-react';
import ProgressSteps from './ProgressSteps';
import ReasonDialog from './ReasonDialog';
import StatusBadge from './StatusBadge';
import ScheduleForm from './ScheduleForm';
import ImagePreviewDialog from './ImagePreviewDialog';
import ImageEditDialog from './ImageEditDialog';
import SlideSection from './SlideSection';
import PostStatusButton from './PostStatusButton';
import PostDraftLabel from './PostDraftLabel';
import { useBaiVietList } from '../../../../hooks/useBaiViet';
import { useNenTangList, usePhuongThucDangList, useDinhDangList } from '../../../../hooks/useOther';
import { useSEOContent, usePostVideoContent } from '../../../../hooks/useN8N';
import { LoadingOverlay } from '../../../ui/loading';
import { useAppDispatch } from '../../../../store';
import { fetchBaiVietByTuanId } from '../../../../store/bai_viet.slice';
import { useSocket } from '../../../../hooks/useSocket';
import { upsertTuan } from '../../../../store/tuan.slice';

type PostContentStatus = 'proposal' | 'generating' | 'generated' | 'assetGenerating' | 'assetGenerated' | 'finalGenerating' | 'finalGenerated' | 'waitingSchedule' | 'pendingPost';

interface SelectedWeekViewProps {
  selectedWeek: string;
  onBack: () => void;
}

export default function SelectedWeekView(props: SelectedWeekViewProps) {
  const {
    selectedWeek,
    onBack,
  } = props;

  const [postStatusById, setPostStatusById] = useState<Record<string, PostContentStatus>>({});
  const [postAssetsById, setPostAssetsById] = useState<Record<string, string[]>>({});
  const [postVideosById, setPostVideosById] = useState<Record<string, { demo?: string; final?: string }>>({});
  const [confirmModeById, setConfirmModeById] = useState<Record<string, boolean>>({});
  const [platformById, setPlatformById] = useState<Record<string, number | undefined>>({});
  const [postingMethodById, setPostingMethodById] = useState<Record<string, number | undefined>>({});
  const [scheduleDateById, setScheduleDateById] = useState<Record<string, string>>({});
  const [scheduleTimeById, setScheduleTimeById] = useState<Record<string, string>>({});
  const [scheduledAtById, setScheduledAtById] = useState<Record<string, string | undefined>>({});
  const [preview, setPreview] = useState<{ postId: string; index: number } | null>(null);
  const [editImageForPost, setEditImageForPost] = useState<{ postId: string; imageIndex: number } | null>(null);
  const [editInstructions, setEditInstructions] = useState<string>('');
  const [editCountsByPostImage, setEditCountsByPostImage] = useState<Record<string, number>>({});
  const [draftEditForPost, setDraftEditForPost] = useState<{ postId: string } | null>(null);
  const [draftEditInstructions, setDraftEditInstructions] = useState<string>('');

  const [weekPosts, setWeekPosts] = useState<any[]>([]);
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleGeneratePosts = async () => {
    setIsGeneratingPosts(true);
    try {
      // Kick off fetch (no-op if API not ready)
      dispatch(fetchBaiVietByTuanId(selectedWeek));

      // Generate local mock posts for testing
      const nowIso = new Date().toISOString();
      const mocks = [
        {
          Bai_viet_id: `${selectedWeek}-IMG-001`,
          Tuan_id: selectedWeek,
          Dinh_dang_id: 1,
          Dinh_dang: { Dinh_dang_id: 1, Loai: 'Image Post' },
          Tieu_de: 'Social Post: Ra mắt bộ sản phẩm mới Lavox năm 2025',
          Ngay_tao: nowIso,
          Y_tuong: 'Giới thiệu sản phẩm + hình minh họa packshot.',
          Ly_do_lua_chon: 'Tăng nhận diện sản phẩm trong tuần ra mắt.',
          Trang_thai: 1,
          Nen_tang_id: 2,
          Ptd_id: 2,
        },
        {
          Bai_viet_id: `${selectedWeek}-SEO-001`,
          Tuan_id: selectedWeek,
          Dinh_dang_id: 2,
          Dinh_dang: { Dinh_dang_id: 2, Loai: 'SEO Blog' },
          Tieu_de: 'SEO Blog: Hướng dẫn tẩy – nhuộm an toàn cho salon',
          Ngay_tao: nowIso,
          Y_tuong: 'Bài dài 1500 từ cho từ khóa chính.',
          Ly_do_lua_chon: 'Kéo traffic bền vững từ Google.',
          Trang_thai: 1,
          Nen_tang_id: 1,
          Ptd_id: 1,
        },
        {
          Bai_viet_id: `${selectedWeek}-VID-001`,
          Tuan_id: selectedWeek,
          Dinh_dang_id: 3,
          Dinh_dang: { Dinh_dang_id: 3, Loai: 'Short Video' },
          Tieu_de: 'Short Video: 5 mẹo tạo phồng tóc nam với M.Pros',
          Ngay_tao: nowIso,
          Y_tuong: 'Series mẹo nhanh dưới 30s cho thợ cắt tóc.',
          Ly_do_lua_chon: 'Tăng tương tác video ngắn.',
          Trang_thai: 1,
          Nen_tang_id: 3,
          Ptd_id: 1,
        },
      ];

      // Set local posts for this week
      setWeekPosts(mocks as any[]);

      // Initialize status map for the mocks
      setPostStatusById((prev) => {
        const next = { ...prev } as Record<string, PostContentStatus>;
        for (const p of mocks) {
          next[String(p.Bai_viet_id)] = 'proposal';
        }
        return next;
      });

      // Notify others this week is now in progress
      if (socket) {
        socket.emit('tuan:update', { Tuan_id: selectedWeek, Trang_thai: 2 });

        // Simulate a realtime post status update to 'generated' for testing
        setTimeout(() => {
          for (const p of mocks) {
            socket.emit('bai_viet:update', {
              Bai_viet_id: p.Bai_viet_id,
              Tuan_id: p.Tuan_id,
              status: 3, // Đã tạo nội dung
            });
          }
        }, 1200);
      }
      // Also update local Redux so Calendar reflects immediately
      dispatch(upsertTuan({ Tuan_id: selectedWeek, Trang_thai: 2 } as any));
    } finally {
      setIsGeneratingPosts(false);
    }
  };

  const dispatch = useAppDispatch();
  const { items: postsFromApi, loading: loadingPosts, error: errorPosts } = useBaiVietList(false);
  const { items: platformsFromApi, loading: loadingPlatforms, error: errorPlatforms } = useNenTangList();
  const { items: postingMethodsFromApi, loading: loadingMethods, error: errorMethods } = usePhuongThucDangList();
  const { items: formatsFromApi, loading: loadingFormats, error: errorFormats } = useDinhDangList();
  const { socket } = useSocket();
  const { fetch: fetchSEOContent } = useSEOContent();
  const { fetch: fetchPostVideoContent } = usePostVideoContent();

  const platformOptions = (platformsFromApi || []).map((p) => ({
    Nen_tang_id: p.Nen_tang_id,
    Loai: p.Loai ?? 'Nền tảng',
  }));
  const postingMethodOptions = (postingMethodsFromApi || []).map((m) => ({
    Ptd_id: m.Ptd_id,
    Loai_dang: m.Loai_dang ?? 'Phương thức đăng',
  }));

  useEffect(() => {
    if (selectedWeek) {
      setIsGeneratingPosts(true);
      dispatch(fetchBaiVietByTuanId(selectedWeek)).finally(() => setIsGeneratingPosts(false));
    }
  }, [selectedWeek, dispatch]);

  useEffect(() => {
    // Enrich posts with Dinh_dang label and map fields used by UI
    const formatById = new Map<number, string | null>();
    for (const f of formatsFromApi || []) {
      if (typeof f.Dinh_dang_id === 'number') formatById.set(f.Dinh_dang_id, f.Loai ?? null);
    }
    const list = postsFromApi || [];
    if (list.length === 0) return; // keep local mocks if API is empty
    const enriched = list
      .filter((p) => !p.Tuan_id || String(p.Tuan_id) === String(selectedWeek))
      .map((p: any) => ({
        ...p,
        Dinh_dang: {
          Dinh_dang_id: p.Dinh_dang_id,
          Loai: formatById.get(Number(p.Dinh_dang_id)) || (p?.Dinh_dang?.Loai ?? 'Khác'),
        },
        Y_tuong: p.Y_tuong ?? p.Y_tuong_de_xuat ?? '',
      }));
    setWeekPosts(enriched as any[]);
  }, [postsFromApi, formatsFromApi, selectedWeek]);

  useEffect(() => {
    if (!socket || !selectedWeek) return;

    socket.emit('tuan:join', selectedWeek);

    const normalizeStatus = (val: any): PostContentStatus => {
      if (typeof val === 'string') {
        const s = val as PostContentStatus;
        if (
          s === 'proposal' || s === 'generating' || s === 'generated' ||
          s === 'assetGenerating' || s === 'assetGenerated' ||
          s === 'finalGenerating' || s === 'finalGenerated' || s === 'waitingSchedule'
        ) return s;
      }
      switch (Number(val ?? 1)) {
        case 1: return 'proposal';
        case 2: return 'generating';
        case 3: return 'generated';
        case 4: return 'assetGenerating';
        case 5: return 'assetGenerated';
        case 6: return 'finalGenerating';
        case 7: return 'finalGenerated';
        case 8: return 'waitingSchedule';
        case 9: return 'pendingPost';
        case 10: return 'pendingPost'; // map 'Đã đăng bài' to closest supported state
        default: return 'proposal';
      }
    };

    const handlePostUpdate = (payload: any) => {
      if (!payload) return;
      const postId = String(payload.Bai_viet_id || payload.BaiVietId || payload.id || '');
      if (!postId) return;

      // Update status
      if (payload.Trang_thai !== undefined || payload.status !== undefined) {
        const next = normalizeStatus(payload.Trang_thai ?? payload.status);
        const current = postStatusById[postId] ?? 'proposal';
        const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
        setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
        setAnimateOnNextById((prev) => ({ ...prev, [postId]: true }));
        setPostStatusById((prev) => ({ ...prev, [postId]: next }));
      }

      // Update assets (images)
      if (Array.isArray(payload.assets)) {
        setPostAssetsById((prev) => ({ ...prev, [postId]: payload.assets as string[] }));
      }

      // Update videos
      if (payload.video && (payload.video.demo || payload.video.final)) {
        setPostVideosById((prev) => ({ ...prev, [postId]: { ...(prev[postId] || {}), ...payload.video } }));
      }

      // Shallow merge other fields into weekPosts if exists
      setWeekPosts((prev) => {
        const idx = prev.findIndex((p) => String(p.Bai_viet_id) === postId);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = { ...next[idx], ...payload.patch, ...payload };
        return next;
      });
    };

    socket.on('bai_viet:update', handlePostUpdate);

    return () => {
      socket.emit('tuan:leave', selectedWeek);
      socket.off('bai_viet:update', handlePostUpdate);
    };
  }, [socket, selectedWeek, postStatusById]);

  // Ordered steps to infer forward/backward animation direction
  const STATUS_STEPS: PostContentStatus[] = [
    'proposal',
    'generating',
    'generated',
    'assetGenerating',
    'assetGenerated',
    'finalGenerating',
    'finalGenerated',
    'waitingSchedule',
    'pendingPost',
  ];

  const [transitionDirById, setTransitionDirById] = useState<Record<string, 'forward' | 'backward'>>({});
  const [animateOnNextById, setAnimateOnNextById] = useState<Record<string, boolean>>({});

  const getSlideClassFor = (postId: string): string => {
    if (!animateOnNextById[postId]) return '';
    const dir = transitionDirById[postId] ?? 'forward';
    return dir === 'forward'
      ? 'animate-in fade-in slide-in-from-right-6 duration-300'
      : 'animate-in fade-in slide-in-from-left-6 duration-300';
  };

  const STATUS_LABELS: Record<PostContentStatus, string> = {
    proposal: 'Đề xuất',
    generating: 'Tạo nội dung',
    generated: 'Nội dung',
    assetGenerating: 'Tạo tài sản',
    assetGenerated: 'Tài sản',
    finalGenerating: 'Tạo Final Video',
    finalGenerated: 'Final Video',
    waitingSchedule: 'Xếp lịch',
    pendingPost: 'Chờ đăng',
  };

  const getStepsForPost = (post: any): PostContentStatus[] => {
    const isVideo = post?.Dinh_dang?.Loai === 'Short Video';
    return isVideo
      ? ['proposal', 'generating', 'generated', 'assetGenerating', 'assetGenerated', 'finalGenerating', 'finalGenerated', 'waitingSchedule']
      : ['proposal', 'generating', 'generated', 'assetGenerating', 'assetGenerated', 'waitingSchedule'];
  };
  
  useEffect(() => {
    const mapNumberToStatus = (n: number | null | undefined): PostContentStatus => {
      switch (Number(n ?? 1)) {
        case 1: return 'proposal';
        case 2: return 'generating';
        case 3: return 'generated';
        case 4: return 'assetGenerating';
        case 5: return 'assetGenerated';
        case 6: return 'finalGenerating';
        case 7: return 'finalGenerated';
        case 8: return 'waitingSchedule';
        case 9: return 'pendingPost';
        case 10: return 'pendingPost'; // map 'Đã đăng bài' to closest supported state
        default: return 'proposal';
      }
    };
    setPostStatusById((previousStatusById) => {
      const nextStatusById = { ...previousStatusById } as Record<string, PostContentStatus>;
      for (const post of weekPosts) {
        const postId = String(post.Bai_viet_id);
        if (!nextStatusById[postId]) {
          nextStatusById[postId] = mapNumberToStatus(post.Trang_thai);
        }
      }
      return nextStatusById;
    });
  }, [weekPosts]);

  

  const mockGenerateAssets = (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleApprovePost = async (post: any) => {
    if (!post) return;
    const postId = String(post.Bai_viet_id);
    {
      const current = postStatusById[postId] ?? 'proposal';
      const next: PostContentStatus = 'generating';
      const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
      setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
      setAnimateOnNextById((prev) => ({ ...prev, [postId]: false })); // disable slide during generating
      setPostStatusById((prev) => ({ ...prev, [postId]: next }));
    }
    // Inform backend via socket to persist state 1 -> 2
    if (socket) {
      socket.emit('bai_viet:update', {
        Bai_viet_id: postId,
        Tuan_id: post?.Tuan_id ?? selectedWeek,
        Trang_thai: 2,
      });
    }
    try {
      // Trigger n8n generation based on format
      const loai: string | undefined = post?.Dinh_dang?.Loai;
      if (loai === 'SEO Blog') {
        await fetchSEOContent({
          Bai_viet_id: postId,
          Tieu_de: post?.Tieu_de ?? '',
          Tu_khoa: post?.Tu_khoa ?? '',
          Y_tuong_de_xuat: post?.Y_tuong ?? post?.Y_tuong_de_xuat ?? '',
          Ly_do_lua_chon: post?.Ly_do_lua_chon ?? '',
        });
      } else {
        await fetchPostVideoContent({
          Bai_viet_id: postId,
          Goc_tiep_can: post?.Goc_tiep_can ?? '',
          Noi_dung_phan_giai: post?.Noi_dung_phan_giai ?? '',
          Tieu_de: post?.Tieu_de ?? '',
          Y_tuong_de_xuat: post?.Y_tuong ?? post?.Y_tuong_de_xuat ?? '',
          Ly_do_lua_chon: post?.Ly_do_lua_chon ?? '',
        });
      }
      // Move 2 -> 3 via socket after n8n completes
      if (socket) {
        socket.emit('bai_viet:update', {
          Bai_viet_id: postId,
          Tuan_id: post?.Tuan_id ?? selectedWeek,
          Trang_thai: 3,
        });
      } else {
        // Fallback local transition if socket unavailable
        const current = postStatusById[postId] ?? 'generating';
        const next: PostContentStatus = 'generated';
        const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
        setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
        setAnimateOnNextById((prev) => ({ ...prev, [postId]: true }));
        setPostStatusById((prev) => ({ ...prev, [postId]: next }));
      }
    }
    finally {
    }
  };

  const handleApproveAssets = async (post: any) => {
    if (!post) return;
    const postId = String(post.Bai_viet_id);
    {
      const current = postStatusById[postId] ?? 'generated';
      const next: PostContentStatus = 'assetGenerating';
      const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
      setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
      setAnimateOnNextById((prev) => ({ ...prev, [postId]: false }));
      setPostStatusById((prev) => ({ ...prev, [postId]: next }));
    }
    try {
      await mockGenerateAssets();
      const isVideo = post.Dinh_dang.Loai === 'Short Video';
      if (!isVideo) {
        const numImages = post.Dinh_dang.Loai === 'SEO Blog' ? 4 : 1;
        const images = Array.from({ length: numImages }).map((_, i) => `https://picsum.photos/seed/${postId}-${i}/800/450`);
        setPostAssetsById((prev) => ({ ...prev, [postId]: images }));
        {
          const current = postStatusById[postId] ?? 'assetGenerating';
          const next: PostContentStatus = 'assetGenerated';
          const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
          setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
          setAnimateOnNextById((prev) => ({ ...prev, [postId]: true }));
          setPostStatusById((prev) => ({ ...prev, [postId]: next }));
        }
      } else {
        setPostVideosById((prev) => ({ ...prev, [postId]: { demo: `https://example.com/demo/${postId}.mp4` } }));
        {
          const current = postStatusById[postId] ?? 'assetGenerating';
          const next: PostContentStatus = 'assetGenerated';
          const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
          setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
          setAnimateOnNextById((prev) => ({ ...prev, [postId]: true }));
          setPostStatusById((prev) => ({ ...prev, [postId]: next }));
        }
      }
    }
    finally {
    }
  };

  const handleApproveFinalVideo = async (post: any) => {
    if (!post) return;
    const postId = String(post.Bai_viet_id);
    {
      const current = postStatusById[postId] ?? 'assetGenerated';
      const next: PostContentStatus = 'finalGenerating';
      const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
      setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
      setAnimateOnNextById((prev) => ({ ...prev, [postId]: false }));
      setPostStatusById((prev) => ({ ...prev, [postId]: next }));
    }
    try {
      await mockGenerateAssets();
      setPostVideosById((prev) => ({ ...prev, [postId]: { ...(prev[postId] || {}), final: `https://example.com/final/${postId}.mp4` } }));
      {
        const current = postStatusById[postId] ?? 'finalGenerating';
        const next: PostContentStatus = 'finalGenerated';
        const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
        setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
        setAnimateOnNextById((prev) => ({ ...prev, [postId]: true }));
        setPostStatusById((prev) => ({ ...prev, [postId]: next }));
      }
    }
    finally {
    }
  };

  const enterConfirmMode = (post: any) => {
    if (!post) return;
    const postId = String(post.Bai_viet_id);
    setConfirmModeById((prev) => ({ ...prev, [postId]: true }));
  };

  const handleConfirmSchedule = (post: any) => {
    if (!post) return;
    const postId = String(post.Bai_viet_id);
    {
      // Save schedule on confirm if date/time provided
      const d = scheduleDateById[postId];
      const t = scheduleTimeById[postId];
      if (d && t) {
        const iso = combineDateTimeToISO(d, t);
        setScheduledAtById((prev) => ({ ...prev, [postId]: iso }));
      }

      const current = postStatusById[postId] ?? 'assetGenerated';
      const next: PostContentStatus = 'pendingPost';
      const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
      setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
      setAnimateOnNextById((prev) => ({ ...prev, [postId]: true }));
      setPostStatusById((prev) => ({ ...prev, [postId]: next }));
    }
    setConfirmModeById((prev) => ({ ...prev, [postId]: false }));
    setSelectedPost(null);
  };

  const combineDateTimeToISO = (dateStr: string, timeStr: string): string => {
    return new Date(`${dateStr}T${timeStr}:00`).toISOString();
  };

  return (
    <div className="space-y-6 relative">
      <LoadingOverlay show={!!(loadingPosts || loadingPlatforms || loadingMethods || loadingFormats || isGeneratingPosts)} />
      
      {/* Back Button - Separated */}
      <div className="mb-4">
          <Button
            variant="outline"
            onClick={onBack}
          className="border border-gray-600/50 text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-500 px-4 py-2 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
            data-testid="button-back-to-calendar"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại Lịch tuần
          </Button>
      </div>

      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        {/* Title - Prominent */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            Nội dung {selectedWeek}
          </h1>
          <p className="text-gray-400 text-sm">
            Quản lý và duyệt các bài viết trong tuần
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {weekPosts.length > 0 && (
            <Button
              onClick={handleGeneratePosts}
              disabled={isGeneratingPosts}
              className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50"
              data-testid="button-create-more"
            >
              {isGeneratingPosts ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 inline-block animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2 inline-block" />
                  Tạo thêm đề xuất
                </>
              )}
            </Button>
          )}
          <Button variant="outline" className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 px-6 py-3 rounded-xl font-medium transition-all duration-200" data-testid="button-filter">
            Lọc
          </Button>
        </div>
      </div>

      {(errorPosts || errorPlatforms || errorMethods || errorFormats) && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 text-red-300 px-4 py-3 space-y-1">
          {errorPosts && <div>Lỗi tải bài viết: {String(errorPosts)}</div>}
          {errorPlatforms && <div>Lỗi tải nền tảng: {String(errorPlatforms)}</div>}
          {errorMethods && <div>Lỗi tải phương thức đăng: {String(errorMethods)}</div>}
          {errorFormats && <div>Lỗi tải định dạng: {String(errorFormats)}</div>}
        </div>
      )}

      <div className="space-y-4">
        <div className={`grid gap-6 ${selectedPost ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>

            <div className="relative grid grid-cols-4 gap-4 px-8 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 border-b border-blue-400/30">
              <div className="text-white font-bold flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4" />
                <span>Ngày khởi tạo</span>
              </div>
              <div className="text-white font-bold flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Tiêu đề</span>
              </div>
              <div className="text-white font-bold flex items-center space-x-2 justify-center">
                <ImageIcon className="w-4 h-4" />
                <span>Định dạng</span>
              </div>
              <div className="text-white font-bold flex items-center space-x-2 justify-center">
                <Check className="w-4 h-4" />
                <span>Trạng thái</span>
              </div>
            </div>

            {weekPosts.length === 0 ? (
              <div className="relative flex flex-col items-center justify-center py-20 bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50">
                {isGeneratingPosts ? (
                  <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-500">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                      <RefreshCw className="relative w-16 h-16 text-blue-400 animate-spin" />
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-blue-300 text-xl font-semibold">Đang tạo đề xuất...</p>
                      <p className="text-gray-400 text-sm">AI đang phân tích và tạo nội dung cho bạn</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-500">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                      <Button
                        onClick={handleGeneratePosts}
                        className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 rounded-xl font-bold text-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                        data-testid="button-start-generate"
                      >
                        <Wand2 className="w-6 h-6 mr-3 inline-block" />
                        Bắt đầu tạo đề xuất
                      </Button>
                    </div>
                    <p className="text-gray-400 text-sm">AI sẽ tạo nội dung dựa trên mục tiêu và phản hồi</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm">
                {weekPosts.map((post, index) => (
                  <div
                    key={post.Bai_viet_id}
                    onClick={() => setSelectedPost(post)}
                    className="cursor-pointer group grid grid-cols-4 gap-4 px-8 py-5 border-b border-gray-700/50 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                    data-testid={`row-post-${index}`}
                  >
                    <div className="flex items-center space-x-3 text-gray-300 group-hover:text-white transition-colors">
                      <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-blue-400"></div>
                      <span className="font-medium">
                        {new Date(post.Ngay_tao).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                      {post.Tieu_de}
                    </div>
                    <div className="justify-center items-center flex">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all duration-300 group-hover:scale-105 ${
                          post.Dinh_dang.Loai === 'Image Post'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30'
                            : post.Dinh_dang.Loai === 'SEO Blog'
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-yellow-500/30'
                            : 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-red-500/30'
                        }`}
                      >
                        {post.Dinh_dang.Loai === 'Image Post' && <ImageIcon className="w-3.5 h-3.5 mr-1.5" />}
                        {post.Dinh_dang.Loai === 'SEO Blog' && <FileText className="w-3.5 h-3.5 mr-1.5" />}
                        {post.Dinh_dang.Loai === 'Short Video' && <Video className="w-3.5 h-3.5 mr-1.5" />}
                        {post.Dinh_dang.Loai}
                      </span>
                    </div>
                    <div className="justify-center items-center flex">
                      {(() => {
                        const postId = String(post.Bai_viet_id);
                        const status: PostContentStatus = postStatusById[postId] ?? 'proposal';
                        const isVideo = post.Dinh_dang.Loai === 'Short Video';
                        return <StatusBadge status={status} isVideo={isVideo} index={index} />;
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700">
          <DialogHeader className="border-b border-gray-700 pb-4">
            <DialogTitle className="text-white font-bold text-2xl flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              {selectedPost?.Tieu_de || 'Chi tiết bài viết'}
            </DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div
              key={`dlg-${String(selectedPost.Bai_viet_id)}-${(postStatusById[String(selectedPost.Bai_viet_id)] ?? 'proposal')}`}
              className={`p-6 space-y-6 ${getSlideClassFor(String(selectedPost.Bai_viet_id))}`}
            >
              {(() => {
                const steps = getStepsForPost(selectedPost);
                const postId = String(selectedPost.Bai_viet_id);
                const current: PostContentStatus = postStatusById[postId] ?? 'proposal';
                const isVideo = selectedPost?.Dinh_dang?.Loai === 'Short Video';
                const labels: Record<PostContentStatus, string> = {
                  ...STATUS_LABELS,
                  assetGenerating: isVideo ? 'Tạo demo video' : 'Tạo hình ảnh',
                  assetGenerated: isVideo ? 'Demo video' : 'Hình ảnh',
                };
                return (
                  <ProgressSteps steps={steps} current={current} labels={labels} />
                );
              })()}
              {(() => {
                // Date/time picker moved below platform/method in confirm mode; nothing to render here now
                return null;
              })()}
              <SlideSection slideClass={getSlideClassFor(String(selectedPost.Bai_viet_id))} className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-blue-400" />
                    Ngày khởi tạo
                  </label>
                  <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <span className="text-gray-200 text-sm">
                    {new Date(selectedPost.Ngay_tao).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                    {selectedPost.Dinh_dang.Loai === 'Image Post' && <ImageIcon className="w-4 h-4 text-green-400" />}
                    {selectedPost.Dinh_dang.Loai === 'SEO Blog' && <FileText className="w-4 h-4 text-yellow-400" />}
                    {selectedPost.Dinh_dang.Loai === 'Short Video' && <Video className="w-4 h-4 text-red-400" />}
                    Định dạng
                  </label>
                  <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700 hover:border-purple-500/50 transition-colors">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${
                        selectedPost.Dinh_dang.Loai === 'Image Post'
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300'
                          : selectedPost.Dinh_dang.Loai === 'SEO Blog'
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300'
                          : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300'
                      }`}
                    >
                      {selectedPost.Dinh_dang.Loai === 'Image Post' && <ImageIcon className="w-3.5 h-3.5 mr-1.5" />}
                      {selectedPost.Dinh_dang.Loai === 'SEO Blog' && <FileText className="w-3.5 h-3.5 mr-1.5" />}
                      {selectedPost.Dinh_dang.Loai === 'Short Video' && <Video className="w-3.5 h-3.5 mr-1.5" />}
                      {selectedPost.Dinh_dang.Loai}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col mt-1.5">
                  <label className="text-gray-400 text-sm font-medium block mb-2">&nbsp;</label>
                  {(() => {
                    const currentStatus: PostContentStatus = selectedPost ? (postStatusById[String(selectedPost.Bai_viet_id)] ?? 'proposal') : 'proposal';
                    const isVideo = selectedPost.Dinh_dang.Loai === 'Short Video';
                    return <PostStatusButton status={currentStatus as any} isVideo={isVideo} />;
                  })()}
                </div>
              </SlideSection>

              <SlideSection slideClass={getSlideClassFor(String(selectedPost.Bai_viet_id))}>
                {(() => {
                  const currentStatus: PostContentStatus = selectedPost ? (postStatusById[String(selectedPost.Bai_viet_id)] ?? 'proposal') : 'proposal';
                  return (
                    <PostDraftLabel status={currentStatus as any} value={selectedPost.Y_tuong} />
                  );
                })()}
              </SlideSection>

              <SlideSection slideClass={getSlideClassFor(String(selectedPost.Bai_viet_id))}>
                {(() => {
                  const currentStatus: PostContentStatus = selectedPost ? (postStatusById[String(selectedPost.Bai_viet_id)] ?? 'proposal') : 'proposal';
                  const isVideo = selectedPost.Dinh_dang.Loai === 'Short Video';
                  if (currentStatus === 'assetGenerated' || currentStatus === 'finalGenerating' || currentStatus === 'finalGenerated' || currentStatus === 'waitingSchedule') {
                    if (isVideo) {
                      const postId = String(selectedPost.Bai_viet_id);
                      const vids = postVideosById[postId] || {};
                      return (
                        <div className="space-y-4">
                          {vids.demo && (
                            <div className="space-y-2">
                              <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                                <Video className="w-4 h-4 text-purple-400" />
                                Link video demo
                              </label>
                              <a href={vids.demo} target="_blank" rel="noreferrer" className="block bg-gray-800/50 border border-gray-700 text-blue-400 rounded-lg px-4 py-3 break-all hover:border-purple-500/50 hover:text-blue-300 transition-all">{vids.demo}</a>
                            </div>
                          )}
                          {(currentStatus === 'finalGenerating' || currentStatus === 'finalGenerated' || currentStatus === 'waitingSchedule') && vids.final && (
                            <div className="space-y-2">
                              <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                                <Video className="w-4 h-4 text-green-400" />
                                Link video final
                              </label>
                              <a href={vids.final} target="_blank" rel="noreferrer" className="block bg-gray-800/50 border border-gray-700 text-blue-400 rounded-lg px-4 py-3 break-all hover:border-green-500/50 hover:text-blue-300 transition-all">{vids.final}</a>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <label className="text-gray-400 text-sm font-medium flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-pink-400" />
                        Hình ảnh minh họa
                      </label>
                    );
                  }
                  return (
                    <label className="text-gray-400 text-sm font-medium flex items-center gap-2 mb-2">
                      {(currentStatus === 'generated' || currentStatus === 'assetGenerating') ? (
                        <>
                          <Wand2 className="w-4 h-4 text-yellow-400" />
                          Yêu cầu hình ảnh / video
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 text-blue-400" />
                          Lý do lựa chọn
                        </>
                      )}
                    </label>
                  );
                })()}
                {(() => {
                  const currentStatus: PostContentStatus = selectedPost ? (postStatusById[String(selectedPost.Bai_viet_id)] ?? 'proposal') : 'proposal';
                  const postId = String(selectedPost.Bai_viet_id);

                  if (currentStatus === 'assetGenerated' || currentStatus === 'finalGenerating' || currentStatus === 'finalGenerated' || currentStatus === 'waitingSchedule') {
                    const images = postAssetsById[postId] || [];
                    const isBlog = selectedPost.Dinh_dang.Loai === 'SEO Blog';
                    const inConfirmMode = !!confirmModeById[postId] && (currentStatus === 'assetGenerated' || currentStatus === 'finalGenerated' || currentStatus === 'waitingSchedule');
                    return (
                      <div className="space-y-4">
                        <div className={`grid gap-4 ${isBlog ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {images.map((src, i) => {
                            const key = `${postId}-${i}`;
                            const edits = editCountsByPostImage[key] ?? 0;
                            const maxEdits = 2;
                            const remaining = Math.max(0, maxEdits - edits);
                            return (
                              <div key={i} className="relative overflow-hidden rounded-lg border border-gray-700 hover:border-pink-500/50 transition-colors group">
                                <button
                                  type="button"
                                  onClick={() => setPreview({ postId, index: i })}
                                  className="block w-full cursor-zoom-in focus:outline-none"
                                >
                                  <img src={src} alt={`asset-${i}`} className="w-full h-auto object-cover" />
                                </button>
                                <div className="absolute top-2 right-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => setPreview({ postId, index: i })}
                                    className="p-2 rounded-lg shadow-lg bg-gray-900/90 hover:bg-gray-800 border border-gray-700 backdrop-blur-sm"
                                    title="Xem toàn màn hình"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditImageForPost({ postId, imageIndex: i })}
                                    disabled={edits >= maxEdits}
                                    className={`p-2 rounded-lg shadow-lg bg-gray-900/90 hover:bg-gray-800 border border-gray-700 backdrop-blur-sm ${edits >= maxEdits ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    title={edits >= maxEdits ? 'Đã đạt số lần chỉnh sửa tối đa' : 'Chỉnh sửa hình ảnh'}
                                  >
                                    <Pencil className="w-4 h-4 text-yellow-400" />
                                  </button>
                                </div>
                                <div className="absolute bottom-2 right-2 text-[11px] bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm border border-blue-500/30 font-semibold">
                                  {`Sửa còn: ${remaining}/2`}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {inConfirmMode && (
                          <ScheduleForm
                            platforms={platformOptions}
                            postingMethods={postingMethodOptions}
                            platformValue={platformById[postId]}
                            methodValue={postingMethodById[postId]}
                            dateValue={scheduleDateById[postId]}
                            timeValue={scheduleTimeById[postId]}
                            scheduledAt={scheduledAtById[postId]}
                            onPlatformChange={(val) => setPlatformById((prev) => ({ ...prev, [postId]: val }))}
                            onMethodChange={(val) => setPostingMethodById((prev) => ({ ...prev, [postId]: val }))}
                            onDateChange={(val) => setScheduleDateById((prev) => ({ ...prev, [postId]: val }))}
                            onTimeChange={(val) => setScheduleTimeById((prev) => ({ ...prev, [postId]: val }))}
                          />
                        )}
                      </div>
                    );
                  }
                  return (
                    <Textarea value={selectedPost.Ly_do_lua_chon} readOnly className="bg-gray-800/50 border border-gray-700 text-gray-200 min-h-[120px] resize-none hover:border-blue-500/50 transition-colors" />
                  );
                })()}
              </SlideSection>

              <SlideSection slideClass={getSlideClassFor(String(selectedPost.Bai_viet_id))} className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
                {(() => {
                  const currentStatus: PostContentStatus = selectedPost ? (postStatusById[String(selectedPost.Bai_viet_id)] ?? 'proposal') : 'proposal';
                  return (
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 px-6 py-2.5"
                      data-testid="button-reject-post"
                      onClick={() => {
                        if (currentStatus === 'generated') {
                          setDraftEditForPost({ postId: String(selectedPost.Bai_viet_id) });
                        } else if (currentStatus === 'assetGenerated') {
                          handleApprovePost(selectedPost);
                        } else {
                          setIsRejectDialogOpen(true);
                        }
                      }}
                    >
                      {(currentStatus === 'generated' || currentStatus === 'assetGenerated') ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Tạo lại
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
                          Không duyệt
                        </>
                      )}
                    </Button>
                  );
                })()}
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-2.5 shadow-lg"
                  data-testid="button-approve-post"
                  disabled={!!selectedPost && (
                    (postStatusById[String(selectedPost.Bai_viet_id)] === 'generating') ||
                    (postStatusById[String(selectedPost.Bai_viet_id)] === 'assetGenerating') ||
                    (postStatusById[String(selectedPost.Bai_viet_id)] === 'finalGenerating') ||
                    (postStatusById[String(selectedPost.Bai_viet_id)] === 'pendingPost') ||
                    (
                      !!confirmModeById[String(selectedPost.Bai_viet_id)] && (
                        !platformById[String(selectedPost.Bai_viet_id)] ||
                        !postingMethodById[String(selectedPost.Bai_viet_id)] ||
                        !scheduleDateById[String(selectedPost.Bai_viet_id)] ||
                        !scheduleTimeById[String(selectedPost.Bai_viet_id)]
                      )
                    )
                  )}
                  onClick={() => {
                    const currentStatus: PostContentStatus = selectedPost ? (postStatusById[String(selectedPost.Bai_viet_id)] ?? 'proposal') : 'proposal';
                    const isVideo = !!selectedPost && selectedPost.Dinh_dang.Loai === 'Short Video';
                    const postId = String(selectedPost!.Bai_viet_id);
                    // If already in confirm mode, finalize first
                    if (confirmModeById[postId]) {
                      handleConfirmSchedule(selectedPost);
                    } else if (currentStatus === 'assetGenerated' && !isVideo) {
                      // Approve images -> move to waitingSchedule and enter confirm mode
                      const current = postStatusById[postId] ?? 'assetGenerated';
                      const next: PostContentStatus = 'waitingSchedule';
                      const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
                      setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
                      setAnimateOnNextById((prev) => ({ ...prev, [postId]: true }));
                      setPostStatusById((prev) => ({ ...prev, [postId]: next }));
                      enterConfirmMode(selectedPost);
                    } else if (currentStatus === 'finalGenerated' && isVideo) {
                      // Approve final video -> move to waitingSchedule and enter confirm mode
                      const current = postStatusById[postId] ?? 'finalGenerated';
                      const next: PostContentStatus = 'waitingSchedule';
                      const dir: 'forward' | 'backward' = STATUS_STEPS.indexOf(next) >= STATUS_STEPS.indexOf(current) ? 'forward' : 'backward';
                      setTransitionDirById((prev) => ({ ...prev, [postId]: dir }));
                      setAnimateOnNextById((prev) => ({ ...prev, [postId]: true }));
                      setPostStatusById((prev) => ({ ...prev, [postId]: next }));
                      enterConfirmMode(selectedPost);
                    } else if (currentStatus === 'waitingSchedule') {
                      // If already in waitingSchedule, allow entering confirm mode again
                      enterConfirmMode(selectedPost);
                    } else if (currentStatus === 'assetGenerated' && isVideo) {
                      handleApproveFinalVideo(selectedPost);
                    } else if (currentStatus === 'generated') {
                      handleApproveAssets(selectedPost);
                    } else if (currentStatus === 'finalGenerating') {
                      // do nothing, disabled by above
                    } else if (currentStatus === 'finalGenerated') {
                      // finished (handled above by confirm mode)
                    } else {
                      handleApprovePost(selectedPost);
                    }
                  }}
                >
                  {(() => {
                    if (!selectedPost) return (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Duyệt nội dung
                      </>
                    );
                    const currentStatus: PostContentStatus = postStatusById[String(selectedPost.Bai_viet_id)];
                    const postId = String(selectedPost.Bai_viet_id);
                    if (confirmModeById[postId] && (currentStatus === 'assetGenerated' || currentStatus === 'finalGenerated' || currentStatus === 'waitingSchedule')) {
                      return (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Xác nhận
                        </>
                      );
                    }
                    if (currentStatus === 'generating') {
                      return (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 inline-block animate-spin" />
                          Đang tạo nội dung
                        </>
                      );
                    }
                    if (currentStatus === 'assetGenerating') {
                      const isVideo = selectedPost.Dinh_dang.Loai === 'Short Video';
                      return (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 inline-block animate-spin" />
                          {isVideo ? 'Đang tạo Video demo' : 'Đang tạo hình ảnh'}
                        </>
                      );
                    }
                    if (currentStatus === 'waitingSchedule') {
                      return (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Xác nhận
                        </>
                      );
                    }
                    if (currentStatus === 'pendingPost') {
                      return (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Đang chờ đăng
                        </>
                      );
                    }
                    if (currentStatus === 'assetGenerated') {
                      const isVideo = selectedPost.Dinh_dang.Loai === 'Short Video';
                      return (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {isVideo ? 'Duyệt video demo' : 'Duyệt Hình ảnh'}
                        </>
                      );
                    }
                    if (currentStatus === 'finalGenerating') {
                      return (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 inline-block animate-spin" />
                          Đang tạo Final Video
                        </>
                      );
                    }
                    if (currentStatus === 'finalGenerated') {
                      return (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Duyệt Final Video
                        </>
                      );
                    }
                    return currentStatus === 'proposal' ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Duyệt đề xuất
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Duyệt nội dung
                      </>
                    );
                  })()}
                </Button>
              </SlideSection>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog */}
      <ReasonDialog
        open={isRejectDialogOpen}
        onOpenChange={(open) => {
          setIsRejectDialogOpen(open);
          if (!open) setRejectReason('');
        }}
        title="Vui lòng nhập lý do"
        value={rejectReason}
        onChange={setRejectReason}
        onConfirm={() => {
          console.log('Lý do từ chối:', rejectReason);
          setIsRejectDialogOpen(false);
          setSelectedPost(null);
          setRejectReason('');
        }}
        confirmDisabled={rejectReason.trim().length === 0}
      />

      <ImagePreviewDialog
        open={!!preview}
        onOpenChange={(open) => !open && setPreview(null)}
        images={preview ? (postAssetsById[preview.postId] || []) : []}
        index={preview ? preview.index : 0}
        onIndexChange={(next) => setPreview((prev) => (prev ? { ...prev, index: next } : prev))}
      />

      <ImageEditDialog
        open={!!editImageForPost}
        onOpenChange={(open) => {
          if (!open) {
            setEditImageForPost(null);
            setEditInstructions('');
          }
        }}
        remainingEdits={(() => {
          if (!editImageForPost) return 0;
          const key = `${editImageForPost.postId}-${editImageForPost.imageIndex}`;
          const edits = editCountsByPostImage[key] ?? 0;
          return Math.max(0, 2 - edits);
        })()}
        value={editInstructions}
        onChange={setEditInstructions}
        onConfirm={() => {
          if (!editImageForPost) return;
          const key = `${editImageForPost.postId}-${editImageForPost.imageIndex}`;
          setEditCountsByPostImage((prev) => ({ ...prev, [key]: Math.min(2, (prev[key] ?? 0) + 1) }));
          setEditImageForPost(null);
          setEditInstructions('');
        }}
      />

      <ReasonDialog
        open={!!draftEditForPost}
        onOpenChange={(open) => {
          if (!open) {
            setDraftEditForPost(null);
            setDraftEditInstructions('');
          }
        }}
        title="Vui lòng nhập yêu cầu chỉnh sửa bản thảo / kịch bản"
        value={draftEditInstructions}
        onChange={setDraftEditInstructions}
        onConfirm={() => {
          if (!draftEditForPost) return;
          const post = weekPosts.find((p) => String(p.Bai_viet_id) === draftEditForPost.postId);
          if (post) {
            handleApprovePost(post);
          }
          setDraftEditForPost(null);
          setDraftEditInstructions('');
        }}
        confirmDisabled={draftEditInstructions.trim().length === 0}
      />
    </div>
  );
}