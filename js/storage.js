const storage = {
  saveTodos: (data) => localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(data)),
  loadTodos: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS)) || [],
  saveTheme: (theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme),
  loadTheme: () => localStorage.getItem(STORAGE_KEYS.THEME) || 'light',
  saveNickname: (name) => localStorage.setItem(STORAGE_KEYS.NICKNAME, name),
  loadNickname: () => localStorage.getItem(STORAGE_KEYS.NICKNAME),
};
