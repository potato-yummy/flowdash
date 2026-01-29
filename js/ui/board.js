function renderKanban() {
  const filtered = applyFilterAndSort(todoList);

  selectors.todoList.innerHTML = '';
  selectors.progressList.innerHTML = '';
  selectors.doneList.innerHTML = '';

  const todoTasks = filtered.filter((t) => t.status === 'to do');
  const progressTasks = filtered.filter((t) => t.status === 'in progress');
  const doneTasks = filtered.filter((t) => t.status === 'done');

  if (todoTasks.length === 0) {
    selectors.todoList.innerHTML = '<p class="empty-msg">할 일이 없습니다</p>';
  } else {
    todoTasks.forEach((item) => selectors.todoList.appendChild(createCardElement(item)));
  }

  if (progressTasks.length === 0) {
    selectors.progressList.innerHTML = '<p class="empty-msg">진행 중인 일이 없습니다</p>';
  } else {
    progressTasks.forEach((item) => selectors.progressList.appendChild(createCardElement(item)));
  }

  if (doneTasks.length === 0) {
    selectors.doneList.innerHTML = '<p class="empty-msg">완료된 일이 없습니다</p>';
  } else {
    doneTasks.forEach((item) => selectors.doneList.appendChild(createCardElement(item)));
  }

  updateDashboard(filtered);
}

function applyFilterAndSort(data) {
  let result = [...data];

  result = result.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      item.content.toLowerCase().includes(currentFilters.search.toLowerCase());
    const matchesPriority =
      currentFilters.priority === '전체 우선순위' || item.priority === currentFilters.priority;

    let matchesTerm = true;
    if (currentFilters.term === '오늘') {
      matchesTerm = new Date(item.id).toDateString() === new Date().toDateString();
    } else if (currentFilters.term === '최근 7일') {
      matchesTerm = item.id >= Date.now() - 7 * 24 * 60 * 60 * 1000;
    }
    return matchesSearch && matchesPriority && matchesTerm;
  });

  result.sort((a, b) => {
    const weightA = PRIORITY_WEIGHT[a.priority] || 0;
    const weightB = PRIORITY_WEIGHT[b.priority] || 0;

    if (currentFilters.sortOrder === 'asc') {
      return weightB - weightA;
    } else {
      return weightA - weightB;
    }
  });

  return result;
}

window.handleDeleteTodo = function (e, id) {
  e.stopPropagation();
  if (confirm('삭제하시겠습니까?')) {
    todoList = todoList.filter((t) => t.id !== id);
    storage.saveTodos(todoList);
    renderKanban();
  }
};
