import { WordCategory } from '../types';

export interface WordCategoryInfo {
  id: WordCategory;
  name: string;
  nameEn: string;
  description: string;
  words: string[];
}

export const WORD_CATEGORIES: WordCategoryInfo[] = [
  {
    id: 'common200',
    name: '基礎常用 200 字',
    nameEn: 'Top 200 Words',
    description: '英文中最核心、出現頻率最高的基本字彙，打字入門首選',
    words: [
      'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'I', 'with', 'as', 'not', 'on', 'she', 'at',
      'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more',
      'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than', 'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take',
      'come', 'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any', 'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even', 'find',
      'day', 'also', 'after', 'way', 'many', 'must', 'look', 'before', 'great', 'back', 'through', 'long', 'where', 'much', 'should', 'well', 'people', 'down', 'own', 'just',
      'because', 'good', 'each', 'those', 'feel', 'seem', 'how', 'high', 'too', 'place', 'little', 'world', 'very', 'still', 'nation', 'hand', 'old', 'life', 'tell', 'write',
      'become', 'here', 'show', 'house', 'both', 'between', 'need', 'mean', 'call', 'develop', 'under', 'last', 'right', 'move', 'thing', 'general', 'school', 'never', 'same', 'another',
      'begin', 'while', 'number', 'part', 'turn', 'real', 'leave', 'might', 'want', 'point', 'form', 'child', 'few', 'small', 'since', 'against', 'ask', 'late', 'home', 'interest',
      'large', 'person', 'end', 'open', 'public', 'follow', 'during', 'present', 'without', 'again', 'hold', 'govern', 'around', 'possible', 'head', 'consider', 'word', 'program', 'problem', 'however',
      'lead', 'system', 'set', 'order', 'eye', 'plan', 'run', 'keep', 'face', 'fact', 'group', 'play', 'stand', 'increase', 'early', 'course', 'change', 'help', 'line'
    ]
  },
  {
    id: 'common1000',
    name: '常用進階 1000 字',
    nameEn: 'Core 1000 Words',
    description: '日常生活與流暢閱讀所需的豐富字庫，適合全面提升打字節奏',
    words: [
      'ability', 'able', 'about', 'above', 'accept', 'according', 'account', 'across', 'action', 'activity', 'actually', 'address', 'administration', 'admit', 'adult', 'affect', 'after', 'again', 'against', 'agency',
      'agent', 'agree', 'agreement', 'ahead', 'allow', 'almost', 'alone', 'along', 'already', 'also', 'although', 'always', 'American', 'among', 'amount', 'analysis', 'animal', 'another', 'answer', 'anyone',
      'anything', 'appear', 'apply', 'approach', 'area', 'argue', 'around', 'arrive', 'article', 'artist', 'assume', 'attack', 'attempt', 'attend', 'attention', 'attorney', 'audience', 'author', 'authority', 'available',
      'avoid', 'beautiful', 'because', 'become', 'before', 'begin', 'behavior', 'behind', 'believe', 'benefit', 'better', 'between', 'beyond', 'billion', 'brother', 'budget', 'building', 'business', 'camera', 'campaign',
      'candidate', 'capital', 'career', 'century', 'certain', 'certainly', 'challenge', 'chance', 'character', 'charge', 'choice', 'choose', 'church', 'citizen', 'civil', 'claim', 'clearly', 'coach', 'cold', 'collection',
      'college', 'commercial', 'common', 'community', 'company', 'compare', 'computer', 'concern', 'condition', 'conference', 'Congress', 'consider', 'consumer', 'contain', 'continue', 'control', 'cost', 'country', 'couple', 'courage',
      'course', 'court', 'create', 'crime', 'cultural', 'culture', 'cup', 'current', 'customer', 'daughter', 'decade', 'decide', 'decision', 'defense', 'degree', 'democrat', 'democratic', 'describe', 'design', 'despite',
      'detail', 'determine', 'develop', 'development', 'difference', 'different', 'difficult', 'direction', 'director', 'discover', 'discuss', 'discussion', 'disease', 'doctor', 'during', 'economic', 'economy', 'edge', 'education', 'effect',
      'effort', 'election', 'element', 'energy', 'enjoy', 'enough', 'enter', 'entire', 'environment', 'environmental', 'especially', 'establish', 'evening', 'event', 'everybody', 'everyone', 'everything', 'evidence', 'exactly', 'example',
      'executive', 'expect', 'experience', 'expert', 'explain', 'factor', 'factory', 'family', 'feeling', 'finally', 'financial', 'finger', 'finish', 'fire', 'focus', 'force', 'foreign', 'forget', 'former', 'forward',
      'freedom', 'friend', 'future', 'generation', 'growth', 'happen', 'health', 'history', 'hospital', 'identify', 'imagine', 'impact', 'important', 'improve', 'include', 'including', 'increase', 'indicate', 'individual', 'industry',
      'information', 'inside', 'instead', 'institution', 'interest', 'interesting', 'international', 'interview', 'investment', 'involve', 'issue', 'knowledge', 'language', 'leader', 'leadership', 'learning', 'listen', 'location', 'machine', 'magazine'
    ]
  },
  {
    id: 'tech',
    name: '科技與資訊科技詞彙',
    nameEn: 'Tech & Programming',
    description: '軟體開發、硬體、網路、人工智慧與程式語法常見關鍵字',
    words: [
      'algorithm', 'array', 'async', 'await', 'backend', 'bandwidth', 'binary', 'boolean', 'browser', 'buffer',
      'cache', 'callback', 'class', 'cloud', 'cluster', 'compiler', 'component', 'constant', 'database', 'debug',
      'decorator', 'deployment', 'developer', 'directory', 'docker', 'endpoint', 'engine', 'exception', 'execute', 'export',
      'framework', 'frontend', 'function', 'gateway', 'generator', 'github', 'hardware', 'immutable', 'import', 'index',
      'inheritance', 'instance', 'interface', 'iteration', 'javascript', 'json', 'kernel', 'lambda', 'latency', 'library',
      'localhost', 'memory', 'microservice', 'middleware', 'module', 'network', 'nodejs', 'nullable', 'object', 'optimization',
      'package', 'parameter', 'pipeline', 'pointer', 'polymorphism', 'process', 'promise', 'protocol', 'python', 'query',
      'queue', 'react', 'recursion', 'refactor', 'repository', 'request', 'response', 'router', 'runtime', 'schema',
      'security', 'server', 'session', 'singleton', 'socket', 'software', 'stack', 'state', 'string', 'struct',
      'syntax', 'terminal', 'thread', 'token', 'typescript', 'variable', 'version', 'virtual', 'webhook', 'websocket'
    ]
  },
  {
    id: 'business',
    name: '商務與職場英文',
    nameEn: 'Business & Workplace',
    description: '商務會議、金融市場、專案管理與職場溝通核心術語',
    words: [
      'acquisition', 'agenda', 'allocation', 'analytics', 'annual', 'appraisal', 'asset', 'audit', 'benchmark', 'boardroom',
      'brainstorm', 'briefing', 'budget', 'campaign', 'capital', 'collaboration', 'compliance', 'conglomerate', 'consensus', 'consultant',
      'contract', 'corporation', 'deliverable', 'dividend', 'efficiency', 'engagement', 'enterprise', 'equity', 'evaluation', 'executive',
      'expenditure', 'feasibility', 'feedback', 'financial', 'forecast', 'governance', 'headquarters', 'incentive', 'inflation', 'infrastructure',
      'initiative', 'innovation', 'insight', 'investor', 'leadership', 'leverage', 'liability', 'logistics', 'management', 'margin',
      'marketing', 'milestone', 'negotiation', 'networking', 'objective', 'operation', 'opportunity', 'partnership', 'portfolio', 'presentation',
      'productivity', 'profitability', 'proposal', 'quarterly', 'recruitment', 'redundancy', 'regulation', 'remuneration', 'restructuring', 'revenue',
      'scalability', 'shareholder', 'stakeholder', 'strategic', 'sustainable', 'synergy', 'timeline', 'transaction', 'turnover', 'venture'
    ]
  },
  {
    id: 'toefl',
    name: '學術與托福/雅思高頻字',
    nameEn: 'Academic & TOEFL / IELTS',
    description: '學術論文、閱讀測驗與留學考試精選進階長單字，挑戰高精度盲打',
    words: [
      'aberration', 'accommodate', 'accumulation', 'acquiesce', 'ambiguous', 'anachronism', 'anomalous', 'antecedent', 'anthropology', 'apprehensive',
      'arbitrary', 'archaeology', 'articulate', 'assimilation', 'authenticity', 'autonomous', 'benevolent', 'biodiversity', 'camouflaged', 'catastrophe',
      'chronological', 'circumstance', 'coexistence', 'cognitive', 'cohesive', 'commensurate', 'compartment', 'complementary', 'comprehensive', 'concomitant',
      'condescending', 'conducive', 'configuration', 'conglomeration', 'connoisseur', 'conscientious', 'consecutive', 'consequence', 'contemporaneous', 'controversy',
      'conventional', 'corroborate', 'counterintuitive', 'cumulative', 'deceleration', 'deficiency', 'deleterious', 'demographic', 'deterioration', 'dichotomy',
      'differentiation', 'diminution', 'discrepancy', 'dissemination', 'eccentricity', 'egalitarian', 'elaboration', 'eloquence', 'empirical', 'encapsulate',
      'encompassing', 'endemic', 'ephemeral', 'equilibrium', 'equivocal', 'eradication', 'esoteric', 'etymology', 'euphemism', 'exacerbate'
    ]
  },
  {
    id: 'irregular_verbs',
    name: '不規則動詞三態變化',
    nameEn: 'Irregular Verbs',
    description: '熟練動詞原形、過去式、過去分詞組合，增強詞彙直覺反應',
    words: [
      'arise arose arisen', 'awake awoke awoken', 'bear bore borne', 'beat beat beaten', 'become became become',
      'begin began begun', 'bend bent bent', 'bet bet bet', 'bind bound bound', 'bite bit bitten',
      'bleed bled bled', 'blow blew blown', 'break broke broken', 'breed bred bred', 'bring brought brought',
      'broadcast broadcast broadcast', 'build built built', 'burn burnt burnt', 'burst burst burst', 'buy bought bought',
      'catch caught caught', 'choose chose chosen', 'cling clung clung', 'come came come', 'cost cost cost',
      'creep crept crept', 'cut cut cut', 'deal dealt dealt', 'dig dug dug', 'draw drew drawn',
      'dream dreamt dreamt', 'drink drank drunk', 'drive drove driven', 'eat ate eaten', 'fall fell fallen',
      'feed fed fed', 'feel felt felt', 'fight fought fought', 'find found found', 'flee fled fled',
      'fly flew flown', 'forbid forbade forbidden', 'forget forgot forgotten', 'forgive forgave forgiven', 'freeze froze frozen',
      'get got gotten', 'give gave given', 'go went gone', 'grow grew grown', 'hang hung hung',
      'have had had', 'hear heard heard', 'hide hid hidden', 'hit hit hit', 'hold held held'
    ]
  }
];

export function getRandomWords(category: WordCategory, count: number = 80): string {
  const cat = WORD_CATEGORIES.find(c => c.id === category) || WORD_CATEGORIES[0];
  const list = [...cat.words];
  const selected: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * list.length);
    selected.push(list[randomIndex]);
  }
  
  return selected.join(' ');
}
