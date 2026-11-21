const $ = selector => document.querySelector(selector);
const categories = ['课程作业', '科研', '比赛'];
const progress = ['计划中', '进行中', '已完成', '已暂停'];
const storageKey = 'project-review.v1';
const now = new Date();
const year = now.getFullYear();
const fall = now.getMonth() >= 8 || now.getMonth() === 0;
const academicYear = now.getMonth() >= 8 ? year : year - 1;
const defaultTerm = `${academicYear}–${academicYear + 1} ${fall ? '秋季' : '春季'}`;
const projectFields = ['name', 'type', 'context', 'role', 'contribution', 'method', 'outcome', 'progress', 'start', 'end'];
const reviewFields = ['actual', 'evidence', 'difficulty', 'next'];
const freshData = { version: 1, terms: [defaultTerm], projects: [] };
let data = freshData;
let term = defaultTerm;
let category = '全部项目';
const dialog = $('#dialog');

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safeUrl = value => {
  try { return ['http:', 'https:'].includes(new URL(value).protocol); }
  catch { return false; }
};
const hasStrings = (item, fields) => item && fields.every(key => typeof item[key] === 'string');
function validate(backup) {
  if (backup?.version !== 1 || !Array.isArray(backup.terms) || !backup.terms.length ||
      !backup.terms.every(item => typeof item === 'string' && item.trim()) ||
      new Set(backup.terms).size !== backup.terms.length || !Array.isArray(backup.projects)) {
    throw new Error('备份格式无效。');
  }
  const validProjects = backup.projects.every(project => hasStrings(project, ['id', ...projectFields]) &&
    project.id && project.name.trim() && categories.includes(project.type) && progress.includes(project.progress) &&
    Array.isArray(project.terms) && project.terms.length && new Set(project.terms).size === project.terms.length &&
    project.terms.every(item => backup.terms.includes(item)) && Array.isArray(project.links) &&
    project.links.every(link => hasStrings(link, ['label', 'url']) && safeUrl(link.url)) &&
    project.reviews && typeof project.reviews === 'object' && !Array.isArray(project.reviews) &&
    Object.entries(project.reviews).every(([key, review]) => project.terms.includes(key) &&
      hasStrings(review, reviewFields) && typeof review.done === 'boolean' && (!review.done || review.actual.trim())));
  if (!validProjects || new Set(backup.projects.map(project => project.id)).size !== backup.projects.length) {
    throw new Error('备份包含无效或重复的项目。');
  }
  return backup;
}
function status(message) { $('#status').textContent = message; }
try {
  const saved = localStorage.getItem(storageKey);
  if (saved) data = validate(JSON.parse(saved));
  term = data.terms.includes(defaultTerm) ? defaultTerm : data.terms.at(-1);
} catch {
  status('无法读取本地记录。可通过备份恢复数据。');
}
function commit(next, message) {
  try { localStorage.setItem(storageKey, JSON.stringify(next)); }
  catch {
    const error = dialog.querySelector('.error');
    if (error) error.textContent = '保存失败，请检查浏览器存储权限或剩余空间。';
    else status('保存失败，请检查浏览器存储权限或剩余空间。');
    return false;
  }
  data = next;
  if (!data.terms.includes(term)) term = data.terms.at(-1);
  if (dialog.open) dialog.close();
  render();
  status(message);
  return true;
}
function saveProject(project, message, isNew = false) {
  const projects = isNew ? [project, ...data.projects] :
    data.projects.map(item => item.id === project.id ? project : item);
  commit({ ...data, projects }, message);
}
const semesterProjects = () => data.projects.filter(project => project.terms.includes(term));
const reviewOf = project => Object.hasOwn(project.reviews, term) ? project.reviews[term] : {};
function render() {
  const projects = semesterProjects();
  const reviewed = projects.filter(project => reviewOf(project).done).length;
  const state = $('#filter').value;
  const query = $('#search').value.trim().toLowerCase();
  $('#term').innerHTML = data.terms.map(item => `<option>${escapeHtml(item)}</option>`).join('');
  $('#term').value = term;
  const metrics = [['all', '本学期项目', projects.length], ['pending', '待复盘', projects.length - reviewed], ['reviewed', '已复盘', reviewed]];
  $('#metrics').innerHTML = metrics.map(([key, label, count]) =>
    `<button class="metric" data-state="${key}" aria-pressed="${category === '全部项目' && state === key}"><span>${label}</span><strong>${count}<small>项</small></strong></button>`).join('');
  $('#nav').innerHTML = ['全部项目', ...categories, '学期复盘'].map(label =>
    `<button class="module-group-toggle" data-category="${label}" aria-pressed="${category === label}"><span>${label}</span></button>`).join('');
  $('#list-title').textContent = category;
  const visible = projects.filter(project => {
    const review = reviewOf(project);
    return (!categories.includes(category) || category === project.type) &&
      (state === 'all' || Boolean(review.done) === (state === 'reviewed')) &&
      [project.name, project.context, project.role, project.contribution, project.method, project.outcome, review.actual, review.evidence]
        .some(value => value?.toLowerCase().includes(query));
  });
  $('#list').innerHTML = visible.length ? visible.map(project => {
    const review = reviewOf(project);
    const id = escapeHtml(project.id);
    const summary = review.actual || project.outcome;
    return `<article class="project"><div><h3>${escapeHtml(project.name)}</h3>
      <p class="muted">${[project.type, project.role, project.progress].filter(Boolean).map(escapeHtml).join(' · ')}</p>
      ${summary ? `<p>${escapeHtml(summary)}</p>` : ''}</div>
      <div class="row-actions"><span class="tag">${review.done ? '已复盘' : '待复盘'}</span>
        <button class="text-button" data-id="${id}" data-action="edit">详情</button>
        <button class="text-button" data-id="${id}" data-action="review">${review.done ? '查看复盘' : '补写复盘'}</button></div></article>`;
  }).join('') : `<div class="module-empty"><h3>${projects.length ? '没有匹配的项目' : '本学期还没有项目'}</h3><p>${projects.length ? '可以调整搜索词或筛选条件。' : '可以新建项目，或从已有项目详情中添加学期。'}</p></div>`;
}
function openDialog(title, body) {
  dialog.innerHTML = `<div class="dialog-head"><div class="toolbar"><h2 id="dialog-title">${escapeHtml(title)}</h2><button type="button" data-close aria-label="关闭">关闭</button></div></div><div class="dialog-body">${body}</div>`;
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('input:not([type=checkbox]), textarea, [data-close]')?.focus();
}
function field(label, key, value = '', kind = 'text', required = false) {
  const control = kind === 'textarea' ? `<textarea name="${key}">${escapeHtml(value)}</textarea>` :
    `<input name="${key}" type="${kind}" value="${escapeHtml(value)}" ${required ? 'required' : ''}>`;
  return `<label class="field">${label}${control}</label>`;
}
function selectField(label, name, values, current) {
  return `<label class="field">${label}<select name="${name}">${values.map(value =>
    `<option ${value === current ? 'selected' : ''}>${value}</option>`).join('')}</select></label>`;
}
const formError = '<p class="error" role="alert"></p>';
function editProject(existing) {
  const project = existing ?? { terms: [term], links: [], reviews: {} };
  openDialog(existing ? '项目详情' : '新建项目', `<form class="stack">
    ${field('项目名称（必填）', 'name', project.name, 'text', true)}
    <div class="grid">${selectField('类型', 'type', categories, project.type)}
    ${selectField('项目进展', 'progress', progress, project.progress)}
    ${field('课程、课题或赛事名称', 'context', project.context)}
    ${field('个人角色', 'role', project.role)}
    ${field('开始日期', 'start', project.start, 'date')}
    ${field('结束日期', 'end', project.end, 'date')}</div>
    <fieldset><legend>归属学期</legend>${data.terms.map((item, index) =>
      `<label><input type="checkbox" name="terms" value="${index}" ${project.terms.includes(item) ? 'checked' : ''} ${Object.hasOwn(project.reviews, item) ? 'disabled title="该学期已有复盘记录"' : ''}> ${escapeHtml(item)}</label> `).join('')}</fieldset>
    ${field('个人贡献', 'contribution', project.contribution, 'textarea')}
    ${field('方法与工具', 'method', project.method, 'textarea')}
    ${field('已有成果（可填写团队成果）', 'outcome', project.outcome, 'textarea')}
    <fieldset><legend>成果链接</legend><div id="links"></div><button type="button" id="add-link">＋ 添加链接</button></fieldset>
    ${formError}<div class="actions"><button class="primary" type="submit">保存项目</button>
    ${existing ? '<button type="button" class="danger" id="delete-project">删除项目</button>' : ''}</div>
    </form>`);
  const form = dialog.querySelector('form');
  function addLink(link = {}) {
    const row = document.createElement('div');
    row.className = 'link-row';
    row.innerHTML = `<input aria-label="链接名称" placeholder="链接名称" value="${escapeHtml(link.label)}">
      <input aria-label="链接网址" type="url" placeholder="https://" value="${escapeHtml(link.url)}">
      <button type="button" aria-label="移除链接">移除</button>`;
    row.querySelector('button').onclick = () => row.remove();
    if (safeUrl(link.url)) {
      const anchor = document.createElement('a');
      anchor.href = link.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = '打开链接';
      row.append(anchor);
    }
    $('#links').append(row);
    return row;
  }
  project.links.forEach(addLink);
  $('#add-link').onclick = () => addLink().querySelector('input').focus();
  if (existing) $('#delete-project').onclick = () => {
    if (confirm(`删除「${project.name}」及其各学期复盘？`)) {
      commit({ ...data, projects: data.projects.filter(item => item.id !== project.id) }, '项目已删除。');
    }
  };
  form.onsubmit = event => {
    event.preventDefault();
    const values = new FormData(form);
    const details = Object.fromEntries(projectFields.map(key => [key, values.get(key).trim()]));
    const terms = Array.from(form.querySelectorAll('[name=terms]:checked'), input => data.terms[Number(input.value)]);
    const links = Array.from(form.querySelectorAll('.link-row'), row => {
      const [label, url] = row.querySelectorAll('input');
      return { label: label.value.trim(), url: url.value.trim() };
    }).filter(link => link.label || link.url);
    const error = form.querySelector('.error');
    if (!details.name || !terms.length) { error.textContent = '请填写项目名称并选择至少一个学期。'; return; }
    if (details.start && details.end && details.start > details.end) { error.textContent = '结束日期应在开始日期当天或之后。'; return; }
    if (links.some(link => !safeUrl(link.url))) { error.textContent = '请为每条链接填写有效的 HTTP 或 HTTPS 网址。'; return; }
    saveProject({ ...project, ...details, id: project.id ?? crypto.randomUUID(), terms, links }, '项目已保存。', !existing);
  };
}
function editReview(project) {
  const review = reviewOf(project);
  openDialog('学期复盘', `<form class="stack"><div><h3>${escapeHtml(project.name)}</h3><p class="muted">${escapeHtml(term)} · ${project.progress}</p></div>
    ${field('实际完成了什么', 'actual', review.actual, 'textarea')}
    ${field('成果与证据', 'evidence', review.evidence, 'textarea')}
    ${field('遇到的问题', 'difficulty', review.difficulty, 'textarea')}
    ${field('后续计划', 'next', review.next, 'textarea')}
    ${formError}<div class="actions"><button type="submit" value="draft">保存为待复盘</button><button class="primary" type="submit" value="done">标记已复盘</button></div></form>`);
  dialog.querySelector('form').onsubmit = event => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const details = Object.fromEntries(reviewFields.map(key => [key, values.get(key).trim()]));
    const done = event.submitter?.value === 'done';
    if (done && !details.actual) {
      dialog.querySelector('.error').textContent = '请先填写实际完成情况。';
      return;
    }
    saveProject({ ...project, reviews: { ...project.reviews, [term]: { ...details, done } } },
      done ? '已完成本学期复盘。' : '复盘草稿已保存。');
  };
}

