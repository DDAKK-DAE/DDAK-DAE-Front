import { uploadClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';

export interface UploadFileResponse {
  url: string;
}

/** POST /files/upload — 이미지/영상/오디오 업로드, 공개 URL 반환 */
export async function uploadFileApi(file: File): Promise<UploadFileResponse> {
  const form = new FormData();
  form.append('file', file);
  const response = await uploadClient.post<ApiResponse<UploadFileResponse>>(
    '/files/upload',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}
