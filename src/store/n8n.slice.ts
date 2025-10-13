import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { 
  PostAndVideoContentRequest, 
  PostFeedbackRequest, 
  SEOContentRequest, 
  SEOFeedbackRequest, 
  VideoFeedbackRequest 
} from "../types/bai_viet.type";
import type { ITargetAnalysisResponse } from "../types/n8n.type";
import { 
  getFinalVideoResponse, 
  getImageOrVideoResponse, 
  getPostAndVideoContentResponse, 
  getPostFeedbackResponse, 
  getPostsResponse, 
  getSEOContentResponse, 
  getSEOFeedbackResponse, 
  getTargetAnalysisResponse, 
  getVideoFeedbackResponse 
} from "../services/n8n.service";

interface N8nState {
  targetAnalysis: ITargetAnalysisResponse | null;
  seoContent: any | null;
  postVideoContent: any | null;
  seoFeedback: any | null;
  postFeedback: any | null;
  videoFeedback: any | null;
  imageVideoMedia: any | null;
  finalVideo: any | null;
  posts: any[] | null;
  
  loadingTargetAnalysis: boolean;
  loadingSeoContent: boolean;
  loadingPostVideoContent: boolean;
  loadingSeoFeedback: boolean;
  loadingPostFeedback: boolean;
  loadingVideoFeedback: boolean;
  loadingImageVideo: boolean;
  loadingFinalVideo: boolean;
  loadingPosts: boolean;
  
  error: string | null;
}

const initialState: N8nState = {
  targetAnalysis: null,
  seoContent: null,
  postVideoContent: null,
  seoFeedback: null,
  postFeedback: null,
  videoFeedback: null,
  imageVideoMedia: null,
  finalVideo: null,
  posts: null,
  
  loadingTargetAnalysis: false,
  loadingSeoContent: false,
  loadingPostVideoContent: false,
  loadingSeoFeedback: false,
  loadingPostFeedback: false,
  loadingVideoFeedback: false,
  loadingImageVideo: false,
  loadingFinalVideo: false,
  loadingPosts: false,
  
  error: null,
};

// Target Analysis
export const fetchTargetAnalysis = createAsyncThunk(
  "n8n/targetAnalysis",
  async (payload: { Muc_tieu: string }) => {
    const data = await getTargetAnalysisResponse(payload);
    return data;
  }
);

// SEO Content
export const fetchSEOContent = createAsyncThunk(
  "n8n/seoContent",
  async (payload: SEOContentRequest) => {
    const data = await getSEOContentResponse(payload);
    return data;
  }
);

// Post and Video Content
export const fetchPostVideoContent = createAsyncThunk(
  "n8n/postVideoContent",
  async (payload: PostAndVideoContentRequest) => {
    const data = await getPostAndVideoContentResponse(payload);
    return data;
  }
);

// SEO Feedback
export const fetchSEOFeedback = createAsyncThunk(
  "n8n/seoFeedback",
  async (payload: SEOFeedbackRequest) => {
    const data = await getSEOFeedbackResponse(payload);
    return data;
  }
);

// Post Feedback
export const fetchPostFeedback = createAsyncThunk(
  "n8n/postFeedback",
  async (payload: PostFeedbackRequest) => {
    const data = await getPostFeedbackResponse(payload);
    return data;
  }
);

// Video Feedback
export const fetchVideoFeedback = createAsyncThunk(
  "n8n/videoFeedback",
  async (payload: VideoFeedbackRequest) => {
    const data = await getVideoFeedbackResponse(payload);
    return data;
  }
);

// Image or Video Media
export const fetchImageVideoMedia = createAsyncThunk(
  "n8n/imageVideoMedia",
  async (payload: { Noi_dung: string; Mo_ta_media: string }) => {
    const data = await getImageOrVideoResponse(payload);
    return data;
  }
);

// Final Video
export const fetchFinalVideo = createAsyncThunk(
  "n8n/finalVideo",
  async (payload: { link_video_demo: string }) => {
    const data = await getFinalVideoResponse(payload);
    return data;
  }
);

// Posts
export const fetchPosts = createAsyncThunk(
  "n8n/posts",
  async () => {
    const data = await getPostsResponse();
    return data;
  }
);

