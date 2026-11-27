const form = document.querySelector('#registration');
const fields = form.querySelector('.demo-form-fields');
const status = document.querySelector('#result');
const next = document.querySelector('#registered-next');
const phone = form.elements.phone;
const code = form.elements.code;
const consent = form.elements.locationConsent;
const capture = document.querySelector('#capture-position');

fields.disabled = false;

function message(text) {
  status.textContent = text;
  status.hidden = !text;
}

document.querySelector('#fill-demo').addEventListener('click', () => {
  const values = { username: 'demo120', displayName: '示範申請人', testId: 'TEST123456',
    phone: '0900001234', password: 'demo-only-123', passwordConfirmation: 'demo-only-123' };
  for (const [name, value] of Object.entries(values)) form.elements[name].value = value;
  message('');
});

document.querySelector('#send-register-code').addEventListener('click', () => {
  const info = document.querySelector('#register-code-status');
  info.hidden = false;
  if (!phone.value) {
    info.textContent = '請先填入示範資料。';
    return;
  }
  code.value = '123456';
  info.textContent = '已填入測試碼 123456。';
});

consent.addEventListener('change', () => {
  capture.disabled = !consent.checked;
  document.querySelector('#position-state').textContent = '';
});
capture.addEventListener('click', () => {
  document.querySelector('#position-state').textContent = '已套用示範定位：臺北市。';
});

document.querySelectorAll('.password-toggle').forEach(button => button.addEventListener('click', () => {
  const input = document.getElementById(button.getAttribute('aria-controls'));
  const visible = input.type === 'password';
  input.type = visible ? 'text' : 'password';
  button.textContent = visible ? '隱藏' : '顯示';
  button.setAttribute('aria-pressed', String(visible));
}));

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!phone.value || !code.value) {
    message('請先填入示範資料，再取得測試碼。');
    return;
  }
  next.hidden = false;
  message('已完成註冊步驟。請用測試帳密 1／1 登入。');
  next.querySelector('a').focus();
});
