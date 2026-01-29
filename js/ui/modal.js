function openAddModal() {
  editTargetId = null;
  resetModalInputs();
  selectors.modalTitle.textContent = '새 할 일';
  selectors.modal.style.display = 'flex';
}

function openEditModal(item) {
  editTargetId = item.id;
  selectors.modalTitle.textContent = '할 일 수정';
  selectors.titleInput.value = item.title;
  selectors.contentInput.value = item.content;
  selectors.statusSelect.value = REVERSE_STATUS_MAP[item.status];
  selectedPriority = item.priority;
  updatePriorityButtons();
  selectors.modal.style.display = 'flex';
}

function resetModalInputs() {
  selectors.titleInput.value = '';
  selectors.contentInput.value = '';
  selectors.statusSelect.value = '할 일';
  selectedPriority = '중간'; // 기본값
  updatePriorityButtons();
}

function updatePriorityButtons() {
  selectors.priorityButtons.forEach((btn) =>
    btn.classList.toggle('active', btn.dataset.priority === selectedPriority)
  );
}

function closeModal() {
  selectors.modal.style.display = 'none';
}
