import { BadRequestException } from '@nestjs/common';
import { MediaService } from './media.service';
import { StorageService } from './storage.service';
import { MAX_UPLOAD_SIZE_BYTES } from './media.constants';

function mockStorage() {
  return {
    upload:     jest.fn().mockResolvedValue('https://cdn.example.com/bucket/key.jpg'),
    presignPut: jest.fn().mockResolvedValue('https://minio.example.com/presigned'),
    publicUrl:  jest.fn((key: string) => `https://cdn.example.com/${key}`),
    isConfigured: true,
  } as unknown as StorageService;
}

function build() {
  const storage = mockStorage();
  const service = new MediaService(storage);
  return { service, storage };
}

function makeFile(overrides: Partial<Express.Multer.File> = {}): Express.Multer.File {
  return {
    fieldname:    'file',
    originalname: 'photo.jpg',
    encoding:     '7bit',
    mimetype:     'image/jpeg',
    size:         1024,
    buffer:       Buffer.from('fake-image-data'),
    stream:       null as any,
    destination:  '',
    filename:     '',
    path:         '',
    ...overrides,
  };
}

describe('MediaService', () => {
  describe('uploadFile — MIME type validation', () => {
    it.each([
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ])('accepts %s', async (mimeType) => {
      const { service } = build();
      const file = makeFile({ mimetype: mimeType });

      await expect(service.uploadFile(file, 'general', 'u1')).resolves.toMatchObject({
        mimeType,
        originalName: 'photo.jpg',
      });
    });

    it.each([
      'application/javascript',
      'text/html',
      'application/x-sh',
      'image/svg+xml',
      'application/zip',
    ])('rejects %s', async (mimeType) => {
      const { service } = build();
      const file = makeFile({ mimetype: mimeType });

      await expect(service.uploadFile(file, 'general', 'u1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('uploadFile — file size validation', () => {
    it('accepts a file exactly at the 100 MB limit', async () => {
      const { service } = build();
      const file = makeFile({ size: MAX_UPLOAD_SIZE_BYTES });

      await expect(service.uploadFile(file, 'general', 'u1')).resolves.toMatchObject({
        fileSize: MAX_UPLOAD_SIZE_BYTES,
      });
    });

    it('rejects a file 1 byte over the 100 MB limit', async () => {
      const { service } = build();
      const file = makeFile({ size: MAX_UPLOAD_SIZE_BYTES + 1 });

      await expect(service.uploadFile(file, 'general', 'u1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('includes the file size in MB in the error message', async () => {
      const { service } = build();
      const file = makeFile({ size: 200 * 1024 * 1024 }); // 200 MB

      await expect(service.uploadFile(file, 'general', 'u1')).rejects.toThrow('200 MB');
    });
  });

  describe('uploadFile — object key generation', () => {
    it('key contains the userId segment', async () => {
      const { service, storage } = build();
      await service.uploadFile(makeFile(), 'reports', 'user-abc');

      const [key] = (storage.upload as jest.Mock).mock.calls[0];
      expect(key).toContain('user-abc');
    });

    it('key starts with the requested folder', async () => {
      const { service, storage } = build();
      await service.uploadFile(makeFile(), 'reports', 'u1');

      const [key] = (storage.upload as jest.Mock).mock.calls[0];
      expect(key.startsWith('reports/')).toBe(true);
    });

    it('falls back to "general" for an unrecognised folder', async () => {
      const { service, storage } = build();
      await service.uploadFile(makeFile(), 'malicious/../etc', 'u1');

      const [key] = (storage.upload as jest.Mock).mock.calls[0];
      expect(key.startsWith('general/')).toBe(true);
    });

    it('preserves the lowercase file extension', async () => {
      const { service, storage } = build();
      await service.uploadFile(makeFile({ originalname: 'IMAGE.PNG', mimetype: 'image/png' }), 'general', 'u1');

      const [key] = (storage.upload as jest.Mock).mock.calls[0];
      expect(key.endsWith('.png')).toBe(true);
    });

    it('returns the url from StorageService.upload', async () => {
      const { service, storage } = build();
      (storage.upload as jest.Mock).mockResolvedValue('https://cdn.example.com/reports/u1/file.jpg');

      const result = await service.uploadFile(makeFile(), 'reports', 'u1');

      expect(result.url).toBe('https://cdn.example.com/reports/u1/file.jpg');
    });
  });

  describe('createPresignedUpload', () => {
    it('rejects an invalid MIME type', async () => {
      const { service } = build();

      await expect(
        service.createPresignedUpload('file.exe', 'application/x-msdownload', 'general', 'u1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns presignedUrl, key, publicUrl and expiresIn=900', async () => {
      const { service } = build();

      const result = await service.createPresignedUpload('image.jpg', 'image/jpeg', 'profile', 'u1');

      expect(result).toMatchObject({
        presignedUrl: expect.any(String),
        key:          expect.any(String),
        publicUrl:    expect.any(String),
        expiresIn:    900,
      });
    });

    it('key starts with the requested folder', async () => {
      const { service } = build();

      const result = await service.createPresignedUpload('doc.pdf', 'application/pdf', 'observations', 'u1');

      expect(result.key.startsWith('observations/')).toBe(true);
    });
  });
});
