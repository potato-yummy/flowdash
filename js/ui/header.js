function initHeaderAndTheme() {
  // 인삿말 및 날짜
  const now = new Date();
  const hours = now.getHours();
  let greeting = GREETINGS.DEFAULT;
  if (hours >= 5 && hours < 11) greeting = GREETINGS.MORNING;
  else if (hours >= 11 && hours < 17) greeting = GREETINGS.AFTERNOON;
  else if (hours >= 17 && hours < 22) greeting = GREETINGS.EVENING;
  if (selectors.greetingMessage) selectors.greetingMessage.textContent = greeting;
  if (selectors.todayDate)
    selectors.todayDate.textContent = now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // 닉네임 로드
  const savedName = storage.loadNickname();
  if (savedName) {
    selectors.nicknameModal.classList.add('hidden');
    selectors.nicknameDisplay.textContent = savedName;
  }

  // 테마 설정
  const applyTheme = (theme) => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    if (selectors.themeIcon) selectors.themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  };
  applyTheme(storage.loadTheme());

  selectors.themeBtn?.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(nextTheme);
    storage.saveTheme(nextTheme);
  });
}

selectors.nicknameDisplay?.addEventListener('click', () => {
  if (selectors.nicknameDisplay.querySelector('input')) return;

  const currentName = selectors.nicknameDisplay.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.classList.add('nickname-edit-input');
  input.maxLength = 10;

  selectors.nicknameDisplay.textContent = '';
  selectors.nicknameDisplay.appendChild(input);
  input.focus();

  input.onblur = () => {
    const newName = input.value.trim() || currentName;
    storage.saveNickname(newName);
    selectors.nicknameDisplay.textContent = newName;
  };

  input.onkeydown = (e) => {
    if (e.key === 'Enter') input.blur();
  };
});
