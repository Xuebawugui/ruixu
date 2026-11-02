export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ru', label: 'Русский' },
];

const en = {
  notice:
    'Screenshot the Item ID or album title, then contact us for pricing and orders.',
  nav: {
    home: 'Home',
    albums: 'Albums',
    contact: 'Contact',
    allCategories: 'All categories',
    searchPlaceholder: 'Search albums / Item ID',
    search: 'Search',
  },
  home: { title: 'Home' },
  albums: { title: 'All albums' },
  search: {
    title: 'Search',
    titleQuery: 'Search: “{{q}}”',
    hint: 'Enter style number, Item ID or keywords in the search bar above.',
    results: '{{count}} results',
  },
  category: {
    searchPlaceholder: 'Search in this category…',
    count: '{{count}} items',
    notFound: 'Category not found',
  },
  album: {
    notFound: 'Album not found',
    orderHint:
      'Like this item? Screenshot and contact us to order (Item / title: {{title}})',
    syncFullHint:
      'Only cover cached locally. Run npm run sync:full for all photos in this album.',
    backHome: 'Back to home',
  },
  common: {
    photos: '{{count}} photos',
    albumsTotal: '{{count}} albums',
    noAlbums: 'No matching albums',
    loading: 'Loading…',
    loadFailed: 'Failed to load',
    syncHint: 'Run in project folder: npm install && npm run sync',
    needSync: 'Sync product data first',
    breadcrumbHome: 'Home',
    breadcrumbSearch: 'Search',
  },
  pagination: { prev: 'Previous', next: 'Next' },
  contact: { region: 'Contact us' },
  wechatCopied: 'WeChat ID copied: {{id}}',
};

const zhCN = {
  notice: '看款请截图 Item ID / 相册标题，联系客服报价下单',
  nav: {
    home: '首页',
    albums: '相册',
    contact: '联系档案',
    allCategories: '全部分类',
    searchPlaceholder: '搜索相册 / 款号 / Item ID',
    search: '搜索',
  },
  home: { title: '首页' },
  albums: { title: '全部相册' },
  search: {
    title: '搜索',
    titleQuery: '搜索：“{{q}}”',
    hint: '在顶部搜索框输入款号、Item ID 或标题关键词。',
    results: '找到 {{count}} 个结果',
  },
  category: {
    searchPlaceholder: '本分类内搜索…',
    count: '{{count}} 款',
    notFound: '分类不存在',
  },
  album: {
    notFound: '相册不存在',
    orderHint: '喜欢这款？截图联系客服下单（Item / 标题：{{title}}）',
    syncFullHint: '本地仅缓存封面。执行 npm run sync:full 可拉取该相册全部图片。',
    backHome: '返回首页',
  },
  common: {
    photos: '{{count}} 图',
    albumsTotal: '共 {{count}} 个相册',
    noAlbums: '没有匹配的相册',
    loading: '加载中…',
    loadFailed: '加载失败',
    syncHint: '在项目目录执行：npm install && npm run sync',
    needSync: '请先同步产品数据',
    breadcrumbHome: '首页',
    breadcrumbSearch: '搜索',
  },
  pagination: { prev: '上一页', next: '下一页' },
  contact: { region: '联系方式' },
  wechatCopied: '已复制 WeChat：{{id}}',
};

const zhTW = {
  ...zhCN,
  notice: '看款請截圖 Item ID / 相冊標題，聯繫客服報價下單',
  nav: {
    home: '首頁',
    albums: '相冊',
    contact: '聯繫檔案',
    allCategories: '全部分類',
    searchPlaceholder: '搜索相冊 / 款號 / Item ID',
    search: '搜索',
  },
  home: { title: '首頁' },
  albums: { title: '全部相冊' },
  search: {
    title: '搜索',
    titleQuery: '搜索：「{{q}}」',
    hint: '在頂部搜索框輸入款號、Item ID 或標題關鍵詞。',
    results: '找到 {{count}} 個結果',
  },
  category: {
    searchPlaceholder: '本分類內搜索…',
    count: '{{count}} 款',
    notFound: '分類不存在',
  },
  album: {
    notFound: '相冊不存在',
    orderHint: '喜歡這款？截圖聯繫客服下單（Item / 標題：{{title}}）',
    syncFullHint: '本地僅緩存封面。執行 npm run sync:full 可拉取該相冊全部圖片。',
    backHome: '返回首頁',
  },
  common: {
    photos: '{{count}} 圖',
    albumsTotal: '共 {{count}} 個相冊',
    noAlbums: '沒有匹配的相冊',
    loading: '載入中…',
    loadFailed: '載入失敗',
    syncHint: '在專案目錄執行：npm install && npm run sync',
    needSync: '請先同步產品數據',
    breadcrumbHome: '首頁',
    breadcrumbSearch: '搜索',
  },
  pagination: { prev: '上一頁', next: '下一頁' },
  contact: { region: '聯繫方式' },
  wechatCopied: '已複製 WeChat：{{id}}',
};

