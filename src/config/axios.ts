import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const SEO_CONTENT_API = axios.create({
    baseURL: import.meta.env.VITE_SEO_CONTENT_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const POST_CONTENT_API = axios.create({
    baseURL: import.meta.env.VITE_POST_CONTENT_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const VIDEO_CONTENT_API = axios.create({
    baseURL: import.meta.env.VITE_VIDEO_CONTENT_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const SEO_FEEDBACK_API = axios.create({
    baseURL: import.meta.env.VITE_SEO_FEEDBACK_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const POST_FEEDBACK_API = axios.create({
    baseURL: import.meta.env.VITE_POST_FEEDBACK_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const VIDEO_FEEDBACK_API = axios.create({
    baseURL: import.meta.env.VITE_VIDEO_FEEDBACK_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});