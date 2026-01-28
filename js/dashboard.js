// [1. 데이터 중앙 관리]
let todoList = [];
let editTargetId = null;

const STATUS_MAP = {
  '할 일': 'to do',
  '진행 중': 'in progress',
  완료: 'done',
};

const REVERSE_STATUS_MAP = {
  'to do': '할 일',
  'in progress': '진행 중',
  done: '완료',
};

// [유틸리티: 날짜 포맷 함수] (YYYY. MM. DD HH:mm 형식)
function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const Y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, '0');
  const D = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${Y}. ${M}. ${D} ${h}:${m}`;
}

// [유틸리티: 로컬스토리지 저장]
function saveToLocalStorage() {
  localStorage.setItem('flowDash_todos', JSON.stringify(todoList));
}

// [2. 필터 및 정렬 상태 관리 (Global State)]
const currentFilters = {
  search: '',
  term: '전체 기간',
  priority: '전체 우선순위',
  sortOrder: 'asc',
};

// [3. DOM 요소 가져오기]
const searchInput = document.querySelector('.to-do-search input');
const termSelect = document.querySelector('.term');
const prioritySelect = document.querySelector('.priority');
const sortBtn = document.querySelector('.array');
const todoColumn = document.querySelector('#todo-list');
const progressColumn = document.querySelector('#progress-list');
const doneColumn = document.querySelector('#done-list');

// [4. 빈 화면(Empty State) UI 템플릿]
const emptyStateHTML = `
  <div class="empty-state" style="text-align: center; padding: 50px; width: 100%; grid-column: 1 / span 3;">
    <h2 style="color: #9ba9ba;">검색 결과가 없습니다.</h2>
    <p style="color: #c1c1c1;">새로운 아이템을 추가하여 시작해보세요!</p>
  </div>
