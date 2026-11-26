const toggle = document.getElementById('cv-toggle');
const panel = document.getElementById('cv-preview');
const close = document.getElementById('cv-close');
const stage = document.getElementById('cv-stage');
const canvas = document.getElementById('cv-canvas');
const status = document.getElementById('cv-status');
const count = document.getElementById('cv-page-count');
const prev = document.getElementById('cv-prev');
const next = document.getElementById('cv-next');
const zoomOut = document.getElementById('cv-zoom-out');
const zoomIn = document.getElementById('cv-zoom-in');

let loading;
let pdf;
let pageNumber = 1;
let zoom = 1;
let renderTask;
let renderSequence = 0;

function updateControls() {
  const ready = Boolean(pdf);
  count.textContent = ready ? `Page ${pageNumber} of ${pdf.numPages}` : 'Page 1';
  prev.disabled = !ready || pageNumber === 1;
  next.disabled = !ready || pageNumber === pdf.numPages;
  zoomOut.disabled = !ready || zoom <= 0.75;
  zoomIn.disabled = !ready || zoom >= 2.5;
}

async function renderPage() {
  if (!pdf || panel.hidden) return;
  const sequence = ++renderSequence;
  if (renderTask) {
    renderTask.cancel();
    try { await renderTask.promise; } catch (_) { /* Cancelled for a newer page or size. */ }
  }
  const page = await pdf.getPage(pageNumber);
  if (sequence !== renderSequence || panel.hidden) return;
  const natural = page.getViewport({ scale: 1 });
  const available = Math.max(180, stage.clientWidth - (window.innerWidth <= 520 ? 20 : 36));
  const scale = Math.min(1.6, available / natural.width) * zoom;
  const viewport = page.getViewport({ scale });
  const density = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.ceil(viewport.width * density);
  canvas.height = Math.ceil(viewport.height * density);
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;
  canvas.setAttribute('aria-label', `CV page ${pageNumber} of ${pdf.numPages}`);
  const context = canvas.getContext('2d', { alpha: false });
  renderTask = page.render({
    canvasContext: context,
    viewport,
    transform: density === 1 ? undefined : [density, 0, 0, density, 0, 0]
  });
  try {
    await renderTask.promise;
    if (sequence === renderSequence) {
      status.textContent = `Page ${pageNumber} of ${pdf.numPages}`;
      updateControls();
    }
  } catch (error) {
    if (error?.name !== 'RenderingCancelledException') throw error;
  } finally {
    if (sequence === renderSequence) renderTask = null;
  }
}

async function openPreview() {
  panel.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
  status.textContent = 'Loading CV…';
  try {
    if (!loading) loading = (async () => {
      const pdfjs = await import('./pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('./pdf.worker.mjs', import.meta.url).href;
      return pdfjs.getDocument('/assets/cv/cv_zhang_202612_new.pdf').promise;
    })();
    pdf = await loading;
    if (panel.hidden) return;
    updateControls();
    await renderPage();
  } catch (error) {
    loading = null;
    status.textContent = 'The CV preview could not be loaded. Please try again later.';
    console.error('CV preview:', error);
  }
}

toggle.addEventListener('click', () => {
  if (panel.hidden) openPreview();
  else closePreview();
});

function closePreview() {
  ++renderSequence;
  renderTask?.cancel();
  panel.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.focus();
}

close.addEventListener('click', closePreview);
prev.addEventListener('click', () => { if (pageNumber > 1) { pageNumber--; stage.scrollTop = 0; renderPage(); } });
next.addEventListener('click', () => { if (pdf && pageNumber < pdf.numPages) { pageNumber++; stage.scrollTop = 0; renderPage(); } });
zoomOut.addEventListener('click', () => { zoom = Math.max(0.75, +(zoom - 0.25).toFixed(2)); renderPage(); updateControls(); });
zoomIn.addEventListener('click', () => { zoom = Math.min(2.5, +(zoom + 0.25).toFixed(2)); renderPage(); updateControls(); });
stage.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', event => {
  if (panel.hidden) return;
  if ((event.ctrlKey || event.metaKey) && ['s', 'p'].includes(event.key.toLowerCase())) event.preventDefault();
});
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (pdf && !panel.hidden) renderPage(); }, 150);
});
