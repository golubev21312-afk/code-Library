import type { Snippet } from '@/types'

export const semantic: Snippet[] = [
  {
    id: 'html-document-structure',
    title: 'Семантическая структура документа',
    description: 'Правильная структура HTML5 документа',
    code: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Описание страницы для SEO">
  <title>Заголовок страницы</title>
</head>
<body>
  <header>
    <nav aria-label="Основная навигация">
      <!-- Навигация -->
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h1>Заголовок статьи</h1>
        <time datetime="2026-01-15">15 января 2026</time>
      </header>

      <section>
        <h2>Раздел статьи</h2>
        <p>Контент раздела...</p>
      </section>

      <footer>
        <p>Автор: <address>Имя Автора</address></p>
      </footer>
    </article>

    <aside aria-label="Связанные статьи">
      <!-- Боковая панель -->
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 Компания</p>
  </footer>
</body>
</html>`,
    language: 'html',
    level: 'beginner',
    tags: ['html', 'semantic', 'structure', 'seo'],
    whyRelevant2026: 'Семантическая разметка критична для SEO и доступности',
    related: ['html-article-structure', 'html-nav-patterns']
  },
  {
    id: 'html-article-structure',
    title: 'Структура статьи',
    description: 'Семантическая разметка статьи или поста',
    code: `<article itemscope itemtype="https://schema.org/Article">
  <header>
    <h1 itemprop="headline">Заголовок статьи</h1>

    <div class="meta">
      <span itemprop="author" itemscope itemtype="https://schema.org/Person">
        Автор: <span itemprop="name">Иван Иванов</span>
      </span>

      <time itemprop="datePublished" datetime="2026-01-15">
        15 января 2026
      </time>

      <time itemprop="dateModified" datetime="2026-01-20">
        Обновлено: 20 января 2026
      </time>
    </div>
  </header>

  <figure>
    <img itemprop="image" src="/hero.jpg" alt="Описание изображения">
    <figcaption>Подпись к изображению</figcaption>
  </figure>

  <div itemprop="articleBody">
    <p>Вводный параграф...</p>

    <section>
      <h2>Подзаголовок</h2>
      <p>Контент секции...</p>
    </section>

    <blockquote cite="https://source.com">
      <p>Цитата из источника</p>
      <footer>— <cite>Источник</cite></footer>
    </blockquote>
  </div>

  <footer>
    <nav aria-label="Теги статьи">
      <ul>
        <li><a href="/tag/html" rel="tag">HTML</a></li>
        <li><a href="/tag/semantic" rel="tag">Semantic</a></li>
      </ul>
    </nav>
  </footer>
</article>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'semantic', 'article', 'schema'],
    whyRelevant2026: 'Schema.org разметка улучшает отображение в поисковиках',
    related: ['html-document-structure', 'html-microdata']
  },
  {
    id: 'html-nav-patterns',
    title: 'Паттерны навигации',
    description: 'Семантическая разметка навигации',
    code: `<!-- Основная навигация -->
<nav aria-label="Основная">
  <ul>
    <li><a href="/" aria-current="page">Главная</a></li>
    <li><a href="/about">О нас</a></li>
    <li>
      <a href="/services" aria-haspopup="true" aria-expanded="false">
        Услуги
      </a>
      <ul>
        <li><a href="/services/web">Веб-разработка</a></li>
        <li><a href="/services/mobile">Мобильные приложения</a></li>
      </ul>
    </li>
  </ul>
</nav>

<!-- Хлебные крошки -->
<nav aria-label="Хлебные крошки">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/"><span itemprop="name">Главная</span></a>
      <meta itemprop="position" content="1">
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/blog"><span itemprop="name">Блог</span></a>
      <meta itemprop="position" content="2">
    </li>
    <li aria-current="page">Текущая статья</li>
  </ol>
</nav>

<!-- Пагинация -->
<nav aria-label="Пагинация">
  <ul>
    <li><a href="?page=1" aria-label="Предыдущая страница">←</a></li>
    <li><a href="?page=1">1</a></li>
    <li><a href="?page=2" aria-current="page">2</a></li>
    <li><a href="?page=3">3</a></li>
    <li><a href="?page=3" aria-label="Следующая страница">→</a></li>
  </ul>
</nav>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'semantic', 'navigation', 'a11y'],
    whyRelevant2026: 'Правильная навигация - основа UX и доступности',
    related: ['html-document-structure', 'html-aria-landmarks']
  },
  {
    id: 'html-forms-semantic',
    title: 'Семантические формы',
    description: 'Правильная структура форм',
    code: `<form action="/submit" method="post" novalidate>
  <!-- Группировка полей -->
  <fieldset>
    <legend>Личные данные</legend>

    <div>
      <label for="name">Имя <span aria-hidden="true">*</span></label>
      <input
        type="text"
        id="name"
        name="name"
        required
        autocomplete="name"
        aria-required="true"
      >
    </div>

    <div>
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        autocomplete="email"
        aria-describedby="email-hint"
      >
      <small id="email-hint">Мы не будем делиться вашим email</small>
    </div>
  </fieldset>

  <fieldset>
    <legend>Предпочтения</legend>

    <!-- Радио группа -->
    <div role="radiogroup" aria-labelledby="contact-label">
      <span id="contact-label">Способ связи:</span>
      <label>
        <input type="radio" name="contact" value="email"> Email
      </label>
      <label>
        <input type="radio" name="contact" value="phone"> Телефон
      </label>
    </div>

    <!-- Чекбоксы -->
    <div>
      <label>
        <input type="checkbox" name="newsletter">
        Подписаться на рассылку
      </label>
    </div>
  </fieldset>

  <button type="submit">Отправить</button>
</form>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'semantic', 'forms', 'a11y'],
    whyRelevant2026: 'Семантические формы улучшают автозаполнение и доступность',
    related: ['html-input-types', 'html-form-validation']
  },
  {
    id: 'html-input-types',
    title: 'Типы input элементов',
    description: 'Все типы input для разных данных',
    code: `<!-- Текстовые поля -->
<input type="text" placeholder="Обычный текст">
<input type="email" placeholder="email@example.com">
<input type="url" placeholder="https://...">
<input type="tel" placeholder="+7 (999) 123-45-67">
<input type="search" placeholder="Поиск...">
<input type="password" autocomplete="current-password">

<!-- Числовые поля -->
<input type="number" min="0" max="100" step="1">
<input type="range" min="0" max="100" value="50">

<!-- Дата и время -->
<input type="date" min="2026-01-01">
<input type="time" step="60">
<input type="datetime-local">
<input type="month">
<input type="week">

<!-- Выбор -->
<input type="color" value="#ff0000">
<input type="file" accept="image/*,.pdf" multiple>

<!-- Скрытые и специальные -->
<input type="hidden" name="csrf" value="token">

<!-- Datalist для автодополнения -->
<input type="text" list="browsers">
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
</datalist>

<!-- Современные атрибуты -->
<input
  type="text"
  inputmode="numeric"      /* Цифровая клавиатура на мобильных */
  pattern="[0-9]*"         /* Валидация паттерном */
  enterkeyhint="search"    /* Текст на Enter на мобильных */
  autocomplete="one-time-code" /* Для SMS-кодов */
>`,
    language: 'html',
    level: 'beginner',
    tags: ['html', 'forms', 'input', 'validation'],
    whyRelevant2026: 'Правильные типы input улучшают UX особенно на мобильных',
    related: ['html-forms-semantic', 'html-form-validation']
  },
  {
    id: 'html-lists-semantic',
    title: 'Семантические списки',
    description: 'Правильное использование списков',
    code: `<!-- Неупорядоченный список -->
<ul>
  <li>Элемент без порядка</li>
  <li>Ещё элемент</li>
</ul>

<!-- Упорядоченный список -->
<ol>
  <li>Первый шаг</li>
  <li>Второй шаг</li>
</ol>

<!-- Нумерация с кастомным началом -->
<ol start="5" reversed>
  <li value="10">Кастомное значение</li>
  <li>Автоматическое (9)</li>
</ol>

<!-- Список определений -->
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>

  <!-- Несколько определений -->
  <dt>Abbreviation</dt>
  <dt>Abbr</dt>
  <dd>Сокращённая форма слова</dd>
</dl>

<!-- Меню действий -->
<menu>
  <li><button type="button">Копировать</button></li>
  <li><button type="button">Вставить</button></li>
  <li><button type="button">Удалить</button></li>
</menu>

<!-- Вложенные списки -->
<ul>
  <li>
    Категория 1
    <ul>
      <li>Подкатегория 1.1</li>
      <li>Подкатегория 1.2</li>
    </ul>
  </li>
</ul>`,
    language: 'html',
    level: 'beginner',
    tags: ['html', 'semantic', 'lists'],
    whyRelevant2026: 'Семантические списки важны для screen readers',
    related: ['html-nav-patterns', 'html-document-structure']
  },
  {
    id: 'html-media-elements',
    title: 'Медиа элементы',
    description: 'Изображения, видео и аудио',
    code: `<!-- Адаптивное изображение -->
<picture>
  <source
    media="(min-width: 1200px)"
    srcset="large.webp"
    type="image/webp"
  >
  <source
    media="(min-width: 800px)"
    srcset="medium.webp"
    type="image/webp"
  >
  <source srcset="small.webp" type="image/webp">
  <img
    src="fallback.jpg"
    alt="Описание изображения"
    loading="lazy"
    decoding="async"
    width="800"
    height="600"
  >
</picture>

<!-- Видео -->
<video
  controls
  preload="metadata"
  poster="poster.jpg"
  width="1280"
  height="720"
>
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
  <track
    kind="subtitles"
    src="subs-ru.vtt"
    srclang="ru"
    label="Русский"
    default
  >
  <track kind="captions" src="captions.vtt" srclang="ru">
  <p>Ваш браузер не поддерживает видео.</p>
</video>

<!-- Аудио -->
<audio controls preload="none">
  <source src="audio.opus" type="audio/opus">
  <source src="audio.mp3" type="audio/mpeg">
  <a href="audio.mp3">Скачать аудио</a>
</audio>

<!-- Figure для медиа с подписью -->
<figure>
  <img src="chart.png" alt="График продаж за 2025 год">
  <figcaption>Рис. 1: Динамика продаж</figcaption>
</figure>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'media', 'images', 'video', 'audio'],
    whyRelevant2026: 'WebP/AVIF и lazy loading - стандарт оптимизации',
    related: ['html-picture-srcset', 'html-performance']
  },
  {
    id: 'html-dialog-element',
    title: 'Dialog элемент',
    description: 'Нативные модальные окна',
    code: `<!-- Модальный диалог -->
<dialog id="modal">
  <form method="dialog">
    <header>
      <h2>Заголовок модалки</h2>
      <button type="submit" aria-label="Закрыть">×</button>
    </header>

    <main>
      <p>Контент модального окна</p>
    </main>

    <footer>
      <button type="submit" value="cancel">Отмена</button>
      <button type="submit" value="confirm">Подтвердить</button>
    </footer>
  </form>
</dialog>

<button onclick="modal.showModal()">Открыть модалку</button>

<script>
const modal = document.getElementById('modal');

// Открытие как модалка (с backdrop)
modal.showModal();

// Открытие как немодальный диалог
modal.show();

// Закрытие
modal.close('returnValue');

// События
modal.addEventListener('close', () => {
  console.log('Закрыто с:', modal.returnValue);
});

modal.addEventListener('cancel', (e) => {
  // Нажат Escape
  console.log('Отменено');
});

// Закрытие по клику на backdrop
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.close();
  }
});
</script>

