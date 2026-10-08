export const IMAGEATLAS_OWNER = 'javanweb';
export const IMAGEATLAS_REPOSITORY = 'imageatlas';
export const IMAGEATLAS_BRANCH = 'main';

export interface ImageAtlasCommitResult {
  imagePath: string;
  imageUrl: string;
  githubUrl: string;
  commitUrl: string;
}

export class ImageAtlasUploadError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ImageAtlasUploadError';
    this.statusCode = statusCode;
  }
}

interface GitHubResponse {
  status: number;
  ok: boolean;
  data: any;
}

const API_ROOT = `https://api.github.com/repos/${IMAGEATLAS_OWNER}/${IMAGEATLAS_REPOSITORY}`;
const RAW_ROOT = `https://raw.githubusercontent.com/${IMAGEATLAS_OWNER}/${IMAGEATLAS_REPOSITORY}/${IMAGEATLAS_BRANCH}`;
const BLOB_ROOT = `https://github.com/${IMAGEATLAS_OWNER}/${IMAGEATLAS_REPOSITORY}/blob/${IMAGEATLAS_BRANCH}`;

function pathUrl(base: string, filePath: string): string {
  return `${base}/${filePath.split('/').map(encodeURIComponent).join('/')}`;
}

function statusMessage(status: number): string {
  if (status === 401) return 'GitHub رد درخواست ذخیره را داد؛ توکن IMAGEATLAS_GITHUB_TOKEN معتبر نیست.';
  if (status === 403) return 'توکن سرور اجازهٔ نوشتن در مخزن imageatlas را ندارد؛ دسترسی Contents: Read and write را بررسی کنید.';
  if (status === 404) return 'مخزن imageatlas پیدا نشد یا سرور به آن دسترسی ندارد؛ مالک، نام مخزن و دسترسی توکن را بررسی کنید.';
  if (status === 409) return 'شاخهٔ مخزن هم‌زمان تغییر کرده است؛ لطفاً یک‌بار دیگر تلاش کنید.';
  if (status === 422) return 'GitHub ساخت commit تصویر را نپذیرفت؛ وضعیت مخزن و دسترسی Contents: Write را بررسی کنید.';
  return `ذخیره تصویر در GitHub ناموفق بود (HTTP ${status}).`;
}

function requestError(status: number): ImageAtlasUploadError {
  return new ImageAtlasUploadError(502, statusMessage(status));
}

/**
 * Commit a sanitized image into the public imageatlas repository. If the repo
 * has no branch yet, the first image becomes the root commit on main; later
 * uploads use GitHub's Contents API as normal.
 */