`;

// [5. 복합 필터링 및 정렬]
function applyFilterAndSort() {
  // 1) 필터링 로직
  const filtered = todoList.filter((item) => {
    // 검색어 필터
    const matchesSearch =
      item.title.toLowerCase().includes(currentFilters.search) ||
      item.content.toLowerCase().includes(currentFilters.search);

    // 우선순위 필터
    const matchespriority =
      currentFilters.priority === '전체 우선순위' || item.priority === currentFilters.priority;

    // 기간 필터 로직
    let matchesterm = true;
    if (currentFilters.term === '오늘') {
      const today = new Date().toISOString().split('T')[0];
      const itemDate = new Date(item.id).toISOString().split('T')[0];
      matchesterm = today === itemDate;
    } else if (currentFilters.term === '최근 7일') {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      matchesterm = item.id >= sevenDaysAgo;
    }

    return matchesSearch && matchespriority && matchesterm;
  });

  // 2) 정렬 로직
  filtered.sort((a, b) => {
    return currentFilters.sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
  });

  // 3) UI 업데이트 (리스트, 대시보드, 칩)
  renderKanban(filtered);
  updateDashboard(filtered);
  renderFilterChips();
  saveToLocalStorage();
}

// [6. 통계 업데이트]
function updateDashboard(data) {
  const total = data.length;
  const todoCount = data.filter((item) => item.status === 'to do').length;
  const progressCount = data.filter((item) => item.status === 'in progress').length;
  const doneCount = data.filter((item) => item.status === 'done').length;
  const achievement = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  document.querySelector('.total-tasks p').textContent = total;
  document.querySelector('.to-do p').textContent = todoCount;
  document.querySelector('.in-progress p').textContent = progressCount;
  document.querySelector('.done p').textContent = doneCount;
  document.querySelector('.achievement p').textContent = total === 0 ? '-' : `${achievement}%`;
}

// [7. 칸반 보드 렌더링]
function renderKanban(items) {
  todoColumn.innerHTML = '';
  progressColumn.innerHTML = '';
  doneColumn.innerHTML = '';

  // 데이터가 없을 때 각 컬럼에 안내 문구 표시
  if (items.length === 0) {
    const emptyMsg = `<p class="empty-msg">내역이 없습니다</p>`;
    todoColumn.innerHTML = `<p class="empty-msg">할 일이 없습니다</p>`;
    progressColumn.innerHTML = `<p class="empty-msg">진행 중인 일이 없습니다</p>`;
    doneColumn.innerHTML = `<p class="empty-msg">완료된 일이 없습니다</p>`;
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'todo-card';

    if (item.status === 'done') {
      card.classList.add('is-done');
    }

    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) return; // 삭제 버튼 클릭 시 무시
      openEditModal(item);
    });

    let dateHTML = `<div class="card-footer">생성: ${formatDate(item.createdAt)}</div>`;
    if (item.status === 'in progress' && item.updatedAt) {
      dateHTML += `<div class="card-footer">수정: ${formatDate(item.updatedAt)}</div>`;
    } else if (item.status === 'done' && item.completedAt) {
      dateHTML = `<div class="card-footer">완료: ${formatDate(item.completedAt)}</div>`;
    }

    card.innerHTML = `
      <div class="card-header">
        <span class="priority-tag p-${item.priority}">${item.priority}</span>
        <button class="delete-btn" onclick="deleteTodo(${item.id})">×</button>
      </div>
      <h4>${item.title}</h4>
      <p>${item.content}</p>
      ${dateHTML}
    `;

    if (item.status === 'to do') todoColumn.appendChild(card);
    else if (item.status === 'in progress') progressColumn.appendChild(card);
    else if (item.status === 'done') doneColumn.appendChild(card);
  });
}

// [8. 필터 칩 렌더링]
function renderFilterChips() {
  const container = document.querySelector('#filter-status-tags');
  if (!container) return;
  container.innerHTML = '';

  if (currentFilters.search.trim() !== '') {
    container.innerHTML += `<span class="filter-chip search-chip">검색: "${currentFilters.search}"</span>`;
  }

  if (currentFilters.term !== '전체 기간') {
    container.innerHTML += `<span class="filter-chip">기간: ${currentFilters.term}</span>`;
  }
  if (currentFilters.priority !== '전체 우선순위') {
    container.innerHTML += `<span class="filter-chip">우선순위: ${currentFilters.priority}</span>`;
  }
  const sortText = currentFilters.sortOrder === 'asc' ? '오름차순' : '내림차순';
  container.innerHTML += `<span class="filter-chip">정렬: ${sortText}</span>`;
}

// [9. 데이터 초기화 함수]
window.resetFilters = function () {
  if (confirm('모든 데이터를 삭제하고 초기화하시겠습니까?')) {
    todoList = []; // 전체 삭제

    // 필터 값 초기화
    currentFilters.search = '';
    currentFilters.term = '전체 기간';
    currentFilters.priority = '전체 우선순위';
    currentFilters.sortOrder = 'asc';

    // UI 요소 초기화
    if (searchInput) searchInput.value = '';
    if (termSelect) termSelect.value = '전체 기간';
    if (prioritySelect) prioritySelect.value = '전체 우선순위';
    if (sortBtn) sortBtn.querySelector('p').textContent = '정렬: 오름차순↑';

    applyFilterAndSort();
  }
};

window.deleteTodo = function (id) {
  if (confirm('이 항목을 삭제하시겠습니까?')) {
    todoList = todoList.filter((item) => item.id !== id);
    applyFilterAndSort();
  }
};

// [10. 이벤트 리스너]
searchInput?.addEventListener('input', (e) => {
  currentFilters.search = e.target.value.toLowerCase();
  applyFilterAndSort();
});

termSelect?.addEventListener('change', (e) => {
  currentFilters.term = e.target.value;
  applyFilterAndSort();
});

prioritySelect?.addEventListener('change', (e) => {
  currentFilters.priority = e.target.value;
  applyFilterAndSort();
});

sortBtn?.addEventListener('click', () => {
  currentFilters.sortOrder = currentFilters.sortOrder === 'asc' ? 'desc' : 'asc';
  sortBtn.querySelector('p').textContent =
    currentFilters.sortOrder === 'asc' ? '정렬: 오름차순↑' : '정렬: 내림차순↓';
  applyFilterAndSort();
});

// [11. 모달 및 저장 로직]
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('flowDash_todos');
  if (saved) {
    todoList = JSON.parse(saved);
  }

  const modal = document.querySelector('.modal');
  const addBtn = document.querySelector('.add');
  const cancelBtn = document.querySelector('.modal-cancel');
  const saveBtn = document.querySelector('.modal-save');
  const titleInput = document.querySelector(".modal-popup input[type='text']");
  const contentInput = document.querySelector('.modal-content-input');
  const statusSelect = document.querySelector('.modal-todo-list');
  const priorityButtons = document.querySelectorAll('.modal-priority button');

  let selectedPriority = '중간';

  addBtn?.addEventListener('click', () => {
    editTargetId = null; // 생성 모드임을 명시
    closeModal();
    modal.style.display = 'flex';
  });

  cancelBtn?.addEventListener('click', () => closeModal());

  function closeModal() {
    modal.style.display = 'none';
    titleInput.value = '';
    contentInput.value = '';
    priorityButtons.forEach((btn) => btn.classList.remove('active'));
    // 기본값 세팅
    priorityButtons[1].classList.add('active');
    selectedPriority = '중간';
    statusSelect.value = '할 일';
  }

  priorityButtons.forEach((button) => {
    button.addEventListener('click', () => {
      priorityButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      selectedPriority = button.dataset.priority; // 여기서 할당
    });
  });

  window.openEditModal = function (item) {
    editTargetId = item.id;

    titleInput.value = item.title;
    contentInput.value = item.content;
    statusSelect.value = REVERSE_STATUS_MAP[item.status] || '할 일';
    selectedPriority = item.priority;

    priorityButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.priority === item.priority);
    });

    modal.style.display = 'flex';
  };

  saveBtn?.addEventListener('click', () => {
    if (!titleInput.value.trim()) return alert('제목을 입력해주세요!');

    const now = Date.now();
    const statusText = statusSelect.value.trim();
    const statusValue = STATUS_MAP[statusText] || 'to do';

    if (editTargetId) {
      // [수정 모드]
      const index = todoList.findIndex((t) => t.id === editTargetId);
      if (index !== -1) {
        todoList[index] = {
          ...todoList[index],
          title: titleInput.value,
          content: contentInput.value,
          status: statusValue,
          priority: selectedPriority,
          updatedAt: now,
          completedAt: statusValue === 'done' ? todoList[index].completedAt || now : null,
        };
      }
    } else {
      // [생성 모드]
      const newTodo = {
        id: now,
        title: titleInput.value,
        content: contentInput.value,
        status: statusValue,
        priority: selectedPriority,
        createdAt: now,
        updatedAt: statusValue === 'in progress' ? now : null,
        completedAt: statusValue === 'done' ? now : null,
      };
      todoList.push(newTodo);
    }

    applyFilterAndSort();
    closeModal();
    editTargetId = null; // 작업 완료 후 초기화
  });

  applyFilterAndSort();
});
