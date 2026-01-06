'use server'

import { saveFile } from '@/lib/storage'
import db from '@/lib/db'

export async function uploadFileAction(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file uploaded' }
  }

  try {
    const { path, size, mimeType } = await saveFile(file)
    
    let type = 'DOCUMENT'
    if (mimeType.startsWith('image/')) type = 'IMAGE'
    else if (mimeType.startsWith('video/')) type = 'VIDEO'
    else if (mimeType.includes('model') || file.name.endsWith('.glb') || file.name.endsWith('.gltf')) type = 'MODEL_3D'

    const asset = await db.asset.create({
      data: {
        name: file.name,
        path,
        type,
        mimeType,
        size
      }
    })

    return { success: true, asset }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'Upload failed' }
  }
}
