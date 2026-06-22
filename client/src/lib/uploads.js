const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export async function uploadImage(file) {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`${file.name} is larger than the 10 MB upload limit.`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'shambhala/projects');

  const response = await fetch('/api/cloudinary-upload', {
    method: 'POST',
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Unable to upload image.');
  }

  return {
    url: payload.url,
    publicId: payload.publicId,
    persistent: true,
  };
}
