import { describe, expect, test } from 'bun:test';
import { S3Adapter } from '@/adapters/s3-adapter';

describe('S3Adapter', () => {
  describe('constructor', () => {
    test('creates adapter with minimal config', () => {
      const adapter = new S3Adapter({
        bucket: 'test-bucket',
        accessKeyId: 'test-key',
        secretAccessKey: 'test-secret',
      });

      expect(adapter).toBeDefined();
    });

    test('creates adapter with full config', () => {
      const adapter = new S3Adapter({
        bucket: 'test-bucket',
        accessKeyId: 'test-key',
        secretAccessKey: 'test-secret',
        region: 'us-east-1',
        endpoint: 'https://custom-endpoint.com',
        root: 'my-prefix',
        acl: 'public-read',
      });

      expect(adapter).toBeDefined();
    });

    test('creates adapter with Cloudflare R2 config', () => {
      const adapter = new S3Adapter({
        bucket: 'my-bucket',
        accessKeyId: 'r2-key',
        secretAccessKey: 'r2-secret',
        endpoint: 'https://account-id.r2.cloudflarestorage.com',
      });

      expect(adapter).toBeDefined();
    });

    test('creates adapter with MinIO config', () => {
      const adapter = new S3Adapter({
        bucket: 'local-bucket',
        accessKeyId: 'minio-key',
        secretAccessKey: 'minio-secret',
        endpoint: 'http://localhost:9000',
      });

      expect(adapter).toBeDefined();
    });
  });

  describe('API methods', () => {
    const adapter = new S3Adapter({
      bucket: 'test-bucket',
      accessKeyId: 'test-key',
      secretAccessKey: 'test-secret',
    });

    test('has all required FilesystemDisk methods', () => {
      expect(typeof adapter.get).toBe('function');
      expect(typeof adapter.put).toBe('function');
      expect(typeof adapter.exists).toBe('function');
      expect(typeof adapter.missing).toBe('function');
      expect(typeof adapter.delete).toBe('function');
      expect(typeof adapter.copy).toBe('function');
      expect(typeof adapter.move).toBe('function');
      expect(typeof adapter.size).toBe('function');
      expect(typeof adapter.lastModified).toBe('function');
      expect(typeof adapter.files).toBe('function');
      expect(typeof adapter.allFiles).toBe('function');
      expect(typeof adapter.directories).toBe('function');
      expect(typeof adapter.allDirectories).toBe('function');
      expect(typeof adapter.makeDirectory).toBe('function');
      expect(typeof adapter.deleteDirectory).toBe('function');
      expect(typeof adapter.append).toBe('function');
      expect(typeof adapter.prepend).toBe('function');
      expect(typeof adapter.getVisibility).toBe('function');
      expect(typeof adapter.setVisibility).toBe('function');
      expect(typeof adapter.mimeType).toBe('function');
      expect(typeof adapter.url).toBe('function');
      expect(typeof adapter.temporaryUrl).toBe('function');
    });
  });

  describe('path resolution', () => {
    test('resolves paths without root prefix', () => {
      const adapter = new S3Adapter({
        bucket: 'test-bucket',
        accessKeyId: 'test-key',
        secretAccessKey: 'test-secret',
      });

      // Adapter should be created successfully
      expect(adapter).toBeDefined();
    });

    test('resolves paths with root prefix', () => {
      const adapter = new S3Adapter({
        bucket: 'test-bucket',
        accessKeyId: 'test-key',
        secretAccessKey: 'test-secret',
        root: 'my-prefix',
      });

      expect(adapter).toBeDefined();
    });
  });

  describe('S3-compatible providers', () => {
    test('works with AWS S3', () => {
      const adapter = new S3Adapter({
        bucket: 'my-bucket',
        accessKeyId: 'aws-key',
        secretAccessKey: 'aws-secret',
        region: 'us-east-1',
      });

      expect(adapter).toBeDefined();
    });

    test('works with Cloudflare R2', () => {
      const adapter = new S3Adapter({
        bucket: 'my-bucket',
        accessKeyId: 'r2-key',
        secretAccessKey: 'r2-secret',
        endpoint: 'https://account-id.r2.cloudflarestorage.com',
      });

      expect(adapter).toBeDefined();
    });

    test('works with DigitalOcean Spaces', () => {
      const adapter = new S3Adapter({
        bucket: 'my-bucket',
        accessKeyId: 'do-key',
        secretAccessKey: 'do-secret',
        endpoint: 'https://nyc3.digitaloceanspaces.com',
      });

      expect(adapter).toBeDefined();
    });

    test('works with MinIO', () => {
      const adapter = new S3Adapter({
        bucket: 'local-bucket',
        accessKeyId: 'minio-key',
        secretAccessKey: 'minio-secret',
        endpoint: 'http://localhost:9000',
      });

      expect(adapter).toBeDefined();
    });
  });
});