const es = {
  notice:
    'Capture el Item ID o el título del álbum y contáctenos para precio y pedido.',
  nav: {
    home: 'Inicio',
    albums: 'Álbumes',
    contact: 'Contacto',
    allCategories: 'Todas las categorías',
    searchPlaceholder: 'Buscar álbumes / Item ID',
    search: 'Buscar',
  },
  home: { title: 'Inicio' },
  albums: { title: 'Todos los álbumes' },
  search: {
    title: 'Buscar',
    titleQuery: 'Buscar: “{{q}}”',
    hint: 'Introduzca número de modelo, Item ID o palabras clave arriba.',
    results: '{{count}} resultados',
  },
  category: {
    searchPlaceholder: 'Buscar en esta categoría…',
    count: '{{count}} artículos',
    notFound: 'Categoría no encontrada',
  },
  album: {
    notFound: 'Álbum no encontrado',
    orderHint:
      '¿Le gusta? Capture pantalla y contáctenos (Item / título: {{title}})',
    syncFullHint:
      'Solo portada en caché. Ejecute npm run sync:full para todas las fotos.',
    backHome: 'Volver al inicio',
  },
  common: {
    photos: '{{count}} fotos',
    albumsTotal: '{{count}} álbumes',
    noAlbums: 'Sin álbumes coincidentes',
    loading: 'Cargando…',
    loadFailed: 'Error al cargar',
    syncHint: 'En el proyecto: npm install && npm run sync',
    needSync: 'Sincronice los productos primero',
    breadcrumbHome: 'Inicio',
    breadcrumbSearch: 'Buscar',
  },
  pagination: { prev: 'Anterior', next: 'Siguiente' },
  contact: { region: 'Contáctenos' },
  wechatCopied: 'WeChat copiado: {{id}}',
};

const pt = {
  notice:
    'Capture o Item ID ou título do álbum e contacte-nos para preço e encomenda.',
  nav: {
    home: 'Início',
    albums: 'Álbuns',
    contact: 'Contacto',
    allCategories: 'Todas as categorias',
    searchPlaceholder: 'Pesquisar álbuns / Item ID',
    search: 'Pesquisar',
  },
  home: { title: 'Início' },
  albums: { title: 'Todos os álbuns' },
  search: {
    title: 'Pesquisar',
    titleQuery: 'Pesquisar: “{{q}}”',
    hint: 'Introduza referência, Item ID ou palavras-chave acima.',
    results: '{{count}} resultados',
  },
  category: {
    searchPlaceholder: 'Pesquisar nesta categoria…',
    count: '{{count}} itens',
    notFound: 'Categoria não encontrada',
  },
  album: {
    notFound: 'Álbum não encontrado',
    orderHint:
      'Gostou? Faça captura e contacte-nos (Item / título: {{title}})',
    syncFullHint:
      'Só capa em cache. Execute npm run sync:full para todas as fotos.',
    backHome: 'Voltar ao início',
  },
  common: {
    photos: '{{count}} fotos',
    albumsTotal: '{{count}} álbuns',
    noAlbums: 'Nenhum álbum correspondente',
    loading: 'A carregar…',
    loadFailed: 'Falha ao carregar',
    syncHint: 'No projeto: npm install && npm run sync',
    needSync: 'Sincronize os produtos primeiro',
    breadcrumbHome: 'Início',
    breadcrumbSearch: 'Pesquisar',
  },
  pagination: { prev: 'Anterior', next: 'Seguinte' },
  contact: { region: 'Contacto' },
  wechatCopied: 'WeChat copiado: {{id}}',
};

const fr = {
  notice:
    "Capture l'Item ID ou le titre de l'album, puis contactez-nous pour un devis.",
  nav: {
    home: 'Accueil',
    albums: 'Albums',
    contact: 'Contact',
    allCategories: 'Toutes les catégories',
    searchPlaceholder: 'Rechercher albums / Item ID',
    search: 'Rechercher',
  },
  home: { title: 'Accueil' },
  albums: { title: 'Tous les albums' },
  search: {
    title: 'Rechercher',
    titleQuery: 'Rechercher : « {{q}} »',
    hint: 'Saisissez référence, Item ID ou mots-clés ci-dessus.',
    results: '{{count}} résultats',
  },
  category: {
    searchPlaceholder: 'Rechercher dans cette catégorie…',
    count: '{{count}} articles',
    notFound: 'Catégorie introuvable',
  },
  album: {
    notFound: 'Album introuvable',
    orderHint:
      'Vous aimez ? Capturez et contactez-nous (Item / titre : {{title}})',
    syncFullHint:
      'Seule la couverture est en cache. Lancez npm run sync:full pour toutes les photos.',
    backHome: "Retour à l'accueil",
  },
  common: {
    photos: '{{count}} photos',
    albumsTotal: '{{count}} albums',
    noAlbums: 'Aucun album correspondant',
    loading: 'Chargement…',
    loadFailed: 'Échec du chargement',
    syncHint: 'Dans le projet : npm install && npm run sync',
    needSync: "Synchronisez d'abord les produits",
    breadcrumbHome: 'Accueil',
    breadcrumbSearch: 'Rechercher',
  },
  pagination: { prev: 'Précédent', next: 'Suivant' },
  contact: { region: 'Contact' },
  wechatCopied: 'WeChat copié : {{id}}',
};

