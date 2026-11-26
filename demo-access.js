const root = document.documentElement;
const role = root.dataset.demoRole;
const key = 'one-one-preview-' + role;
const signedOut = root.dataset.loginPage;
const dashboard = root.dataset.dashboardPage;
const login = document.querySelector('[data-demo-login]');
const status = document.querySelector('#demo-status');
document.querySelectorAll('[data-demo-fields]').forEach(group => { group.disabled = false; });

if (role && root.dataset.protected === 'true') {
  if (sessionStorage.getItem(key) !== '1') {
    location.replace(signedOut);
  } else {
    document.querySelector('[data-demo-content]').hidden = false;
  }
}

document.querySelectorAll('[data-demo-logout]').forEach(button => button.addEventListener('click', () => {
  sessionStorage.removeItem(key);
  location.replace(signedOut);
}));

const toggle = document.querySelector('[data-toggle-password]');
toggle?.addEventListener('click', () => {
  const password = login.elements.password;
  const visible = password.type === 'password';
  password.type = visible ? 'text' : 'password';
  toggle.textContent = visible ? '隱藏' : '顯示';
  toggle.setAttribute('aria-pressed', String(visible));
});

const slider = document.querySelector('[data-demo-slider]');
const puzzle = document.querySelector('[data-demo-puzzle]');
const reset = document.querySelector('[data-demo-reset]');
let target = 57;
function showPiece() {
  puzzle.style.setProperty('--piece', Number(slider.value) * .86 + '%');
}
slider?.addEventListener('input', showPiece);
reset?.addEventListener('click', () => {
  target = target === 57 ? 71 : 57;
  puzzle.style.setProperty('--gap', target * .86 + '%');
  slider.value = '0';
  showPiece();
  status.textContent = '';
});

login?.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(login);
  if (slider && Math.abs(Number(slider.value) - target) > 3) {
    status.textContent = '請把拼圖片移到框線。';
    return;
  }
  if (fields.get('username') !== '1' || fields.get('password') !== '1') {
    status.textContent = '請使用展示帳號與密碼 1／1。';
    return;
  }
  sessionStorage.setItem(key, '1');
  location.assign(dashboard);
});

document.querySelectorAll('[data-demo-filter]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const keyword = new FormData(form).get('q')?.trim().toLowerCase() ?? '';
  if (!form.elements.q) return;
  document.querySelectorAll('main tbody tr').forEach(row => {
    row.hidden = keyword !== '' && !row.textContent.toLowerCase().includes(keyword);
  });
  const message = document.querySelector('#demo-write-status');
  if (message) message.textContent = keyword ? '已在目前頁面篩選示範資料。' : '';
}));