<style>
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

dialog[open] {
  animation: fade-in 0.3s ease-out;
}
</style>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'dialog', 'modal', 'a11y'],
    whyRelevant2026: 'Нативный dialog заменяет кастомные модалки',
    related: ['html-popover', 'html-details-summary']
  },
  {
    id: 'html-popover',
    title: 'Popover API',
    description: 'Нативные поповеры без JavaScript',
    code: `<!-- Базовый popover -->
<button popovertarget="menu">Открыть меню</button>

<div id="menu" popover>
  <ul>
    <li><a href="#">Пункт 1</a></li>
    <li><a href="#">Пункт 2</a></li>
  </ul>
</div>

<!-- Popover с ручным управлением -->
<button popovertarget="tooltip" popovertargetaction="toggle">
  Hover me
</button>

<div id="tooltip" popover="manual">
  Это подсказка
</div>

<!-- Вложенные popovers -->
<button popovertarget="dropdown">Меню</button>

<div id="dropdown" popover>
  <button popovertarget="submenu">Подменю →</button>
  <div id="submenu" popover>
    <p>Вложенный контент</p>
  </div>
</div>

<!-- Стилизация -->
<style>
[popover] {
  /* Позиционирование */
  position: fixed;
  inset: unset;
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 0;

  /* Анимация появления */
  opacity: 0;
  transition: opacity 0.2s, display 0.2s allow-discrete;
}

[popover]:popover-open {
  opacity: 1;
}

/* Backdrop для popover */
[popover]::backdrop {
  background: transparent;
}
</style>

<script>
// JavaScript API
const popover = document.getElementById('menu');
popover.showPopover();
popover.hidePopover();
popover.togglePopover();
</script>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'popover', 'dropdown', 'tooltip'],
    whyRelevant2026: 'Popover API - нативная замена dropdown библиотекам',
    related: ['html-dialog-element', 'html-details-summary']
  },
  {
    id: 'html-details-summary',
    title: 'Details и Summary',
    description: 'Нативные аккордеоны и раскрывающиеся блоки',
    code: `<!-- Базовый аккордеон -->
<details>
  <summary>Нажми чтобы раскрыть</summary>
  <p>Скрытый контент появляется здесь.</p>
</details>

<!-- Открытый по умолчанию -->
<details open>
  <summary>Уже открыт</summary>
  <p>Контент виден сразу.</p>
</details>

<!-- Группа аккордеонов (эксклюзивные) -->
<details name="faq">
  <summary>Вопрос 1?</summary>
  <p>Ответ на вопрос 1.</p>
</details>

<details name="faq">
  <summary>Вопрос 2?</summary>
  <p>Ответ на вопрос 2.</p>
</details>

<!-- Кастомная стрелка -->
<style>
details > summary {
  list-style: none;
  cursor: pointer;
}

details > summary::before {
  content: '▶';
  display: inline-block;
  margin-right: 0.5em;
  transition: transform 0.2s;
}

details[open] > summary::before {
  transform: rotate(90deg);
}

/* Анимация контента */
details > *:not(summary) {
  animation: slide-down 0.3s ease-out;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>

<script>
// События
details.addEventListener('toggle', (e) => {
  console.log('Состояние:', e.target.open);
});
</script>`,
    language: 'html',
    level: 'beginner',
    tags: ['html', 'details', 'accordion', 'interactive'],
    whyRelevant2026: 'Атрибут name для эксклюзивных аккордеонов - новая фича',
    related: ['html-dialog-element', 'html-popover']
  },
  {
    id: 'html-tables-semantic',
    title: 'Семантические таблицы',
    description: 'Правильная структура таблиц данных',
    code: `<table>
  <caption>Продажи по регионам за 2025 год</caption>

  <colgroup>
    <col>
    <col span="4" class="data-columns">
  </colgroup>

  <thead>
    <tr>
      <th scope="col">Регион</th>
      <th scope="col">Q1</th>
      <th scope="col">Q2</th>
      <th scope="col">Q3</th>
      <th scope="col">Q4</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Москва</th>
      <td>1,200</td>
      <td>1,350</td>
      <td>1,100</td>
      <td>1,500</td>
    </tr>
    <tr>
      <th scope="row">СПб</th>
      <td>800</td>
      <td>900</td>
      <td>850</td>
      <td>950</td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <th scope="row">Итого</th>
      <td>2,000</td>
      <td>2,250</td>
      <td>1,950</td>
      <td>2,450</td>
    </tr>
  </tfoot>
</table>

<!-- Сложные заголовки -->
<table>
  <thead>
    <tr>
      <th rowspan="2">Товар</th>
      <th colspan="2">2024</th>
      <th colspan="2">2025</th>
    </tr>
    <tr>
      <th>Продажи</th>
      <th>Прибыль</th>
      <th>Продажи</th>
      <th>Прибыль</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Продукт A</th>
      <td>100</td>
      <td>20</td>
      <td>150</td>
      <td>35</td>
    </tr>
  </tbody>
</table>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'tables', 'semantic', 'data'],
    whyRelevant2026: 'Семантические таблицы критичны для screen readers',
    related: ['html-forms-semantic', 'html-aria-table']
  }
]

export default semantic
