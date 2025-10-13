import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import type { 
  PostAndVideoContentRequest, 
  PostFeedbackRequest, 
  SEOContentRequest, 
  SEOFeedbackRequest, 
  VideoFeedbackRequest 
} from "../types/bai_viet.type";
import {
  fetchTargetAnalysis,
  fetchSEOContent,
  fetchPostVideoContent,
  fetchSEOFeedback,
  fetchPostFeedback,
  fetchVideoFeedback,
  fetchImageVideoMedia,
  fetchFinalVideo,
  fetchPosts,
  clearTargetAnalysis,
  clearSeoContent,
  clearPostVideoContent,
  clearSeoFeedback,
  clearPostFeedback,
  clearVideoFeedback,
  clearImageVideoMedia,
  clearFinalVideo,
  clearPosts,
  clearAllN8nData,
} from "../store/n8n.slice";

// Hook for Target Analysis
export function useTargetAnalysis() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.n8n.targetAnalysis);
  const loading = useAppSelector((s) => s.n8n.loadingTargetAnalysis);
  const error = useAppSelector((s) => s.n8n.error);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      fetch: (payload: { Muc_tieu: string }) => dispatch(fetchTargetAnalysis(payload)),
      clear: () => dispatch(clearTargetAnalysis()),
    }),
    [dispatch, data, loading, error]
  );
}

// Hook for SEO Content
export function useSEOContent() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.n8n.seoContent);
  const loading = useAppSelector((s) => s.n8n.loadingSeoContent);
  const error = useAppSelector((s) => s.n8n.error);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      fetch: (payload: SEOContentRequest) => dispatch(fetchSEOContent(payload)),
      clear: () => dispatch(clearSeoContent()),
    }),
    [dispatch, data, loading, error]
  );
}

// Hook for Post and Video Content
export function usePostVideoContent() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.n8n.postVideoContent);
  const loading = useAppSelector((s) => s.n8n.loadingPostVideoContent);
  const error = useAppSelector((s) => s.n8n.error);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      fetch: (payload: PostAndVideoContentRequest) => dispatch(fetchPostVideoContent(payload)),
      clear: () => dispatch(clearPostVideoContent()),
    }),
    [dispatch, data, loading, error]
  );
}

// Hook for SEO Feedback
export function useSEOFeedback() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.n8n.seoFeedback);
  const loading = useAppSelector((s) => s.n8n.loadingSeoFeedback);
  const error = useAppSelector((s) => s.n8n.error);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      fetch: (payload: SEOFeedbackRequest) => dispatch(fetchSEOFeedback(payload)),
      clear: () => dispatch(clearSeoFeedback()),
    }),
    [dispatch, data, loading, error]
  );
}

// Hook for Post Feedback
export function usePostFeedback() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.n8n.postFeedback);
  const loading = useAppSelector((s) => s.n8n.loadingPostFeedback);
  const error = useAppSelector((s) => s.n8n.error);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      fetch: (payload: PostFeedbackRequest) => dispatch(fetchPostFeedback(payload)),
      clear: () => dispatch(clearPostFeedback()),
    }),
    [dispatch, data, loading, error]
  );
}

// Hook for Video Feedback
export function useVideoFeedback() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.n8n.videoFeedback);
  const loading = useAppSelector((s) => s.n8n.loadingVideoFeedback);
  const error = useAppSelector((s) => s.n8n.error);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      fetch: (payload: VideoFeedbackRequest) => dispatch(fetchVideoFeedback(payload)),
      clear: () => dispatch(clearVideoFeedback()),
    }),
    [dispatch, data, loading, error]
  );
}

// Hook for Image/Video Media
export function useImageVideoMedia() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.n8n.imageVideoMedia);
  const loading = useAppSelector((s) => s.n8n.loadingImageVideo);
  const error = useAppSelector((s) => s.n8n.error);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      fetch: (payload: { Noi_dung: string; Mo_ta_media: string }) => dispatch(fetchImageVideoMedia(payload)),
      clear: () => dispatch(clearImageVideoMedia()),
    }),
    [dispatch, data, loading, error]
  );
}

// Hook for Final Video
export function useFinalVideo() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.n8n.finalVideo);
  const loading = useAppSelector((s) => s.n8n.loadingFinalVideo);
  const error = useAppSelector((s) => s.n8n.error);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      fetch: (payload: { link_video_demo: string }) => dispatch(fetchFinalVideo(payload)),
      clear: () => dispatch(clearFinalVideo()),
    }),
    [dispatch, data, loading, error]
  );
}

// Hook for Posts
export function usePosts() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.n8n.posts);
  const loading = useAppSelector((s) => s.n8n.loadingPosts);
  const error = useAppSelector((s) => s.n8n.error);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      fetch: () => dispatch(fetchPosts()),
      clear: () => dispatch(clearPosts()),
    }),
    [dispatch, data, loading, error]
  );
}

// General N8N Actions Hook
export function useN8NActions() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((s) => s.n8n.error);

  return useMemo(
    () => ({
      error,
      clearAll: () => dispatch(clearAllN8nData()),
    }),
    [dispatch, error]
  );
}

