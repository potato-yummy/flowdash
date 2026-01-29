function createCardElement(item) {
  const card = document.createElement('div');
  card.className = `todo-card ${item.status === 'done' ? 'is-done' : ''}`;

  // 상태별 날짜 문구 설정
  let dateText = `생성: ${formatDate(item.createdAt)}`;
  if (item.status === 'in progress' && item.updatedAt)
    dateText = `수정: ${formatDate(item.updatedAt)}`;
  else if (item.status === 'done' && item.completedAt)
    dateText = `완료: ${formatDate(item.completedAt)}`;

  card.innerHTML = `
    <div class="card-header">
      <span class="priority-tag p-${item.priority}">${item.priority}</span>
      <button class="delete-btn" onclick="handleDeleteTodo(event, ${item.id})">×</button>
    </div>
    <h4>${item.title}</h4>
    <p>${item.content}</p>
    <div class="card-footer">${dateText}</div>
  `;
  card.addEventListener('click', () => openEditModal(item));
  return card;
}
