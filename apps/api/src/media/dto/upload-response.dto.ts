export class UploadResponseDto {
  /** Public URL — store this in ReportMedia.url, Observation.mediaUrl, etc. */
  url!: string;
  /** Object key in the bucket — use this to delete or reference the file later. */
  key!: string;
  mimeType!: string;
  /** Size in bytes. */
  fileSize!: number;
  originalName!: string;
}

export class PresignResponseDto {
  /**
   * Presigned PUT URL — the browser should PUT the file bytes to this URL
   * directly, with the Content-Type header matching `mimeType`.
   * The URL expires after `expiresIn` seconds.
   */
  presignedUrl!: string;
  /** Object key — pass this to POST /media/confirm once the upload is done. */
  key!: string;
  /** The public URL the uploaded object will be reachable at after upload. */
  publicUrl!: string;
  /** Seconds until `presignedUrl` expires. */
  expiresIn!: number;
}
