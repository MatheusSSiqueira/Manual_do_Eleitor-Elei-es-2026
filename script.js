document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos do DOM ---
  const root = document.documentElement;
  const body = document.body;
  const layout = document.querySelector('.layout');
  const sidebar = document.querySelector('#sidebar');
  const sidebarBackdrop = document.querySelector('#sidebar-backdrop');
  const content = document.querySelector('#manual-content');
  const toc = document.querySelector('#toc');
  const search = document.querySelector('#site-search');
  const searchMeta = document.querySelector('#search-meta');
  const noResults = document.querySelector('#no-results');
  const progressBar = document.querySelector('#progress-bar');
  
  // Leitor de Áudio
  const reader = document.querySelector('#reader');
  const readerStatus = document.querySelector('#reader-status');
  const readerRate = document.querySelector('#reader-rate');
  const rateVal = document.querySelector('#rate-val');

  // Botões de Interação
  const btnToggleSidebar = document.querySelector('#toggle-sidebar');
  const btnCloseSidebarMobile = document.querySelector('#close-sidebar-mobile');
  const btnTheme = document.querySelector('#toggle-theme');
  const btnContrast = document.querySelector('#toggle-contrast');
  const btnFont = document.querySelector('#toggle-font');
  const btnReader = document.querySelector('#open-reader');
  const btnTop = document.querySelector('#back-top');
  const btnReset = document.querySelector('#reset-view');

  // Proteção estrutural: Interrompe a execução se o DOM principal não existir
  if (!content || !layout) return;

  let sections = [];
  let currentIndex = 0;
  const synth = window.speechSynthesis;

  // --- 1. Controle de Exibição da Lateral ---
  const isMobile = () => window.innerWidth <= 900;
  const savedSidebar = localStorage.getItem('manual-sidebar-hidden');

  if (!isMobile() && savedSidebar === 'true') {
    layout.classList.add('sidebar-hidden');
    btnToggleSidebar?.setAttribute('aria-expanded', 'false');
  }

  function toggleSidebar() {
    if (isMobile()) {
      const open = sidebar?.classList.toggle('mobile-open');
      sidebarBackdrop?.classList.toggle('active', open);
    } else {
      const isHidden = layout.classList.toggle('sidebar-hidden');
      btnToggleSidebar?.setAttribute('aria-expanded', String(!isHidden));
      localStorage.setItem('manual-sidebar-hidden', String(isHidden));
    }
  }

  function closeMobileSidebar() {
    sidebar?.classList.remove('mobile-open');
    sidebarBackdrop?.classList.remove('active');
  }

  btnToggleSidebar?.addEventListener('click', toggleSidebar);
  btnCloseSidebarMobile?.addEventListener('click', closeMobileSidebar);
  sidebarBackdrop?.addEventListener('click', closeMobileSidebar);

  // --- 2. Persistência de Preferências ---
  if (localStorage.getItem('manual-theme')) root.dataset.theme = localStorage.getItem('manual-theme');
  if (localStorage.getItem('manual-contrast') === 'high') root.dataset.contrast = 'high';
  if (localStorage.getItem('manual-font')) body.dataset.font = localStorage.getItem('manual-font');

  btnTheme?.addEventListener('click', () => {
    const isDark = root.dataset.theme === 'dark';
    root.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem('manual-theme', root.dataset.theme);
  });

  btnContrast?.addEventListener('click', () => {
    const isHigh = root.dataset.contrast === 'high';
    if (isHigh) delete root.dataset.contrast;
    else root.dataset.contrast = 'high';
    localStorage.setItem('manual-contrast', isHigh ? 'normal' : 'high');
  });

  btnFont?.addEventListener('click', () => {
    const current = body.dataset.font;
    const next = current === 'large' ? 'xlarge' : current === 'xlarge' ? '' : 'large';
    if (next) body.dataset.font = next;
    else delete body.dataset.font;
    localStorage.setItem('manual-font', next);
  });

  btnTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  btnReset?.addEventListener('click', () => {
    localStorage.clear();
    delete root.dataset.theme;
    delete root.dataset.contrast;
    delete body.dataset.font;
    layout.classList.remove('sidebar-hidden');
    if(search) search.value = '';
    filterSections('');
  });

  // --- 3. Extração e Construção do Índice ---
  const allH2 = [...content.querySelectorAll('h2')];
  sections = allH2.map((h, i) => {
    h.id = `sec-${i}`;
    return { title: h.textContent.trim(), h, bodyText: collectSectionText(h) };
  });

  function collectSectionText(h) {
    const parts = [];
    let n = h.nextElementSibling;
    while (n && n.tagName !== 'H2') {
      let text = n.innerText || n.textContent || '';
      text = text.replace(/[\n\t]+/g, '. ');
      parts.push(text);
      n = n.nextElementSibling;
    }
    return parts.join('. ');
  }

  if (toc) {
    const tocFragment = document.createDocumentFragment();
    sections.forEach((s, i) => {
      const a = document.createElement('a');
      a.href = `#sec-${i}`;
      a.textContent = s.title;
      a.dataset.index = i;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (isMobile()) closeMobileSidebar();
        s.h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      tocFragment.appendChild(a);
    });
    toc.appendChild(tocFragment);
  }

  // --- 4. Busca Suspensa ---
  function filterSections(query) {
    const q = query.trim().toLowerCase();
    let count = 0;

    sections.forEach((sec, i) => {
      const match = !q || (sec.title + ' ' + sec.bodyText).toLowerCase().includes(q);
      const elements = [sec.h];
      let n = sec.h.nextElementSibling;
      while (n && n.tagName !== 'H2') {
        elements.push(n);
        n = n.nextElementSibling;
      }
      elements.forEach(el => el.classList.toggle('section-hidden', !match));
      
      if (toc) {
        const link = toc.querySelector(`[data-index="${i}"]`);
        link?.classList.toggle('section-hidden', !match);
      }
      if (match) count++;
    });

    if (noResults) noResults.hidden = count !== 0;
    if (searchMeta) searchMeta.textContent = q ? `${count} seção(ões) encontrada(s).` : '';
  }

  search?.addEventListener('input', e => filterSections(e.target.value));

  // --- 5. Acompanhamento de Rolagem ---
  function onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    if (progressBar) {
        progressBar.style.width = maxScroll > 0 ? `${(currentScroll / maxScroll) * 100}%` : '0%';
    }

    let activeIndex = 0;
    sections.forEach((s, i) => {
      if (s.h.getBoundingClientRect().top <= 120) activeIndex = i;
    });

    if (toc) {
        toc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        toc.querySelector(`[data-index="${activeIndex}"]`)?.classList.add('active');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- 6. Leitor de Áudio Acessível ---
  function sanitizeForSpeech(text) {
    return text
      .replace(/1º/g, 'primeiro')
      .replace(/2º/g, 'segundo')
      .replace(/3º/g, 'terceiro')
      .replace(/4º/g, 'quarto')
      .replace(/5º/g, 'quinto')
      .replace(/6º/g, 'sexto')
      .replace(/([Cc]andidato|[Pp]artido|[Gg]overnador|[Ss]enador)\s+A\b/g, '$1 Á')
      .replace(/([Cc]andidato|[Pp]artido|[Gg]overnador|[Ss]enador)\s+B\b/g, '$1 Bê')
      .replace(/([Cc]andidato|[Pp]artido|[Gg]overnador|[Ss]enador)\s+C\b/g, '$1 Cê')
      .replace(/([Cc]andidato|[Pp]artido|[Gg]overnador|[Ss]enador)\s+D\b/g, '$1 Dê')
      .replace(/%/g, ' por cento')
      .replace(/nº/g, 'número')
      .replace(/\s*[—–-]\s*/g, ' com ') 
      .replace(/([a-zA-Z])\/([a-zA-Z])/g, '$1 ou $2') 
      .replace(/(\d+)\/(\d+)/g, '$1 de $2') 
      .replace(/\bDF\b/g, 'Distrito Federal')
      .replace(/\bTSE\b/g, 'Tribunal Superior Eleitoral')
      .replace(/(\d{2})\/(\d{2})\/(\d{4})/g, '$1 do $2 de $3')
      .replace(/\b2024\b/g, 'dois mil e vinte e quatro')
      .replace(/\b2026\b/g, 'dois mil e vinte e seis')
      .replace(/\b2028\b/g, 'dois mil e vinte e oito')
      .replace(/\b(\d{4})\b/g, ' $1 ')
      .replace(/[_\*]/g, ''); 
  }

  function readCurrent() {
    if (!synth) return;
    synth.cancel();
    const item = sections[currentIndex];
    if (!item) return;

    const rawText = `${item.title}. ${item.bodyText}`;
    const cleanText = sanitizeForSpeech(rawText);

    const u = new SpeechSynthesisUtterance(cleanText);
    u.lang = 'pt-BR';
    u.rate = Number(readerRate?.value || 1);
    
    u.onstart = () => { if(readerStatus) readerStatus.textContent = `Lendo: ${item.title}`; };
    u.onend = () => {
      if (currentIndex < sections.length - 1) {
        currentIndex++;
        readCurrent();
      } else {
        if(readerStatus) readerStatus.textContent = 'Leitura finalizada.';
      }
    };
    synth.speak(u);
  }

  btnReader?.addEventListener('click', () => {
    reader?.classList.add('open');
    readCurrent();
  });

  document.querySelector('#reader-play')?.addEventListener('click', readCurrent);
  document.querySelector('#reader-pause')?.addEventListener('click', () => synth?.pause());
  document.querySelector('#reader-resume')?.addEventListener('click', () => synth?.resume());
  document.querySelector('#reader-stop')?.addEventListener('click', () => { synth?.cancel(); if(readerStatus) readerStatus.textContent = 'Leitura pausada.'; });
  document.querySelector('#reader-prev')?.addEventListener('click', () => { currentIndex = Math.max(0, currentIndex - 1); readCurrent(); });
  document.querySelector('#reader-next')?.addEventListener('click', () => { currentIndex = Math.min(sections.length - 1, currentIndex + 1); readCurrent(); });
  document.querySelector('#reader-close')?.addEventListener('click', () => { synth?.cancel(); reader?.classList.remove('open'); });

  readerRate?.addEventListener('input', () => {
    if(rateVal) rateVal.textContent = `${readerRate.value}x`;
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      search?.focus();
    }
  });
});