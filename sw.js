/* Bấm giờ — service worker
   - Điều hướng (mở trang): ưu tiên mạng, quá 3 giây thì dùng bản đã lưu
   - Tài nguyên tĩnh: trả bản đã lưu ngay, cập nhật ngầm
   - Mất mạng: trả đúng trang đã lưu, không có thì trả trang chủ
   Đổi VERSION mỗi khi muốn xoá sạch cache cũ.
*/
const VERSION = 'v4';
const SHELL = 'shell-' + VERSION;
const RUNTIME = 'runtime-' + VERSION;
const SHELL_FILES = ['./', 'index.html', 'app.css', 'app.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];
const NET_TIMEOUT = 3000;
const MAX_RUNTIME = 80;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await Promise.all(SHELL_FILES.map((file) =>
      cache.add(new Request(file, { cache: 'reload' })).catch(() => {})
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL, RUNTIME]);
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* Cho phép trang gọi reg.waiting.postMessage('SKIP_WAITING') nếu cần */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_RUNTIME; i++) {
    await cache.delete(keys[i]);
  }
}

async function fromCache(request) {
  const exact = await caches.match(request);
  if (exact) return exact;
  /* Cùng đường dẫn nhưng khác query (?tool=…) */
  const url = new URL(request.url);
  url.search = '';
  const byPath = await caches.match(url.href);
  if (byPath) return byPath;
  return (await caches.match('index.html')) || (await caches.match('./'));
}

async function handleNavigate(request) {
  const network = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        const cache = await caches.open(RUNTIME);
        await cache.put(request, response.clone());
        trim(cache);
      }
      return response;
    })
    .catch(() => null);

  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NET_TIMEOUT));
  const fresh = await Promise.race([network, timeout]);
  if (fresh && fresh.ok) return fresh;

  const cached = await fromCache(request);
  return cached || fresh || Response.error();
}

/* JS/CSS: ưu tiên mạng để index.html mới không chạy với app.js cũ */
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME);
  const network = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        await cache.put(request, response.clone());
        trim(cache);
      }
      return response;
    })
    .catch(() => null);

  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NET_TIMEOUT));
  const fresh = await Promise.race([network, timeout]);
  if (fresh && fresh.ok) return fresh;

  const cached = await caches.match(request);
  return cached || fresh || Response.error();
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(async (response) => {
      if (response && response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
        trim(cache);
      }
      return response;
    })
    .catch(() => null);
  return cached || (await network) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  /* Không can thiệp vào request tải từng đoạn (audio, video) */
  if (request.headers.has('range')) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigate(request));
    return;
  }
  if (/\.(?:js|css)$/.test(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(staleWhileRevalidate(request));
});

/* Bấm giờ — bản sửa 14/11/2026 */
