document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.nickname-modal');
  const modalInput = document.querySelector('.nickname-setting-container input');
  const confirmBtn = document.querySelector('.login-btn');
  const nicknameDisplay = document.querySelector('.nickname');
  const greetingElement = document.getElementById('greeting-message');
  const dateElement = document.getElementById('today-date');

  const now = new Date();
  const hours = now.getHours();
  let greeting = '안녕하세요';

  if (hours >= 5 && hours < 11) greeting = '좋은 아침이에요';
  else if (hours >= 11 && hours < 17) greeting = '좋은 오후에요';
  else if (hours >= 17 && hours < 22) greeting = '좋은 저녁이에요';

  if (greetingElement) greetingElement.textContent = greeting;

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  if (dateElement) dateElement.textContent = now.toLocaleDateString('ko-KR', dateOptions);

  const savedNickname = localStorage.getItem('userNickname');

  if (savedNickname) {
    modal.classList.add('hidden');
    nicknameDisplay.textContent = savedNickname;
  } else {
    modal.classList.remove('hidden');
  }

  confirmBtn.addEventListener('click', () => {
    const inputVal = modalInput.value.trim();

    if (inputVal === '') {
      alert('닉네임을 입력해주세요!');
      modalInput.focus();
      return;
    }

    localStorage.setItem('userNickname', inputVal);
    nicknameDisplay.textContent = inputVal;
    modal.classList.add('hidden');
  });

  modalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') confirmBtn.click();
  });

  nicknameDisplay.addEventListener('click', () => {
    if (nicknameDisplay.querySelector('input')) return;

    const currentName = nicknameDisplay.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.classList.add('nickname-edit-input');
    input.maxLength = 10;

    nicknameDisplay.textContent = '';
    nicknameDisplay.appendChild(input);
    input.focus();

    const handleSave = () => {
      const newName = input.value.trim() || currentName;
      nicknameDisplay.textContent = newName;
      localStorage.setItem('userNickname', newName);
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSave();
    });

    input.addEventListener('blur', handleSave);
  });
});