function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function openResume() {
  const projects = semesterProjects();
  if (!projects.length) {
    openDialog('整理简历经历', '<div class="stack"><p>这个学期还没有项目。先新建项目并填写个人贡献或成果，就可以生成简历经历草稿。</p><div><button class="primary" id="resume-new-project">新建项目</button></div></div>');
    $('#resume-new-project').onclick = () => editProject();
    return;
  }
  const draftKey = `${storageKey}.resume.${term}`;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(draftKey)) ?? {}; }
  catch { /* Drafts are optional when browser storage is unavailable. */ }
  const selected = Array.isArray(saved.selected) ? saved.selected : [];
  const edits = new Map(Array.isArray(saved.edits) ? saved.edits.filter(item =>
    Array.isArray(item) && typeof item[0] === 'string' && typeof item[1] === 'string') : []);
  openDialog('整理简历经历', `<div class="stack"><fieldset><legend>选择要导出的项目</legend><div class="stack">${projects.map((project, index) =>
    `<label><input type="checkbox" data-project="${index}" ${selected.includes(project.id) ? 'checked' : ''}> ${escapeHtml(project.name)}</label>`).join('')}</div></fieldset>
    <label><input type="checkbox" id="include-links" ${saved.links === true ? 'checked' : ''}> 附带成果链接</label>
    <p class="muted">勾选项目即可生成草稿。编辑和排序会自动保存在当前浏览器。</p>
    <div id="drafts"></div>${formError}
    <div class="actions"><button class="primary" id="copy" disabled>复制全文</button><button id="markdown" disabled>下载 Markdown</button></div></div>`);
  const drafts = [];
  const originalText = project => {
    const review = reviewOf(project);
    const bullets = [
      project.contribution, project.method && `方法与工具：${project.method}`,
      review.actual && `实际完成：${review.actual}`, (review.evidence || project.outcome) && `成果：${review.evidence || project.outcome}`
    ].filter(Boolean);
    const date = [project.start, project.end].filter(Boolean).join(' ～ ');
    return [`### ${project.name}`, [project.role, date].filter(Boolean).join(' · '), ...bullets.map(item => `- ${item}`)].filter(Boolean).join('\n');
  };
  for (const id of new Set(selected)) {
    const index = projects.findIndex(project => project.id === id);
    if (index !== -1) drafts.push({ index, text: edits.get(id) ?? originalText(projects[index]) });
  }
  function saveDrafts() {
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        selected: drafts.map(draft => projects[draft.index].id),
        edits: [...edits],
        links: $('#include-links').checked,
      }));
    } catch { dialog.querySelector('.error').textContent = '草稿自动保存失败，请先复制或下载。'; }
  }
  function drawDrafts(focusIndex, direction) {
    $('#drafts').innerHTML = drafts.map(({ index, text }, position) =>
      `<div class="draft"><div class="toolbar"><strong>${escapeHtml(projects[index].name)}</strong><div class="row-actions">
      <button data-move="-1" data-position="${position}" aria-label="上移 ${escapeHtml(projects[index].name)}" ${position === 0 ? 'disabled' : ''}>↑</button>
      <button data-move="1" data-position="${position}" aria-label="下移 ${escapeHtml(projects[index].name)}" ${position === drafts.length - 1 ? 'disabled' : ''}>↓</button>
      </div></div><label class="field">经历草稿<textarea data-edit="${position}">${escapeHtml(text)}</textarea></label></div>`).join('');
    $('#copy').disabled = $('#markdown').disabled = !drafts.length;
    if (focusIndex !== undefined) {
      const button = $('#drafts').querySelector(`[data-position="${focusIndex}"][data-move="${direction}"]`);
      (button.disabled ? $('#drafts').querySelector(`[data-edit="${focusIndex}"]`) : button).focus();
    }
  }
  dialog.querySelectorAll('[data-project]').forEach(input => {
    input.onchange = () => {
      const index = Number(input.dataset.project);
      const savedDraft = drafts.find(draft => draft.index === index);
      if (input.checked && !savedDraft) drafts.push({ index, text: edits.get(projects[index].id) ?? originalText(projects[index]) });
      if (!input.checked && savedDraft) {
        drafts.splice(drafts.indexOf(savedDraft), 1);
      }
      drawDrafts();
      saveDrafts();
    };
  });
  $('#drafts').oninput = event => {
    const draft = drafts[Number(event.target.dataset.edit)];
    if (!draft) return;
    draft.text = event.target.value;
    edits.set(projects[draft.index].id, draft.text);
    saveDrafts();
  };
  $('#include-links').onchange = saveDrafts;
  $('#drafts').onclick = event => {
    const button = event.target.closest('[data-move]');
    if (!button) return;
    const position = Number(button.dataset.position);
    const direction = Number(button.dataset.move);
    const next = position + direction;
    [drafts[position], drafts[next]] = [drafts[next], drafts[position]];
    drawDrafts(next, direction);
    saveDrafts();
  };
  function output() {
    const includeLinks = $('#include-links').checked;
    const content = drafts.map(({ index, text }) => {
      const links = includeLinks ? projects[index].links.map(({ label, url }) => {
        const safeLabel = (label || '成果链接').replace(/[\\\[\]\r\n]/g, ' ');
        return `- [${safeLabel}](<${new URL(url).href.replaceAll('<', '%3C').replaceAll('>', '%3E')}>)`;
      }) : [];
      return [text.trim(), ...links].filter(Boolean).join('\n');
    }).filter(Boolean).join('\n\n');
    return content ? content + '\n' : '';
  }
  const message = dialog.querySelector('.error');
  $('#copy').onclick = async () => {
    const content = output();
    if (!content) { message.textContent = '请先填写经历草稿。'; return; }
    const copyButton = $('#copy');
    try {
      await navigator.clipboard.writeText(content);
      message.textContent = '';
      copyButton.textContent = '已复制';
    } catch { message.textContent = '浏览器未允许复制，可下载 Markdown 或手动复制。'; }
  };
  $('#markdown').onclick = () => {
    const content = output();
    if (!content) { message.textContent = '请先填写经历草稿。'; return; }
    message.textContent = '';
    download('简历经历草稿.md', content, 'text/markdown;charset=utf-8');
  };
  drawDrafts();
}
function addTerm() {
  openDialog('添加学期', `<form class="stack">${field('学期名称（例如 2026–2027 春季）', 'term', '', 'text', true)}
    ${formError}<div><button class="primary" type="submit">添加</button></div></form>`);
  dialog.querySelector('form').onsubmit = event => {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get('term').trim();
    if (!name || data.terms.includes(name)) {
      dialog.querySelector('.error').textContent = '请输入尚未创建的学期名称。';
      return;
    }
    if (commit({ ...data, terms: [...data.terms, name] }, '学期已添加。')) {
      term = name;
      render();
    }
  };
}

