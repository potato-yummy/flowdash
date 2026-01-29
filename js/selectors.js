const selectors = {
  // 헤더 및 테마
  nicknameModal: document.querySelector('.nickname-modal'),
  nicknameInput: document.querySelector('.nickname-setting-container input'),
  nicknameConfirmBtn: document.querySelector('.login-btn'),
  nicknameDisplay: document.querySelector('.nickname'),
  greetingMessage: document.getElementById('greeting-message'),
  todayDate: document.getElementById('today-date'),
  themeBtn: document.querySelector('.mode'),
  themeIcon: document.querySelector('.mode span'),

  // 대시보드 및 보드
  todoList: document.getElementById('todo-list'),
  progressList: document.getElementById('progress-list'),
  doneList: document.getElementById('done-list'),
  dashboardNums: {
    total: document.querySelector('.total-tasks p'),
    todo: document.querySelector('.to-do p'),
    progress: document.querySelector('.in-progress p'),
    done: document.querySelector('.done p'),
    achievement: document.querySelector('.achievement p'),
  },

  // 모달 부품
  modal: document.querySelector('.modal'),
  modalTitle: document.querySelector('.modal-new-correct'),
  titleInput: document.querySelector(".modal-popup input[type='text']"),
  contentInput: document.querySelector('.modal-content-input'),
  statusSelect: document.querySelector('.modal-todo-list'),
  saveBtn: document.querySelector('.modal-save'),
  cancelBtn: document.querySelector('.modal-cancel'),
  priorityButtons: document.querySelectorAll('.modal-priority button'),

  // 검색/필터 컨트롤
  searchInput: document.querySelector('.to-do-search input'),
  termSelect: document.querySelector('.term'),
  prioritySelect: document.querySelector('.priority'),
  sortBtn: document.querySelector('.array'),
  addBtn: document.querySelector('.add'),
  filterChipsContainer: document.getElementById('filter-status-tags'),
};
