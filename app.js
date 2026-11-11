// 1) 分类筛选
const filters = document.getElementById('filters');
const cards = Array.from(document.querySelectorAll('#projectGrid .card'));

filters.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  filters.querySelectorAll('.chip').forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  const f = btn.dataset.filter;
  cards.forEach(card => {
    const cats = (card.dataset.cat || '').split(/\s+/);
    const show = f === 'all' || cats.includes(f);
    card.classList.toggle('is-hidden', !show);
  });
});

// 2) 媒体位：用 <img>/<video> 元素探测（兼容 file:// 与 http）
//    文件存在 -> 自动替换成真实媒体；不存在 -> 保持占位
const slots = Array.from(document.querySelectorAll('.media-slot'));

function markLoaded(slot) {
  slot.classList.add('is-loaded');
}

function loadPhoto(slot, src) {
  const img = new Image();
  img.onload = () => {
    slot.innerHTML = '';
    img.alt = slot.querySelector('.cap') ? '' : '';
    img.loading = 'lazy';
    slot.appendChild(img);
    markLoaded(slot);
  };
  img.onerror = () => { /* 保持占位 */ };
  img.src = src;
}

function loadVideo(slot, src) {
  const v = document.createElement('video');
  v.muted = true;
  v.loop = true;
  v.playsInline = true;
  v.preload = 'metadata';
  if (slot.dataset.poster) v.poster = slot.dataset.poster;
  v.onloadedmetadata = () => {
    slot.innerHTML = '';
    slot.appendChild(v);
    markLoaded(slot);
    slot.addEventListener('mouseenter', () => v.play().catch(() => {}));
    slot.addEventListener('mouseleave', () => v.pause());
  };
  v.onerror = () => { /* 保持占位 */ };
  v.src = src;
}

slots.forEach(slot => {
  const src = slot.dataset.src;
  if (!src) return;
  if (slot.dataset.type === 'video') loadVideo(slot, src);
  else loadPhoto(slot, src);
});

// 3) 点击打开灯箱（已加载的看大图/播放；未加载的提示放文件位置）
const lb = document.getElementById('lightbox');
const lbBody = document.getElementById('lbBody');
const lbClose = document.getElementById('lbClose');
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
}

function openLightbox(node) {
  lbBody.innerHTML = '';
  lbBody.appendChild(node);
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lb.hidden = true;
  lbBody.innerHTML = '';
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLightbox(); });

document.querySelectorAll('.media-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    const src = slot.dataset.src;
    if (slot.classList.contains('is-loaded')) {
      const media = slot.querySelector('img, video');
      if (!media) return;
      if (media.tagName === 'VIDEO') {
        const v = media.cloneNode(true);
        v.controls = true; v.muted = false; v.loop = false;
        openLightbox(v);
        v.play().catch(() => {});
      } else {
        openLightbox(media.cloneNode(true));
      }
    } else {
      showToast('把文件放到 ' + src + ' 后刷新即可自动显示');
    }
  });
});

// 4) 导航高亮（简单滚动监听）
const navLinks = Array.from(document.querySelectorAll('.nav a'));
const sections = navLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

window.addEventListener('scroll', () => {
  const y = window.scrollY + 90;
  let current = null;
  sections.forEach(sec => { if (sec.offsetTop <= y) current = sec; });
  navLinks.forEach(a => {
    a.style.color = (current && a.getAttribute('href') === '#' + current.id) ? '#e8eef7' : '';
  });
}, { passive: true });
// 5) 点击复制（QQ / 微信）
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showToast('已复制：' + text);
  });
});