export async function commitImageToImageAtlas(
  imagePath: string,
  imageBytes: Buffer,
  token: string,
  options: { fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<ImageAtlasCommitResult> {
  const fetchImpl = options.fetchImpl || fetch;
  const timeoutMs = Math.max(1000, options.timeoutMs || 15000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'atlas-part-image-upload',
  };

  const request = async (url: string, method: string, body?: unknown): Promise<GitHubResponse> => {
    const response = await fetchImpl(url, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
    });
    let data: any = {};
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }
    return { status: response.status, ok: response.ok, data };
  };

  const contentsUrl = pathUrl(`${API_ROOT}/contents`, imagePath);
  const imageUrl = pathUrl(RAW_ROOT, imagePath);
  const githubUrl = pathUrl(BLOB_ROOT, imagePath);

  try {
    const refUrl = `${API_ROOT}/git/ref/heads/${encodeURIComponent(IMAGEATLAS_BRANCH)}`;
    const branchRef = await request(refUrl, 'GET');
    if (branchRef.status === 404) {
      // Do not create an unrelated root branch if a non-empty repository uses
      // another default branch. For a genuinely empty repo, start main with the
      // uploaded image as the first commit.
      const repo = await request(API_ROOT, 'GET');
      if (!repo.ok) throw requestError(repo.status);
      const defaultBranch = String(repo.data?.default_branch || '').trim();
      if (defaultBranch && defaultBranch !== IMAGEATLAS_BRANCH) {
        throw new ImageAtlasUploadError(
          409,
          `در مخزن imageatlas شاخهٔ پیش‌فرض «${defaultBranch}» است، نه «${IMAGEATLAS_BRANCH}»؛ شاخه را در تنظیمات مخزن هماهنگ کنید.`,
        );
      }

      const blob = await request(`${API_ROOT}/git/blobs`, 'POST', {
        content: imageBytes.toString('base64'),
        encoding: 'base64',
      });
      if (!blob.ok || !blob.data?.sha) throw requestError(blob.status);

      const tree = await request(`${API_ROOT}/git/trees`, 'POST', {
        tree: [{ path: imagePath, mode: '100644', type: 'blob', sha: blob.data.sha }],
      });
      if (!tree.ok || !tree.data?.sha) throw requestError(tree.status);

      const commit = await request(`${API_ROOT}/git/commits`, 'POST', {
        message: `Upload public part image (${imagePath.split('/').pop()})`,
        tree: tree.data.sha,
        parents: [],
      });
      if (!commit.ok || !commit.data?.sha) throw requestError(commit.status);

      const createRef = await request(`${API_ROOT}/git/refs`, 'POST', {
        ref: `refs/heads/${IMAGEATLAS_BRANCH}`,
        sha: commit.data.sha,
      });
      if (createRef.ok) {
        return { imagePath, imageUrl, githubUrl, commitUrl: String(commit.data?.html_url || '') };
      }

      // A different server instance may have initialized main concurrently.
      // If so, write this image as a normal Contents API commit on that branch.
      if (createRef.status === 409 || createRef.status === 422) {
        const concurrentRef = await request(refUrl, 'GET');
        if (!concurrentRef.ok) throw requestError(createRef.status);
      } else {
        throw requestError(createRef.status);
      }
    } else if (!branchRef.ok) {
      throw requestError(branchRef.status);
    }

    const uploadBody = {
      message: `Upload public part image (${imagePath.split('/').pop()})`,
      content: imageBytes.toString('base64'),
      branch: IMAGEATLAS_BRANCH,
    };
    let uploaded = await request(contentsUrl, 'PUT', uploadBody);
    // GitHub can return 409 when independent uploads advance main concurrently.
    if (uploaded.status === 409) {
      await new Promise(resolve => setTimeout(resolve, 180));
      uploaded = await request(contentsUrl, 'PUT', uploadBody);
    }
    if (!uploaded.ok) throw requestError(uploaded.status);

    return {
      imagePath,
      imageUrl,
      githubUrl,
      commitUrl: String(uploaded.data?.commit?.html_url || ''),
    };
  } catch (error: any) {
    if (error instanceof ImageAtlasUploadError) throw error;
    throw new ImageAtlasUploadError(
      502,
      controller.signal.aborted
        ? 'مهلت اتصال GitHub برای ثبت تصویر تمام شد؛ تصویر را دوباره ارسال کنید.'
        : 'ارتباط با GitHub برای ثبت تصویر برقرار نشد؛ بعداً دوباره تلاش کنید.',
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Verify that the committed raw image URL is public before handing it to the AI Worker. */
export async function verifyPublicImageAtlasUrl(
  imageUrl: string,
  options: { fetchImpl?: typeof fetch; timeoutMs?: number; attempts?: number } = {},
): Promise<void> {
  const fetchImpl = options.fetchImpl || fetch;
  const attempts = Math.max(1, Math.min(3, options.attempts || 3));
  const timeoutMs = Math.max(500, options.timeoutMs || 1800);
  let lastStatus = 0;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(imageUrl, {
        method: 'HEAD',
        headers: { Accept: 'image/jpeg' },
        signal: controller.signal,
      });
      lastStatus = response.status;
      if (response.ok) return;
    } catch {
      lastStatus = controller.signal.aborted ? 408 : 0;
    } finally {
      clearTimeout(timer);
    }
    if (attempt + 1 < attempts) await new Promise(resolve => setTimeout(resolve, 250 * (attempt + 1)));
  }

  if (lastStatus === 403 || lastStatus === 404) {
    throw new ImageAtlasUploadError(502, 'تصویر در مخزن ثبت شد، اما لینک عمومی آن هنوز در دسترس نیست؛ چند لحظه بعد دوباره تلاش کنید.');
  }
  throw new ImageAtlasUploadError(502, 'تصویر در مخزن ثبت شد، اما دسترسی عمومی به لینک آن تأیید نشد.');
}
