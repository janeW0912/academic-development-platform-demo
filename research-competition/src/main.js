const competitions = [
  {
    id: 'cuumcm',
    name: '全国大学生数学建模竞赛',
    alias: '国赛 · CUMCM',
    category: '数学建模',
    time: '每年9月中上旬',
    summary: '不超过三人组队，在连续三天内完成选题、建模、编程、论文写作。',
    overview: '国赛是一项团队数学建模竞赛。比赛期间，队伍从官方公布的A、B、C三个赛题中选择一个，在连续三天内完成从问题分析、模型构建、编程求解到论文撰写的完整过程。不同题目对数学基础、编程能力和写作能力的要求各有侧重，最终根据获奖等级进行相应的科研加分认定。',
    facts: [
      ['组队方式', '每队不超过3名校内学生，可以跨专业组队'],
      ['比赛形式', '连续三天，从A、B、C题中选择一题完成'],
      ['最终成果', '完整的数学建模竞赛论文'],
      ['通知渠道', '具体报名通知由数学学院发布'],
    ],
    preparation: [
      ['组建能力互补的队伍', '尽早寻找熟悉、靠谱且分工互补的队友，最好兼顾建模、编程和论文写作三个方面。'],
      ['进行完整的限时模拟', '赛前按正式比赛节奏练习选题、建模、代码实现和写作，磨合资料共享、进度管理与论文整合方式。'],
      ['结合优势研究选题', '了解不同赛题的常见方法，根据队员专业背景与能力选题。C题通常更容易入手，但选择队伍多，竞争也更激烈。'],
      ['提前准备写作规范', '整理论文结构、图表格式、参考文献与模型检验的常见写法，避免把大量时间留到最后一天才处理排版。'],
    ],
    timeline: [
      ['赛前', '完成组队与分工，关注数学学院报名通知，并进行限时模拟训练。'],
      ['9月中上旬', '正式比赛，连续三天完成选题、建模、求解与论文提交。'],
      ['比赛结束后', '关注获奖结果，并按学院要求留存证书等科研认定材料。'],
    ],
  },
  {
    id: 'mcm-icm',
    name: '美国大学生数学建模竞赛',
    alias: '美赛 · MCM / ICM',
    category: '数学建模',
    time: '每年1月底前后',
    summary: '形式与国赛相近，但赛题与论文均为英文，分为MCM数学建模和ICM交叉学科建模两大类。',
    overview: '美赛同样由不超过3名学生组队，在集中比赛时间内完成建模与论文写作。与国赛相比，最显著的区别是赛题和最终论文均为英文。竞赛分为MCM（数学建模竞赛）和ICM（交叉学科建模竞赛），前者包括A、B、C题，后者包括D、E、F题，研究对象与方法侧重点不同。',
    facts: [
      ['组队方式', '每队不超过3名学生'],
      ['竞赛类别', 'MCM：A、B、C题；ICM：D、E、F题'],
      ['语言要求', '赛题与最终论文均使用英文'],
      ['通知渠道', '具体报名通知由数学学院发布'],
    ],
    preparation: [
      ['按背景选择竞赛类别', '提前了解MCM与ICM各类题目的研究对象和常用方法，结合队伍成员的数学、编程、专业背景与英语能力选择方向。'],
      ['训练英文阅读与写作', '练习快速阅读英文赛题，积累摘要、模型假设、结果分析与结论等部分的英文表达，形成可复用的写作框架。'],
      ['完成英文全流程模拟', '使用往年题目进行限时训练，把建模、编程、可视化和英文论文整合放在同一流程中检验。'],
      ['合理看待结果不确定性', '重视过程中的能力积累与作品完成度，同时关注获奖结果和学院科研加分认定要求。'],
    ],
    timeline: [
      ['赛前数月', '组队并确定分工，训练英文论文写作，使用往年题目进行模拟。'],
      ['1月底前后', '关注数学学院通知并完成报名，按官方赛程集中完成比赛。'],
      ['比赛结束后', '关注成绩与获奖信息，保存科研认定所需材料。'],
    ],
  },
  {
    id: 'qiushi',
    name: '“求是学术”品牌研究项目',
    alias: '大创 · 求是学术',
    category: '学术研究',
    time: '每年3月中下旬申报',
    summary: '从组队、选题、立项到中期检查和次年结项，整体周期接近一年，更强调持续的研究推进。',
    overview: '“求是学术”品牌研究项目是由本科生自行组队申报的研究项目。团队需要完成选题、联系指导教师、撰写立项书，并经历学院初评、立项评审、中期检查和最终结项。项目分为“强国”“首善”“青苗”等不同等级，立项等级、结项等级以及是否担任负责人，都会影响相应的科研加分认定。',
    facts: [
      ['组队方式', '每队不超过5人，其中1人为项目负责人'],
      ['申报地点', '一般在项目负责人所在学院申报'],
      ['项目等级', '“强国”“首善”“青苗”等立项等级'],
      ['项目周期', '接近一年，需完成中期检查与次年结项'],
    ],
    preparation: [
      ['从2月开始提前准备', '本科生院往往会提前发布通知。尽早完成组队，并考虑负责人所在学院与最终申报学院。'],
      ['确定选题与指导教师', '可以联系公布选题的校内教师，也可以由团队自行确定研究题目后，再邀请教师担任指导老师。'],
      ['打磨立项书与答辩', '清晰说明研究问题、研究价值、方法路线、团队分工和进度安排；申报“强国”候选项目的团队还需准备现场展示与答辩。'],
      ['为长期推进预留时间', '立项并不等于直接获得加分。持续保存研究过程材料，认真完成中期检查和结项。若用于大三推免认定，建议大二就开始参与。'],
    ],
    timeline: [
      ['2月左右', '开始关注通知，完成组队、联系指导教师与立项书准备。'],
      ['3月中下旬', '正式申报，进入统一的立项评审。'],
      ['4月初至中旬', '学院初评；部分“强国”候选团队进行现场展示和答辩。'],
      ['11月底前后', '“强国”项目参加中期答辩，检查实际推进情况。'],
      ['次年3月左右', '提交最终结项材料，由评审给出“优秀”“良好”“合格”等等级。'],
    ],
  },
  {
    id: 'innovation-cup',
    name: '“创新杯”中国人民大学学生课外学术科技作品竞赛',
    alias: '小创 · 创新杯',
    category: '学术研究',
    time: '寒假结束后提交作品',
    summary: '在较集中的周期内完成一项相对完整的研究并形成论文，可分为同时参加的主体赛与专项赛。',
    overview: '“创新杯”要求在相对集中的时间内完成一项研究并形成论文。竞赛分为主体赛和专项赛，两个赛道可以同时参加。主体赛通常围绕各学院给出的参考选题展开，团队可进一步拓展和细化；专项赛更多围绕国家发展的重大理论与现实问题、学术研究前沿和科技创新前沿等方向命题。不同赛道分别评选奖项。',
    facts: [
      ['竞赛赛道', '主体赛与专项赛，可以同时参加'],
      ['最终成果', '相对完整的研究与竞赛论文'],
      ['通知渠道', '前一年年底关注人大青年网、学校团委相关公众号'],
      ['成员认定', '素材中说明负责人和普通成员的加分通常没有区别'],
    ],
    preparation: [
      ['寒假前完成前期准备', '在寒假开始前完成组队、选题和指导教师联系，避免把方向讨论拖延到集中写作阶段。'],
      ['选择适合的研究赛道', '主体赛可从学院参考选题中继续细化；专项赛则需准确回应命题方向。若同时参加，应提前评估工作量。'],
      ['利用寒假集中推进', '安排文献阅读、研究设计、数据收集、分析和论文写作的节点，预留团队内部修改与指导教师反馈时间。'],
      ['以完整作品为目标', '重视研究问题、证据、分析过程和论文表达之间的一致性，形成结构完整、论证清晰的作品。'],
    ],
    timeline: [
      ['前一年年底', '关注人大青年网及学校团委相关公众号发布的竞赛通知。'],
      ['寒假开始前', '完成组队、选题和指导老师联系，制定研究与写作计划。'],
      ['寒假期间', '集中推进研究、数据收集与论文写作，并根据反馈修改。'],
      ['寒假结束后', '按通知要求提交最终作品，关注各赛道评审结果。'],
    ],
  },
  {
    id: 'market-research',
    name: '全国大学生市场调查与分析大赛',
    alias: '市调 · 正大杯',
    category: '调查分析',
    time: '每年10月左右报名',
    summary: '完成选题、问卷设计、数据收集、统计分析与报告撰写，经历完整的商业研究与分析流程。',
    overview: '市场调查与分析大赛分为知识赛和实践赛。知识赛为个人在线考试，达到相应要求后方可继续参加实践赛；实践赛为团队赛，包括校赛、企业命题赛、省赛和全国总决赛等环节。常规赛道需要围绕选题开展市场调查、数据分析和报告写作，学校再根据校赛结果按比例推荐队伍进入后续赛事。',
    facts: [
      ['组队方式', '同一学校的3—5名学生组成队伍，并联系指导老师'],
      ['竞赛阶段', '个人知识赛通过后，进入团队实践赛'],
      ['最终成果', '市场调查、统计分析与完整研究报告'],
      ['通知渠道', '关注统计学院公众号等平台发布的报名信息'],
    ],
    preparation: [
      ['先通过知识赛', '报名后按考试要求准备个人在线知识赛，为后续团队实践赛取得参赛资格。'],
      ['重视选题质量', '选择具有现实意义且有一定新颖性的题目，同时评估目标人群能否触达、数据能否获得、方法能否支撑。'],
      ['训练调研与统计方法', '提前学习问卷设计、抽样与发放、数据清洗、统计分析和可视化，避免只堆砌图表而缺少研究逻辑。'],
      ['投入报告与展示打磨', '让研究问题、调研设计、数据证据和结论建议形成闭环，并为校赛及后续选拔预留修改时间。'],
    ],
    timeline: [
      ['10月左右', '开始报名，关注统计学院公众号等平台通知，并完成组队与指导教师联系。'],
      ['11月左右', '完成个人知识赛；通过后，团队开始确定选题并开展调研。'],
      ['次年3月左右', '常规赛道完成市场调查、数据分析与最终报告，参加校赛及后续选拔。'],
      ['后续阶段', '根据校赛、省赛和全国总决赛安排持续推进，保存获奖与科研认定材料。'],
    ],
  },
];