$('#new-project').onclick = () => editProject();
$('#new-term').onclick = addTerm;
$('#resume').onclick = openResume;
$('#header-resume').onclick = openResume;
$('#term').onchange = event => { term = event.target.value; render(); };
$('#search').oninput = render;
$('#filter').onchange = render;
$('#metrics').onclick = event => {
  const button = event.target.closest('[data-state]');
  if (!button) return;
  category = '全部项目';
  $('#search').value = '';
  $('#filter').value = button.dataset.state;
  render();
  $('#metrics').querySelector(`[data-state="${button.dataset.state}"]`).focus();
};
function selectCategory(next) {
  category = next;
  $('#search').value = '';
  $('#filter').value = category === '学期复盘' ? 'pending' : 'all';
  render();
  $('#nav').querySelector('[aria-pressed=true]').focus();
}
$('#nav').onclick = event => {
  const button = event.target.closest('[data-category]');
  if (button) selectCategory(button.dataset.category);
};
$('#header-projects').onclick = () => selectCategory('全部项目');
$('#header-review').onclick = () => selectCategory('学期复盘');
$('#list').onclick = event => {
  const button = event.target.closest('[data-id]');
  if (!button) return;
  const project = data.projects.find(item => item.id === button.dataset.id);
  if (button.dataset.action === 'edit') editProject(project);
  else editReview(project);
};
$('#backup').onclick = () => download('项目记录备份.json', JSON.stringify(data, null, 2), 'application/json');
$('#restore').onclick = () => $('#backup-file').click();
$('#backup-file').onchange = async event => {
  const [file] = event.target.files;
  event.target.value = '';
  if (!file) return;
  try {
    const backup = validate(JSON.parse(await file.text()));
    if (confirm(`用备份中的 ${backup.terms.length} 个学期、${backup.projects.length} 个项目替换当前数据？`)) {
      commit(backup, '已从备份恢复数据。');
    }
  } catch { status('无法恢复：请选择本应用导出的有效 JSON 备份。'); }
};
render();
