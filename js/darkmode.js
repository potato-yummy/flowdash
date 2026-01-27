document.addEventListener('DOMContentLoaded', () => {
  const modeBtn = document.querySelector('.Mode');
  const body = document.body;

  if (!modeBtn) return;

  const modeIcon = modeBtn.querySelector('span');

  function applyTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      if (modeIcon) modeIcon.textContent = '🌙';
    } else {
      body.classList.remove('dark-mode');
      if (modeIcon) modeIcon.textContent = '☀️';
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  modeBtn.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-mode');
    const newTheme = isDark ? 'light' : 'dark';

    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
});