const categories = ['数学建模', '学术研究', '调查分析'];
const search = document.querySelector('#search');
const list = document.querySelector('#competition-list');
const dialog = document.querySelector('#guide-dialog');
const liveStatus = document.querySelector('#live-status');
let activeCategory = '';

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function filteredCompetitions() {
  const query = search.value.trim().toLocaleLowerCase('zh-CN');
  return competitions.filter((item) => {
    const inCategory = !activeCategory || item.category === activeCategory;
    const searchable = [
      item.name, item.alias, item.category, item.time, item.summary, item.overview,
      ...item.facts.flat(), ...item.preparation.flat(), ...item.timeline.flat(),
    ].join(' ').toLocaleLowerCase('zh-CN');
    return inCategory && (!query || searchable.includes(query));
  });
}

function renderCategories() {
  const container = document.querySelector('#categories');
  container.replaceChildren();
  for (const category of ['', ...categories]) {
    const count = category ? competitions.filter((item) => item.category === category).length : competitions.length;
    const button = element('button', undefined, 'category-button');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(activeCategory === category));
    button.setAttribute('aria-label', `${category || '竞赛与项目'}，${count}项`);
    button.append(element('span', category || '竞赛与项目'), element('strong', String(count)));
    button.addEventListener('click', () => {
      activeCategory = category;
      render();
      document.querySelector('#list-title').focus({ preventScroll: true });
    });
    container.append(button);
  }
}