const n8nSlice = createSlice({
  name: "n8n",
  initialState,
  reducers: {
    clearTargetAnalysis(state) {
      state.targetAnalysis = null;
    },
    clearSeoContent(state) {
      state.seoContent = null;
    },
    clearPostVideoContent(state) {
      state.postVideoContent = null;
    },
    clearSeoFeedback(state) {
      state.seoFeedback = null;
    },
    clearPostFeedback(state) {
      state.postFeedback = null;
    },
    clearVideoFeedback(state) {
      state.videoFeedback = null;
    },
    clearImageVideoMedia(state) {
      state.imageVideoMedia = null;
    },
    clearFinalVideo(state) {
      state.finalVideo = null;
    },
    clearPosts(state) {
      state.posts = null;
    },
    clearAllN8nData(state) {
      state.targetAnalysis = null;
      state.seoContent = null;
      state.postVideoContent = null;
      state.seoFeedback = null;
      state.postFeedback = null;
      state.videoFeedback = null;
      state.imageVideoMedia = null;
      state.finalVideo = null;
      state.posts = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Target Analysis
      .addCase(fetchTargetAnalysis.pending, (state) => {
        state.loadingTargetAnalysis = true;
        state.error = null;
      })
      .addCase(fetchTargetAnalysis.fulfilled, (state, action) => {
        state.loadingTargetAnalysis = false;
        state.targetAnalysis = action.payload;
      })
      .addCase(fetchTargetAnalysis.rejected, (state, action) => {
        state.loadingTargetAnalysis = false;
        state.error = action.error.message ?? "Phân tích mục tiêu thất bại";
      })
      
      // SEO Content
      .addCase(fetchSEOContent.pending, (state) => {
        state.loadingSeoContent = true;
        state.error = null;
      })
      .addCase(fetchSEOContent.fulfilled, (state, action) => {
        state.loadingSeoContent = false;
        state.seoContent = action.payload;
      })
      .addCase(fetchSEOContent.rejected, (state, action) => {
        state.loadingSeoContent = false;
        state.error = action.error.message ?? "Tạo nội dung SEO thất bại";
      })
      
      // Post and Video Content
      .addCase(fetchPostVideoContent.pending, (state) => {
        state.loadingPostVideoContent = true;
        state.error = null;
      })
      .addCase(fetchPostVideoContent.fulfilled, (state, action) => {
        state.loadingPostVideoContent = false;
        state.postVideoContent = action.payload;
      })
      .addCase(fetchPostVideoContent.rejected, (state, action) => {
        state.loadingPostVideoContent = false;
        state.error = action.error.message ?? "Tạo nội dung bài viết/video thất bại";
      })
      
      // SEO Feedback
      .addCase(fetchSEOFeedback.pending, (state) => {
        state.loadingSeoFeedback = true;
        state.error = null;
      })
      .addCase(fetchSEOFeedback.fulfilled, (state, action) => {
        state.loadingSeoFeedback = false;
        state.seoFeedback = action.payload;
      })
      .addCase(fetchSEOFeedback.rejected, (state, action) => {
        state.loadingSeoFeedback = false;
        state.error = action.error.message ?? "Lấy feedback SEO thất bại";
      })
      
      // Post Feedback
      .addCase(fetchPostFeedback.pending, (state) => {
        state.loadingPostFeedback = true;
        state.error = null;
      })
      .addCase(fetchPostFeedback.fulfilled, (state, action) => {
        state.loadingPostFeedback = false;
        state.postFeedback = action.payload;
      })
      .addCase(fetchPostFeedback.rejected, (state, action) => {
        state.loadingPostFeedback = false;
        state.error = action.error.message ?? "Lấy feedback bài viết thất bại";
      })
      
      // Video Feedback
      .addCase(fetchVideoFeedback.pending, (state) => {
        state.loadingVideoFeedback = true;
        state.error = null;
      })
      .addCase(fetchVideoFeedback.fulfilled, (state, action) => {
        state.loadingVideoFeedback = false;
        state.videoFeedback = action.payload;
      })
      .addCase(fetchVideoFeedback.rejected, (state, action) => {
        state.loadingVideoFeedback = false;
        state.error = action.error.message ?? "Lấy feedback video thất bại";
      })
      
      // Image or Video Media
      .addCase(fetchImageVideoMedia.pending, (state) => {
        state.loadingImageVideo = true;
        state.error = null;
      })
      .addCase(fetchImageVideoMedia.fulfilled, (state, action) => {
        state.loadingImageVideo = false;
        state.imageVideoMedia = action.payload;
      })
      .addCase(fetchImageVideoMedia.rejected, (state, action) => {
        state.loadingImageVideo = false;
        state.error = action.error.message ?? "Tạo ảnh/video thất bại";
      })
      
      // Final Video
      .addCase(fetchFinalVideo.pending, (state) => {
        state.loadingFinalVideo = true;
        state.error = null;
      })
      .addCase(fetchFinalVideo.fulfilled, (state, action) => {
        state.loadingFinalVideo = false;
        state.finalVideo = action.payload;
      })
      .addCase(fetchFinalVideo.rejected, (state, action) => {
        state.loadingFinalVideo = false;
        state.error = action.error.message ?? "Tạo video cuối cùng thất bại";
      })
      
      // Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loadingPosts = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loadingPosts = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loadingPosts = false;
        state.error = action.error.message ?? "Lấy danh sách bài viết thất bại";
      });
  },
});

export const {
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
} = n8nSlice.actions;

export default n8nSlice.reducer;

