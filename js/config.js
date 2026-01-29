const STATUS_MAP = { '할 일': 'to do', '진행 중': 'in progress', 완료: 'done' };
const REVERSE_STATUS_MAP = { 'to do': '할 일', 'in progress': '진행 중', done: '완료' };
const STORAGE_KEYS = { TODOS: 'flowDash_todos', THEME: 'theme', NICKNAME: 'userNickname' };
const GREETINGS = {
  MORNING: '좋은 아침이에요',
  AFTERNOON: '좋은 오후에요',
  EVENING: '좋은 저녁이에요',
  DEFAULT: '안녕하세요',
};

const PRIORITY_WEIGHT = {
  높음: 3,
  중간: 2,
  낮음: 1,
};