function renderList() {
  const visible = filteredCompetitions();
  document.querySelector('#list-title').textContent = activeCategory || '竞赛与项目';
  document.querySelector('#results').textContent = '';
  list.replaceChildren();

  if (!visible.length) {
    const empty = element('div', undefined, 'empty-state');
    empty.append(
      element('h3', '没有匹配的竞赛或项目'),
      element('p', '可以更换关键词，或清除分类与搜索条件。'),
    );
    const clear = element('button', '清除筛选');
    clear.type = 'button';
    clear.addEventListener('click', () => {
      activeCategory = '';
      search.value = '';
      render();
      search.focus();
    });
    empty.append(clear);
    list.append(empty);
    return;
  }

  for (const item of visible) {
    const article = element('article', undefined, 'competition-item');
    const copy = element('div');
    const heading = element('h3');
    const open = element('button', item.name, 'competition-open');
    open.type = 'button';
    open.dataset.competition = item.id;
    open.setAttribute('aria-label', `查看${item.name}参赛指南`);
    open.addEventListener('click', () => openGuide(item.id));
    heading.append(open);
    copy.append(element('span', item.alias, 'competition-alias'), heading, element('p', item.summary, 'competition-summary'));
    const time = element('div', undefined, 'competition-time');
    time.append(element('span', '常规时间'), element('strong', item.time));
    article.append(copy, time);
    list.append(article);
  }
}

function render() {
  renderCategories();
  renderList();
}

function fillList(selector, rows, rowRenderer) {
  const container = document.querySelector(selector);
  container.replaceChildren(...rows.map(rowRenderer));
}

function openGuide(id) {
  const item = competitions.find((competition) => competition.id === id);
  if (!item) return;
  document.querySelector('#guide-category').textContent = `${item.alias} · ${item.category}`;
  document.querySelector('#guide-title').textContent = item.name;
  document.querySelector('#guide-time').textContent = item.time;
  document.querySelector('#guide-overview').textContent = item.overview;

  fillList('#guide-facts', item.facts, ([label, value]) => {
    const group = element('div');
    group.append(element('dt', label), element('dd', value));
    return group;
  });
  fillList('#guide-preparation', item.preparation, ([title, description]) => {
    const li = element('li');
    li.append(element('strong', title), element('p', description));
    return li;
  });
  fillList('#guide-timeline', item.timeline, ([time, description]) => {
    const row = element('div', undefined, 'timeline-row');
    row.append(element('strong', time), element('span', description));
    return row;
  });

  dialog.showModal();
  dialog.scrollTop = 0;
  liveStatus.textContent = `已打开${item.name}参赛指南`;
}

document.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});
search.addEventListener('input', renderList);
render();