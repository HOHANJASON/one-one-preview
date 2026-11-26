const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function animateNumber(element) {
  if (reducedMotion.matches) return;
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / 620, 1);
    element.textContent = String(Math.round(48 * (1 - (1 - progress) ** 3)));
    if (progress < 1 && !reducedMotion.matches) requestAnimationFrame(frame);
    else element.textContent = '48';
  }
  requestAnimationFrame(frame);
}

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in-view');
      const percent = entry.target.querySelector('#percent');
      if (percent) animateNumber(percent);
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.22 });
  document.querySelectorAll('[data-reveal]').forEach(section => observer.observe(section));
}

const dialog = document.querySelector('#preview');
if (typeof dialog.showModal === 'function') {
  const stages = [...dialog.querySelectorAll('[data-stage]')];
  const prev = dialog.querySelector('#previous-stage');
  const next = dialog.querySelector('#next-stage');
  let active = 0;

  function showStage() {
    stages.forEach((section, index) => { section.hidden = index !== active; });
    prev.disabled = active === 0;
    next.textContent = active === stages.length - 1 ? '完成預覽' : '下一步';
  }

  document.querySelectorAll('[data-preview]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialog.querySelector('#selected-plan').textContent = link.dataset.preview || '小額週轉';
    active = 0;
    showStage();
    dialog.showModal();
  }));
  prev.addEventListener('click', () => { active--; showStage(); });
  next.addEventListener('click', () => {
    if (active === stages.length - 1) dialog.close();
    else { active++; showStage(); }
  });
}
