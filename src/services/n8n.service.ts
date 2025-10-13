import { SEO_CONTENT_API, POST_CONTENT_API, VIDEO_CONTENT_API, SEO_FEEDBACK_API, POST_FEEDBACK_API, VIDEO_FEEDBACK_API } from "../config/axios";
import type { IBaiViet, PostAndVideoContentRequest, PostFeedbackRequest, SEOContentRequest, SEOFeedbackRequest, VideoFeedbackRequest } from "../types/bai_viet.type";
import type { ITargetAnalysisResponse } from "../types/n8n.type";

const BASE_PATH = "/";

export async function getTargetAnalysisResponse(payload: { Muc_tieu: string }): Promise<ITargetAnalysisResponse> {
  const { data: response } = await SEO_CONTENT_API.post(BASE_PATH, payload);
  return response?.data as ITargetAnalysisResponse;
}

export async function getPostsResponse(): Promise<IBaiViet[]> {
  const { data: response } = await POST_CONTENT_API.post(BASE_PATH);
  return response?.data as IBaiViet[];
}

// Create content response from n8n
export async function getSEOContentResponse(payload: SEOContentRequest): Promise<any> {
  const { data: response } = await SEO_CONTENT_API.post(BASE_PATH, payload);
  return response?.data as any;
}

export async function getPostAndVideoContentResponse(payload: PostAndVideoContentRequest): Promise<any> {
  const { data: response } = await POST_CONTENT_API.post(BASE_PATH, payload);
  return response?.data as any;
}

// Create feedback response from n8n
export async function getSEOFeedbackResponse(payload: SEOFeedbackRequest): Promise<any> {
  const { data: response } = await SEO_FEEDBACK_API.post(BASE_PATH, payload);
  return response?.data as any;
}

export async function getPostFeedbackResponse(payload: PostFeedbackRequest): Promise<any> {
  const { data: response } = await POST_FEEDBACK_API.post(BASE_PATH, payload);
  return response?.data as any;
}

export async function getVideoFeedbackResponse(payload: VideoFeedbackRequest): Promise<any> {
  const { data: response } = await VIDEO_FEEDBACK_API.post(BASE_PATH, payload);
  return response?.data as any;
}

export async function getImageOrVideoResponse(payload: { Noi_dung: string, Mo_ta_media: string }): Promise<any> {
  const { data: response } = await VIDEO_CONTENT_API.post(BASE_PATH, payload);
  return response?.data as any;
}

export async function getFinalVideoResponse(payload: { link_video_demo: string }): Promise<any> {
  const { data: response } = await VIDEO_CONTENT_API.post(BASE_PATH, payload);
  return response?.data as any;
}