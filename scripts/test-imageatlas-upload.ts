import assert from 'node:assert/strict';
import {
  commitImageToImageAtlas,
  ImageAtlasUploadError,
  verifyPublicImageAtlasUrl,
} from '../src/server/imageAtlasUpload';

const imagePath = 'uploads/2026/10/00000000-0000-4000-8000-000000000001-pump.jpg';
const imageBytes = Buffer.from('sanitized-image-bytes');
const token = 'test-token-never-logged';

type RecordedCall = { url: string; method: string; body?: any };
function mockFetch(handler: (call: RecordedCall) => Response | Promise<Response>) {
  const calls: RecordedCall[] = [];
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const bodyText = typeof init?.body === 'string' ? init.body : undefined;
    const call = {
      url: String(input),
      method: String(init?.method || 'GET').toUpperCase(),
      body: bodyText ? JSON.parse(bodyText) : undefined,
    };
    calls.push(call);
    return handler(call);
  }) as typeof fetch;
  return { fetchImpl, calls };
}
function jsonResponse(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function testExistingMainBranchUpload() {
  const { fetchImpl, calls } = mockFetch(call => {
    if (call.method === 'GET' && call.url.endsWith('/git/ref/heads/main')) {
      return jsonResponse(200, { ref: 'refs/heads/main' });
    }
    if (call.method === 'PUT' && call.url.includes('/contents/uploads/')) {
      return jsonResponse(201, {
        content: { path: imagePath },
        commit: { html_url: 'https://github.com/javanweb/imageatlas/commit/abcdef1234567890' },
      });
    }
    throw new Error(`Unexpected GitHub request: ${call.method} ${call.url}`);
  });

  const result = await commitImageToImageAtlas(imagePath, imageBytes, token, { fetchImpl });
  assert.equal(result.imagePath, imagePath);
  assert.equal(result.imageUrl, `https://raw.githubusercontent.com/javanweb/imageatlas/main/${imagePath}`);
  assert.equal(result.githubUrl, `https://github.com/javanweb/imageatlas/blob/main/${imagePath}`);
  assert.equal(result.commitUrl, 'https://github.com/javanweb/imageatlas/commit/abcdef1234567890');
  assert.deepEqual(calls.map(call => call.method), ['GET', 'PUT']);
  assert.equal(calls[1].body.branch, 'main');
  assert.equal(calls[1].body.content, imageBytes.toString('base64'));
}

async function testEmptyRepositoryBootstrapsMainWithImage() {
  const { fetchImpl, calls } = mockFetch(call => {
    if (call.method === 'GET' && call.url.endsWith('/git/ref/heads/main')) return jsonResponse(404, { message: 'Not Found' });
    if (call.method === 'GET' && call.url === 'https://api.github.com/repos/javanweb/imageatlas') {
      return jsonResponse(200, { default_branch: null });
    }
    if (call.method === 'POST' && call.url.endsWith('/git/blobs')) {
      assert.equal(call.body.encoding, 'base64');
      assert.equal(call.body.content, imageBytes.toString('base64'));
      return jsonResponse(201, { sha: 'blob-sha' });
    }
    if (call.method === 'POST' && call.url.endsWith('/git/trees')) {
      assert.deepEqual(call.body.tree, [{ path: imagePath, mode: '100644', type: 'blob', sha: 'blob-sha' }]);
      return jsonResponse(201, { sha: 'tree-sha' });
    }
    if (call.method === 'POST' && call.url.endsWith('/git/commits')) {
      assert.deepEqual(call.body.parents, []);
      assert.equal(call.body.tree, 'tree-sha');
      return jsonResponse(201, {
        sha: 'commit-sha',
        html_url: 'https://github.com/javanweb/imageatlas/commit/commitsha1234567',
      });
    }
    if (call.method === 'POST' && call.url.endsWith('/git/refs')) {
      assert.deepEqual(call.body, { ref: 'refs/heads/main', sha: 'commit-sha' });
      return jsonResponse(201, { ref: 'refs/heads/main' });
    }
    throw new Error(`Unexpected GitHub request: ${call.method} ${call.url}`);
  });

  const result = await commitImageToImageAtlas(imagePath, imageBytes, token, { fetchImpl });
  assert.equal(result.commitUrl, 'https://github.com/javanweb/imageatlas/commit/commitsha1234567');
  assert.deepEqual(calls.map(call => call.method), ['GET', 'GET', 'POST', 'POST', 'POST', 'POST']);
  assert.equal(calls.some(call => call.method === 'PUT'), false, 'The first image should initialize the empty main branch directly.');
}

async function testDoesNotCreateUnrelatedMainBranch() {
  const { fetchImpl, calls } = mockFetch(call => {
    if (call.method === 'GET' && call.url.endsWith('/git/ref/heads/main')) return jsonResponse(404, {});
    if (call.method === 'GET' && call.url === 'https://api.github.com/repos/javanweb/imageatlas') {
      return jsonResponse(200, { default_branch: 'master' });
    }
    throw new Error(`Unexpected GitHub request: ${call.method} ${call.url}`);
  });

  await assert.rejects(
    commitImageToImageAtlas(imagePath, imageBytes, token, { fetchImpl }),
    (error: unknown) => error instanceof ImageAtlasUploadError && error.statusCode === 409,
  );
  assert.equal(calls.some(call => call.method === 'POST'), false);
}

async function testPublicLinkVerification() {
  let attempts = 0;
  const fetchImpl = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(init?.method, 'HEAD');
    attempts += 1;
    return new Response(null, { status: attempts < 3 ? 404 : 200 });
  }) as typeof fetch;
  await verifyPublicImageAtlasUrl(
    `https://raw.githubusercontent.com/javanweb/imageatlas/main/${imagePath}`,
    { fetchImpl, timeoutMs: 500, attempts: 3 },
  );
  assert.equal(attempts, 3, 'A newly created raw URL should be rechecked briefly for public CDN propagation.');
}

await testExistingMainBranchUpload();
await testEmptyRepositoryBootstrapsMainWithImage();
await testDoesNotCreateUnrelatedMainBranch();
await testPublicLinkVerification();
console.log('ImageAtlas upload test passed: existing branch, empty-repo bootstrap, branch safety, and public-link verification.');
