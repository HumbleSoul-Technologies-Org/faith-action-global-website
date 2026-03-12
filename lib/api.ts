import axios from 'axios'
import type { AxiosResponse } from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || '/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetcher = <T = any>(url: string) => api.get<T>(url).then((res: AxiosResponse<T>) => res.data)

export interface CloudinaryUploadResponse {
  url: string
  publicId: string
  secure_url: string
  public_id: string
}

/**
 * Upload a file to Cloudinary
 * @param file - The file to upload (video or audio)
 * @param resourceType - Type of resource: 'video' or 'auto'
 * @param onProgress - Callback function to track upload progress (0-100)
 * @returns Promise with url and publicId
 */
export async function uploadToCloudinary(
  file: File,
  resourceType: 'video' | 'auto' = 'auto',
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'default_preset')
  formData.append('resource_type', resourceType)

  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName) {
      throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set')
    }
    if (!uploadPreset) {
      throw new Error('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set')
    }

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress?.(progress)
          }
        },
      }
    )

    return {
      url: response.data.url,
      publicId: response.data.public_id,
      secure_url: response.data.secure_url,
      public_id: response.data.public_id,
    }
  } catch (error: any) {
    console.error('Cloudinary upload failed:', error)
    if (error.response?.data) {
      console.error('Cloudinary error details:', error.response.data)
    }
    throw new Error(error.message || 'Failed to upload file to Cloudinary')
  }
}
