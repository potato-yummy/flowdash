document.addEventListener('DOMContentLoaded', () => {
  todoList = storage.loadTodos();
  initHeaderAndTheme();
  renderKanban();
  initEventListeners();
});

function initEventListeners() {
  selectors.addBtn?.addEventListener('click', openAddModal);
  selectors.cancelBtn?.addEventListener('click', closeModal);

  selectors.saveBtn?.addEventListener('click', () => {
    if (!selectors.titleInput.value.trim()) return alert('제목을 입력하세요!');
    const now = Date.now();
    const statusVal = STATUS_MAP[selectors.statusSelect.value];

    if (editTargetId) {
      const idx = todoList.findIndex((t) => t.id === editTargetId);
      todoList[idx] = {
        ...todoList[idx],
        title: selectors.titleInput.value,
        content: selectors.contentInput.value,
        status: statusVal,
        priority: selectedPriority,
        updatedAt: now,
        completedAt: statusVal === 'done' ? todoList[idx].completedAt || now : null,
      };
    } else {
      todoList.push({
        id: now,
        title: selectors.titleInput.value,
        content: selectors.contentInput.value,
        status: statusVal,
        priority: selectedPriority,
        createdAt: now,
        updatedAt: statusVal === 'in progress' ? now : null,
        completedAt: statusVal === 'done' ? now : null,
      });
    }
    storage.saveTodos(todoList);
    renderKanban();
    closeModal();
  });

  // 검색 및 필터
  selectors.searchInput?.addEventListener('input', (e) => {
    currentFilters.search = e.target.value.toLowerCase();
    renderKanban();
  });
  selectors.termSelect?.addEventListener('change', (e) => {
    currentFilters.term = e.target.value;
    renderKanban();
  });
  selectors.prioritySelect?.addEventListener('change', (e) => {
    currentFilters.priority = e.target.value;
    renderKanban();
  });
  selectors.sortBtn?.addEventListener('click', () => {
    currentFilters.sortOrder = currentFilters.sortOrder === 'asc' ? 'desc' : 'asc';

    const btnText = selectors.sortBtn.querySelector('p');
    if (btnText) {
      btnText.textContent =
        currentFilters.sortOrder === 'asc' ? '정렬: 오름차순↑' : '정렬: 내림차순↓';
    }

    renderKanban(); // 화면 갱신
  });

  // 닉네임 수정
  selectors.nicknameConfirmBtn?.addEventListener('click', () => {
    const val = selectors.nicknameInput.value.trim();
    if (val) {
      storage.saveNickname(val);
      selectors.nicknameDisplay.textContent = val;
      selectors.nicknameModal.classList.add('hidden');
    }
  });

  selectors.priorityButtons.forEach((btn) =>
    btn.addEventListener('click', () => {
      selectedPriority = btn.dataset.priority;
      updatePriorityButtons();
    })
  );
}

// 초기화 함수 (HTML에서 부르는 용도)
window.resetFilters = function () {
  if (confirm('모든 데이터를 삭제할까요?')) {
    todoList = [];
    storage.saveTodos(todoList);
    renderKanban();
  }
};
