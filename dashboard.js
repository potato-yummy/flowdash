// [1. 데이터 중앙 관리]
const todoList = [
  {
    id: Date.now(),
    title: "새로운 작업",
    content: "내용 입력하세요",
    status: "To Do",
    priority: "보통",
  },
];

// "새 할 일" 추가
function additem() {
  const newTodo = {
    id: todoList.length + 1,
    title: "직접 추가한 한 일",
    content: "사용자가 입력한 내용",
    status: "TO Do",
    priority: "보통",
  };
}

// [2. 필터 및 정렬 상태 관리 (Global State)]
const currentFilters = {
  search: "",
  term: "전체 기간",
  priority: "전체 우선순위",
  sortOrder: "asc",
};

// [3. DOM 요소 가져오기]
const searchInput = document.querySelector(".To-Do-Search input");
const boardContainer = document.querySelector(".Kanban-Board");
const prioritySelect = document.querySelector(".Priority");
const sortBtn = document.querySelector(".Array");
const todoColumn = document.querySelector("#todo-list");
const progressColumn = document.querySelector("#progress-list");
const doneColumn = document.querySelector("#done-list");

// [4. 빈 화면(Empty State) UI 템플릿]
const emptyStateHTML = `
  <div class="empty-state" style="text-align: center; padding: 50px;">
    <h2 style="color: #9ba9ba;">검색 결과가 없습니다.</h2>
    <p style="color: #c1c1c1;">새로운 아이템을 추가하여 시작해보세요!</p>
    <button class="Add" onclick="alert('할 일 추가 모달을 띄워주세요!')">아이템 추가하기</button>
  </div>
`;

// [5. 복합 필터링 및 정렬]
function applyFilterAndSort() {
  // 1) 필터링
  const filtered = todoList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(currentFilters.search) ||
      item.content.toLowerCase().includes(currentFilters.search);

    const matchesPriority =
      currentFilters.priority === "전체 우선순위" ||
      item.priority === currentFilters.priority;

    return matchesSearch && matchesPriority;
  });

  // 2) 정렬
  filtered.sort((a, b) => {
    return currentFilters.sortOrder === "asc" ? a.id - b.id : b.id - a.id;
  });

  // 3) UI 반영 (리스트와 대시보드 동시 업데이트)
  renderList(filtered);
  updateDashboard(filtered);
}

// [6. 통계 업데이트 함수]
function updateDashboard(data) {
  const total = data.length;
  const todoCount = data.filter((item) => item.status === "To Do").length;
  const progressCount = data.filter(
    (item) => item.status === "In Progress",
  ).length;
  const doneCount = data.filter((item) => item.status === "Done").length;

  const achievement = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  document.querySelector(".Total-Tasks p").textContent = total;
  document.querySelector(".To-Do p").textContent = todoCount;
  document.querySelector(".In-Progress p").textContent = progressCount;
  document.querySelector(".Done p").textContent = doneCount;
  document.querySelector(".Achievement p").textContent =
    total === 0 ? "-" : `${achievement}%`;
}

// [7. UI 렌더링 함수]
function renderList(items) {
  if (!boardContainer) return;

  // 빈 화면 처리 (Empty State)
  if (items.length === 0) {
    boardContainer.innerHTML = emptyStateHTML;
    return;
  }

  // 데이터 목록 렌더링
  boardContainer.innerHTML = items
    .map(
      (item) => `
    <div class="todo-card">
      <div class="card-header">
        <span class="status-tag">${item.status}</span>
        <span class="priority-tag">${item.priority}</span>
      </div>
      <h4>${item.title}</h4>
      <p>${item.content}</p>
    </div>
  `,
    )
    .join("");
}

// [8. 이벤트 리스너 연결]
// 검색창 입력 이벤트
searchInput?.addEventListener("input", (e) => {
  currentFilters.search = e.target.value.toLowerCase();
  applyFilterAndSort();
});

// 우선순위 변경 이벤트
prioritySelect?.addEventListener("change", (e) => {
  currentFilters.priority = e.target.value;
  applyFilterAndSort();
});

// 정렬 버튼 클릭 이벤트
sortBtn?.addEventListener("click", () => {
  currentFilters.sortOrder =
    currentFilters.sortOrder === "asc" ? "desc" : "asc";
  sortBtn.querySelector("p").textContent =
    currentFilters.sortOrder === "asc" ? "정렬: 오름차순↑" : "정렬: 내림차순↓";
  applyFilterAndSort();
});

function renderKanban(items) {
  todoColumn.innerHTML = "";
  progressColumn.innerHTML = "";
  doneColumn.innerHTML = "";

  items.forEach((item) => {
    const card = createCard(item);

    if (item.status === "To Do") {
      todoColumn.appendChild(card);
    } else if (item.status === "In Progress") {
      progressColumn.appendChild(card);
    } else if (item.status === "Done") {
      doneColumn.appendChild(card);
    }
  });
}

// [9. 초기 실행]
applyFilterAndSort();

// 모달 js
document.addEventListener("DOMContentLoaded", () => {
  // DOM 요소 선택
  const modal = document.querySelector(".modal");
  const addBtn = document.querySelector(".Add");
  const cancelBtn = document.querySelector(".modal-cancel");
  const saveBtn = document.querySelector(".modal-save");

  const titleInput = document.querySelector(
    ".modal-popup input[placeholder='제목을 입력하세요']",
  );
  const contentInput = document.querySelector(
    ".modal-popup input[placeholder='내용을 입력하세요']",
  );
  const statusSelect = document.querySelector(".modal-todo-list");

  const priorityButtons = document.querySelectorAll(".modal-priority button");

  let selectedPriority = "중간"; // 기본값

  // 모달 열기/ 닫기
  addBtn?.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  cancelBtn?.addEventListener("click", () => {
    closeModal();
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.style.display = "none";
    resetModal();
  }

  // 우선 순위 버튼 처리
  priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      priorityButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");
      selectedPriority = button.dataset.priority;
    });
  });

  //  저장 버튼
  saveBtn?.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const statusValue = statusSelect.value;

    if (!title) {
      alert("제목을 입력해주세요!");
      return;
    }

    const newTodo = {
      id: Date.now(),
      title,
      content,
      status:
        statusValue === "할 일"
          ? "To Do"
          : statusValue === "진행 중"
            ? "In Progress"
            : "Done",
      priority: selectedPriority,
    };

    todoList.push(newTodo);
    applyFilterAndSort();
    closeModal();
  });

  // 모달 초기화
  function resetModal() {
    titleInput.value = "";
    contentInput.value = "";
    statusSelect.value = "할 일";

    selectedPriority = "중간";
    priorityButtons.forEach((btn) => btn.classList.remove("active"));
    priorityButtons[1]?.classList.add("active"); // 중간 기본 활성화
  }
});