const de = {
  notice:
    'Screenshot von Item ID oder Albumtitel, dann kontaktieren Sie uns für Preis und Bestellung.',
  nav: {
    home: 'Start',
    albums: 'Alben',
    contact: 'Kontakt',
    allCategories: 'Alle Kategorien',
    searchPlaceholder: 'Alben / Item ID suchen',
    search: 'Suchen',
  },
  home: { title: 'Start' },
  albums: { title: 'Alle Alben' },
  search: {
    title: 'Suchen',
    titleQuery: 'Suchen: „{{q}}“',
    hint: 'Artikelnummer, Item ID oder Stichwörter oben eingeben.',
    results: '{{count}} Treffer',
  },
  category: {
    searchPlaceholder: 'In dieser Kategorie suchen…',
    count: '{{count}} Artikel',
    notFound: 'Kategorie nicht gefunden',
  },
  album: {
    notFound: 'Album nicht gefunden',
    orderHint:
      'Gefällt Ihnen? Screenshot senden (Item / Titel: {{title}})',
    syncFullHint:
      'Nur Cover zwischengespeichert. npm run sync:full für alle Fotos.',
    backHome: 'Zur Startseite',
  },
  common: {
    photos: '{{count}} Fotos',
    albumsTotal: '{{count}} Alben',
    noAlbums: 'Keine passenden Alben',
    loading: 'Wird geladen…',
    loadFailed: 'Laden fehlgeschlagen',
    syncHint: 'Im Projekt: npm install && npm run sync',
    needSync: 'Produkte zuerst synchronisieren',
    breadcrumbHome: 'Start',
    breadcrumbSearch: 'Suchen',
  },
  pagination: { prev: 'Zurück', next: 'Weiter' },
  contact: { region: 'Kontakt' },
  wechatCopied: 'WeChat kopiert: {{id}}',
};

const ru = {
  notice:
    'Сделайте скриншот Item ID или названия альбома и свяжитесь с нами для заказа.',
  nav: {
    home: 'Главная',
    albums: 'Альбомы',
    contact: 'Контакты',
    allCategories: 'Все категории',
    searchPlaceholder: 'Поиск альбомов / Item ID',
    search: 'Поиск',
  },
  home: { title: 'Главная' },
  albums: { title: 'Все альбомы' },
  search: {
    title: 'Поиск',
    titleQuery: 'Поиск: «{{q}}»',
    hint: 'Введите артикул, Item ID или ключевые слова выше.',
    results: '{{count}} результатов',
  },
  category: {
    searchPlaceholder: 'Поиск в категории…',
    count: '{{count}} товаров',
    notFound: 'Категория не найдена',
  },
  album: {
    notFound: 'Альбом не найден',
    orderHint:
      'Понравилось? Скриншот и напишите нам (Item / название: {{title}})',
    syncFullHint:
      'В кэше только обложка. Запустите npm run sync:full для всех фото.',
    backHome: 'На главную',
  },
  common: {
    photos: '{{count}} фото',
    albumsTotal: '{{count}} альбомов',
    noAlbums: 'Нет подходящих альбомов',
    loading: 'Загрузка…',
    loadFailed: 'Ошибка загрузки',
    syncHint: 'В проекте: npm install && npm run sync',
    needSync: 'Сначала синхронизируйте товары',
    breadcrumbHome: 'Главная',
    breadcrumbSearch: 'Поиск',
  },
  pagination: { prev: 'Назад', next: 'Далее' },
  contact: { region: 'Связаться с нами' },
  wechatCopied: 'WeChat скопирован: {{id}}',
};

export const messages = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  es,
  pt,
  fr,
  de,
  ru,
};

export function resolveMessage(dict, key) {
  return key.split('.').reduce((o, k) => (o == null ? o : o[k]), dict);
}

export function formatMessage(template, vars = {}) {
  if (!template) return '';
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) =>
    vars[name] != null ? String(vars[name]) : ''
  );
}
