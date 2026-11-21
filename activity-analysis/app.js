const $ = selector => document.querySelector(selector);
const categories = ['讲座', '研讨', '美育', '劳动教育', '志愿服务', '其他'];
const storageKey = 'campus-activity-analysis.v1';
const editor = $('#editor');
const detail = $('#detail');
const form = $('#form');
const search = $('#search');
const time = $('#time');
const number = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 });
let records = [];
let activeCategory = '';
let selectedId;
let editingId;
let storageReadable = true;

function element(tag, label, className) {
  const node = document.createElement(tag);
  node.textContent = label;
  if (className) node.className = className;
  return node;
}

function readRecords() {
  const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
  if (!Array.isArray(saved)) throw new Error('Invalid activity data');
  return saved;
}

function dateLabel(value) {
  return value.replace('T', ' ');
}

function accreditation(record) {
  const parts = [];
  if (record.hours !== null) parts.push(number.format(record.hours) + ' 学时');
  if (record.credits !== null) parts.push(number.format(record.credits) + ' 学分');
  return parts.join(' · ') || '未填写';
}

function showDetails(record) {
  selectedId = record.id;
  $('#detail-title').textContent = record.title;
  const fields = $('#detail-fields');
  fields.replaceChildren();
  for (const [label, value] of [
    ['活动时间', dateLabel(record.start)],
    ['活动地点', record.location],
    ['活动类别', record.category],
    ['可认定学时 / 学分', accreditation(record)],
    ['签到方式', record.checkin],
    ['活动内容', record.description],
  ]) {
    const group = document.createElement('div');
    group.append(element('dt', label), element('dd', value));
    fields.append(group);
  }
  detail.showModal();
}

function renderList() {
  const query = search.value.trim().toLocaleLowerCase();
  const now = Date.now();
  const visible = records.filter(record => {
    const upcoming = new Date(record.start).getTime() > now;
    const matchesTime = !time.value || (time.value === 'upcoming' ? upcoming : !upcoming);
    const matchesQuery = [record.title, record.location, record.description, record.checkin]
      .some(value => value.toLocaleLowerCase().includes(query));
    return (!activeCategory || record.category === activeCategory) && matchesTime && matchesQuery;
  }).sort((a, b) => b.start.localeCompare(a.start));

  $('#list-title').textContent = activeCategory || '全部活动';
  $('#results').textContent = visible.length + ' 场活动';
  const list = $('#list');
  list.replaceChildren();
  if (!visible.length) {
    const empty = document.createElement('div');
    empty.className = 'module-empty';
    empty.append(element('h3', records.length ? '没有匹配的活动' : '暂无活动'));
    const action = element('button', records.length ? '清除筛选' : '上传第一场活动', 'secondary-button');
    action.addEventListener('click', () => {
      if (!records.length) {
        openEditor();
        return;
      }
      activeCategory = search.value = time.value = '';
      updateFilters();
      render();
      search.focus();
    });
    empty.append(action);
    list.append(empty);
    return;
  }

  for (const record of visible) {
    const article = element('article', '', 'project');
    const copy = document.createElement('div');
    copy.append(
      element('h3', record.title),
      element('p', dateLabel(record.start) + ' · ' + record.location, 'muted'),
      element('span', record.category + (accreditation(record) === '未填写' ? '' : ' · ' + accreditation(record)), 'tag'),
      element('p', record.description, 'preview'),
    );
    const button = element('button', '查看详情', 'text-button');
    button.setAttribute('aria-label', '查看详情：' + record.title);
    button.addEventListener('click', () => showDetails(record));
    article.append(copy, button);
    list.append(article);
  }
}

function render() {
  for (const [id, value, unit] of [
    ['total', records.length, '场'],
    ['hours', records.reduce((sum, record) => sum + (record.hours ?? 0), 0), '学时'],
    ['credits', records.reduce((sum, record) => sum + (record.credits ?? 0), 0), '学分'],
  ]) {
    $('#' + id).replaceChildren(number.format(value), element('small', unit));
  }

  $('#categories').replaceChildren(...['', ...categories].map(category => {
    const button = element('button', '', 'module-group-toggle');
    button.setAttribute('aria-pressed', String(activeCategory === category));
    const count = category ? records.filter(record => record.category === category).length : records.length;
    button.append(element('span', category || '全部活动'), element('strong', String(count)));
    button.addEventListener('click', () => {
      activeCategory = category;
      updateFilters();
      render();
      [...$('#categories').children].find(item => item.getAttribute('aria-pressed') === 'true').focus({ preventScroll: true });
    });
    return button;
  }));
  renderList();
}

function updateFilters() {
  const url = new URL(location.href);
  for (const [key, value] of [['category', activeCategory], ['q', search.value.trim()], ['time', time.value]]) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  if (location.protocol !== 'file:') history.replaceState(null, '', url);
}

function openEditor(record) {
  editingId = record?.id;
  form.reset();
  $('#editor-title').textContent = record ? '编辑活动' : '上传活动';
  $('#error').textContent = '';
  form.querySelector('[type=submit]').disabled = !storageReadable;
  if (!storageReadable) $('#error').textContent = '无法读取本地存储，请检查浏览器是否允许此页面保存数据，或重新载入页面。';
  if (record) {
    for (const field of form.elements) {
      if (field.name) field.value = record[field.name] ?? '';
    }
  }
  editor.showModal();
}

for (const category of ['请选择类别', ...categories]) {
  const option = element('option', category);
  option.value = categories.includes(category) ? category : '';
  form.elements.category.append(option);
}

document.querySelectorAll('[data-close]').forEach(button => {
  button.addEventListener('click', () => button.closest('dialog').close());
});
$('[data-new]').addEventListener('click', () => openEditor());
$('#edit').addEventListener('click', () => {
  const record = records.find(record => record.id === selectedId);
  detail.close();
  if (record) openEditor(record);
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  for (const field of ['title', 'location', 'checkin', 'description']) {
    data[field] = data[field].trim();
    if (!data[field]) {
      $('#error').textContent = '活动名称、地点、签到方式和内容均需填写有效文字。';
      form.elements[field].focus();
      return;
    }
  }
  data.hours = data.hours === '' ? null : Number(data.hours);
  data.credits = data.credits === '' ? null : Number(data.credits);
  const record = { id: editingId ?? crypto.randomUUID(), ...data };

  try {
    const latest = readRecords();
    const updated = latest.some(item => item.id === record.id)
      ? latest.map(item => item.id === record.id ? record : item)
      : [...latest, record];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    records = updated;
  } catch {
    $('#error').textContent = '保存失败。请检查浏览器的本地存储权限或可用空间，再重试。';
    return;
  }

  activeCategory = search.value = time.value = '';
  updateFilters();
  editor.close();
  render();
  $('#status').textContent = '已保存「' + record.title + '」。';
  $('#activities').scrollIntoView();
});

search.addEventListener('input', () => { updateFilters(); renderList(); });
time.addEventListener('change', () => { updateFilters(); renderList(); });

function load() {
  try {
    records = readRecords();
    storageReadable = true;
  } catch {
    storageReadable = false;
    $('#status').textContent = '无法读取本地活动数据，请检查浏览器的存储设置。';
  }
  render();
}

const params = new URLSearchParams(location.search);
if (categories.includes(params.get('category'))) activeCategory = params.get('category');
search.value = params.get('q') ?? '';
if (['upcoming', 'started'].includes(params.get('time'))) time.value = params.get('time');
load();
window.addEventListener('storage', event => {
  if (event.key === storageKey || event.key === null) load();
});
