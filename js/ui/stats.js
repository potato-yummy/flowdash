function updateDashboard(data) {
  const total = data.length;
  const todoCount = data.filter((t) => t.status === 'to do').length;
  const progressCount = data.filter((t) => t.status === 'in progress').length;
  const doneCount = data.filter((t) => t.status === 'done').length;
  const achievement = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  if (selectors.dashboardNums.total) selectors.dashboardNums.total.textContent = total;
  if (selectors.dashboardNums.todo) selectors.dashboardNums.todo.textContent = todoCount;
  if (selectors.dashboardNums.progress)
    selectors.dashboardNums.progress.textContent = progressCount;
  if (selectors.dashboardNums.done) selectors.dashboardNums.done.textContent = doneCount;
  if (selectors.dashboardNums.achievement)
    selectors.dashboardNums.achievement.textContent = total === 0 ? '-' : `${achievement}%`;

  document.getElementById('todo-count').textContent = todoCount;
  document.getElementById('progress-count').textContent = progressCount;
  document.getElementById('done-count').textContent = doneCount;

  renderFilterChips();
}

function renderFilterChips() {
  const container = selectors.filterChipsContainer;
  if (!container) return;
  container.innerHTML = '';

  if (currentFilters.search.trim())
    container.innerHTML += `<span class="filter-chip">검색: "${currentFilters.search}"</span>`;
  if (currentFilters.term !== '전체 기간')
    container.innerHTML += `<span class="filter-chip">기간: ${currentFilters.term}</span>`;
  if (currentFilters.priority !== '전체 우선순위')
    container.innerHTML += `<span class="filter-chip">우선순위: ${currentFilters.priority}</span>`;

  const sortDesc = currentFilters.sortOrder === 'asc' ? '오름차순' : '내림차순';
  container.innerHTML += `<span class="filter-chip sort-chip">정렬: ${sortDesc}</span>`;
}
