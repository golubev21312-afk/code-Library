import type { Snippet } from '@/types'

export const accessibility: Snippet[] = [
  {
    id: 'html-aria-landmarks',
    title: 'ARIA Landmarks',
    description: 'Определение областей страницы для навигации',
    code: `<!-- Семантические элементы = встроенные landmarks -->
<header>     <!-- role="banner" -->
<nav>        <!-- role="navigation" -->
<main>       <!-- role="main" -->
<aside>      <!-- role="complementary" -->
<footer>     <!-- role="contentinfo" -->
<form>       <!-- role="form" (если есть aria-label) -->
<section>    <!-- role="region" (если есть aria-label) -->

<!-- Явные ARIA roles когда нужно -->
<div role="search">
  <input type="search" aria-label="Поиск по сайту">
</div>

<!-- Множественные навигации -->
<nav aria-label="Основная навигация">...</nav>
<nav aria-label="Хлебные крошки">...</nav>
<nav aria-label="Социальные сети">...</nav>

<!-- Множественные регионы -->
<section aria-labelledby="news-title">
  <h2 id="news-title">Новости</h2>
  ...
</section>

<section aria-labelledby="events-title">
  <h2 id="events-title">События</h2>
  ...
</section>

<!-- Skip link для клавиатурной навигации -->
<a href="#main-content" class="skip-link">
  Перейти к основному контенту
</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: #000;
  color: #fff;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
</style>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'a11y', 'aria', 'landmarks'],
    whyRelevant2026: 'Landmarks позволяют пользователям screen readers быстро навигировать',
    related: ['html-aria-live', 'html-document-structure']
  },
  {
    id: 'html-aria-live',
    title: 'ARIA Live Regions',
    description: 'Уведомления для screen readers',
    code: `<!-- Вежливое объявление (не прерывает) -->
<div aria-live="polite" aria-atomic="true">
  <!-- Контент здесь будет зачитан после текущего -->
</div>

<!-- Срочное объявление (прерывает) -->
<div aria-live="assertive" role="alert">
  Критическая ошибка! Данные не сохранены.
</div>

<!-- Статус операции -->
<div role="status" aria-live="polite">
  Загружено 5 из 10 элементов
</div>

<!-- Лог событий (читает только добавленное) -->
<div role="log" aria-live="polite" aria-relevant="additions">
  <p>10:00 - Пользователь вошёл</p>
  <p>10:05 - Новое сообщение</p>
</div>

<!-- Таймер -->
<div role="timer" aria-live="off" aria-atomic="true">
  05:30
</div>

<!-- Прогресс -->
<div
  role="progressbar"
  aria-valuenow="75"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Загрузка файла"
>
  75%
</div>

<!-- Практический пример: уведомления -->
<script>
function announce(message, priority = 'polite') {
  const region = document.getElementById('announcer');
  region.setAttribute('aria-live', priority);
  region.textContent = message;

  // Очищаем для следующего объявления
  setTimeout(() => region.textContent = '', 1000);
}

announce('Товар добавлен в корзину');
announce('Ошибка валидации!', 'assertive');
</script>

<div id="announcer" class="sr-only" aria-live="polite"></div>`,
    language: 'html',
    level: 'advanced',
    tags: ['html', 'a11y', 'aria', 'live-regions'],
    whyRelevant2026: 'Live regions критичны для SPA и динамического контента',
    related: ['html-aria-landmarks', 'html-form-errors']
  },
  {
    id: 'html-keyboard-navigation',
    title: 'Клавиатурная навигация',
    description: 'Управление фокусом и tabindex',
    code: `<!-- Естественный порядок табуляции (0) -->
<button>Первый</button>
<button>Второй</button>
<button>Третий</button>

<!-- Исключение из табуляции (-1) -->
<div tabindex="-1" id="modal">
  <!-- Можно сфокусировать через JS, но не Tab -->
</div>

<!-- Кастомный интерактивный элемент -->
<div
  role="button"
  tabindex="0"
  onclick="handleClick()"
  onkeydown="handleKeydown(event)"
>
  Кастомная кнопка
</div>

<script>
function handleKeydown(e) {
  // Активация по Enter и Space
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
}
</script>

<!-- Focus trap для модалок -->
<script>
function trapFocus(element) {
  const focusables = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  first.focus();
}
</script>

<!-- Roving tabindex для виджетов -->
<div role="tablist">
  <button role="tab" tabindex="0" aria-selected="true">Tab 1</button>
  <button role="tab" tabindex="-1">Tab 2</button>
  <button role="tab" tabindex="-1">Tab 3</button>
</div>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'a11y', 'keyboard', 'focus'],
    whyRelevant2026: 'Клавиатурная навигация обязательна для доступности',
    related: ['html-aria-landmarks', 'html-focus-visible']
  },
  {
    id: 'html-focus-visible',
    title: 'Focus Management',
    description: 'Управление видимостью фокуса',
    code: `<style>
/* Убираем outline только для мыши */
:focus:not(:focus-visible) {
  outline: none;
}

/* Стиль для клавиатурного фокуса */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Кастомный focus ring */
button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

/* Focus within для контейнеров */
.input-group:focus-within {
  border-color: var(--color-primary);
}

.input-group:focus-within label {
  color: var(--color-primary);
}

/* Скрытие фокуса внутри, показ на контейнере */
.card:has(:focus-visible) {
  outline: 2px solid var(--color-primary);
}

.card :focus-visible {
  outline: none;
}
</style>

<!-- Пример input с focus-within -->
<div class="input-group">
  <label for="email">Email</label>
  <input type="email" id="email">
</div>

<!-- Inert для отключения взаимодействия -->
<div inert>
  <!-- Всё внутри не фокусируется и не кликается -->
  <button>Недоступна</button>
  <a href="#">Недоступна</a>
</div>

<!-- Программное управление фокусом -->
<script>
// После динамического добавления контента
function onContentLoaded() {
  const newSection = document.getElementById('new-content');
  newSection.setAttribute('tabindex', '-1');
  newSection.focus();
}

// Возврат фокуса после закрытия модалки
let previouslyFocused;

function openModal() {
  previouslyFocused = document.activeElement;
  modal.showModal();
}

function closeModal() {
  modal.close();
  previouslyFocused?.focus();
}
</script>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'a11y', 'focus', 'css'],
    whyRelevant2026: ':focus-visible - стандарт для визуального фокуса',
    related: ['html-keyboard-navigation', 'css-focus-visible']
  },
  {
    id: 'html-form-errors',
    title: 'Доступные ошибки форм',
    description: 'Связывание ошибок с полями',
    code: `<!-- Поле с ошибкой -->
<div class="field" data-error>
  <label for="email">Email</label>
  <input
    type="email"
    id="email"
    aria-invalid="true"
    aria-describedby="email-error email-hint"
  >
  <span id="email-hint" class="hint">
    Введите рабочий email
  </span>
  <span id="email-error" class="error" role="alert">
    Некорректный формат email
  </span>
</div>

<!-- Группа с общей ошибкой -->
<fieldset aria-describedby="payment-error">
  <legend>Способ оплаты</legend>

  <label>
    <input type="radio" name="payment" value="card">
    Карта
  </label>
  <label>
    <input type="radio" name="payment" value="cash">
    Наличные
  </label>

  <span id="payment-error" class="error" role="alert">
    Выберите способ оплаты
  </span>
</fieldset>

<!-- Сводка ошибок -->
<div role="alert" aria-labelledby="errors-title" class="error-summary">
  <h2 id="errors-title">Исправьте ошибки:</h2>
  <ul>
    <li><a href="#email">Email: некорректный формат</a></li>
    <li><a href="#phone">Телефон: обязательное поле</a></li>
  </ul>
</div>

<script>
// При валидации фокус на первое поле с ошибкой
function validateForm(form) {
  const firstError = form.querySelector('[aria-invalid="true"]');
  if (firstError) {
    firstError.focus();
    return false;
  }
  return true;
}

// Динамическое добавление ошибки
function setError(input, message) {
  input.setAttribute('aria-invalid', 'true');
  const errorId = input.id + '-error';
  document.getElementById(errorId).textContent = message;
}

// Очистка ошибки
function clearError(input) {
  input.removeAttribute('aria-invalid');
  const errorId = input.id + '-error';
  document.getElementById(errorId).textContent = '';
}
</script>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'a11y', 'forms', 'validation'],
    whyRelevant2026: 'aria-describedby связывает сообщения с полями для screen readers',
    related: ['html-forms-semantic', 'html-aria-live']
  },
  {
    id: 'html-images-a11y',
    title: 'Доступные изображения',
    description: 'Alt текст и декоративные изображения',
    code: `<!-- Информативное изображение -->
<img
  src="chart.png"
  alt="График показывает рост продаж на 25% за 2025 год"
>

<!-- Функциональное изображение (ссылка/кнопка) -->
<a href="/home">
  <img src="logo.svg" alt="На главную">
</a>

<button>
  <img src="search.svg" alt="Поиск">
</button>

<!-- Декоративное изображение -->
<img src="decorative-line.svg" alt="" role="presentation">

<!-- Или через CSS -->
<div class="hero" style="background-image: url(bg.jpg)"></div>

<!-- Сложное изображение с описанием -->
<figure>
  <img
    src="infographic.png"
    alt="Инфографика процесса разработки"
    aria-describedby="infographic-desc"
  >
  <figcaption id="infographic-desc">
    Процесс включает 5 этапов: планирование, дизайн,
    разработка, тестирование и деплой. Каждый этап
    занимает в среднем 2 недели.
  </figcaption>
</figure>

<!-- SVG с доступностью -->
<svg role="img" aria-labelledby="svg-title svg-desc">
  <title id="svg-title">Иконка настроек</title>
  <desc id="svg-desc">Шестерёнка для открытия настроек</desc>
  <path d="..."/>
</svg>

<!-- Иконка без текста -->
<button aria-label="Закрыть">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Группа изображений -->
<figure role="group" aria-labelledby="gallery-title">
  <figcaption id="gallery-title">Фото с конференции 2025</figcaption>
  <img src="photo1.jpg" alt="Спикер на сцене">
  <img src="photo2.jpg" alt="Аудитория">
  <img src="photo3.jpg" alt="Нетворкинг">
</figure>`,
    language: 'html',
    level: 'beginner',
    tags: ['html', 'a11y', 'images', 'alt'],
    whyRelevant2026: 'Правильный alt текст критичен для SEO и доступности',
    related: ['html-media-elements', 'html-svg-a11y']
  },
  {
    id: 'html-buttons-links',
    title: 'Кнопки vs Ссылки',
    description: 'Правильный выбор между button и a',
    code: `<!-- КНОПКА: действие на странице -->
<button type="button" onclick="openModal()">
  Открыть модалку
</button>

<button type="submit">Отправить форму</button>

<button type="button" onclick="deleteItem()">
  Удалить
</button>

<!-- ССЫЛКА: навигация -->
<a href="/about">О компании</a>
<a href="/products/123">Страница товара</a>
<a href="#section">К разделу</a>

<!-- ОШИБКИ (не делайте так!) -->
<!-- ❌ Ссылка без href -->
<a onclick="doSomething()">Клик</a>

<!-- ❌ Кнопка для навигации -->
<button onclick="location.href='/about'">О нас</button>

<!-- ❌ Div как кнопка без роли -->
<div onclick="submit()">Отправить</div>

<!-- Если нужна кнопка-ссылка визуально -->
<a href="/signup" class="button">
  Регистрация
</a>

<!-- Кнопка открывающая ссылку в новом окне -->
<a href="/external" target="_blank" rel="noopener noreferrer">
  Внешний сайт
  <span class="sr-only">(открывается в новом окне)</span>
</a>

<!-- Disabled состояния -->
<button disabled>Недоступно</button>

<!-- Для ссылки нет disabled, используем aria -->
<a href="/page" aria-disabled="true" tabindex="-1">
  Недоступная ссылка
</a>

<!-- Кнопка с иконкой -->
<button type="button" aria-label="Добавить в избранное">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Кнопка с иконкой и текстом -->
<button type="button">
  <svg aria-hidden="true">...</svg>
  <span>Избранное</span>
</button>`,
    language: 'html',
    level: 'beginner',
    tags: ['html', 'a11y', 'buttons', 'links', 'semantic'],
    whyRelevant2026: 'Правильная семантика - основа доступности',
    related: ['html-keyboard-navigation', 'html-aria-landmarks']
  },
  {
    id: 'html-headings-structure',
    title: 'Структура заголовков',
    description: 'Иерархия заголовков для навигации',
    code: `<!-- Правильная иерархия -->
<h1>Заголовок страницы</h1>

<section>
  <h2>Основной раздел</h2>
  <p>Контент...</p>

  <section>
    <h3>Подраздел</h3>
    <p>Контент...</p>

    <h4>Ещё глубже</h4>
    <p>Контент...</p>
  </section>

  <section>
    <h3>Другой подраздел</h3>
  </section>
</section>

<section>
  <h2>Второй основной раздел</h2>
</section>

<!-- ❌ ОШИБКИ -->
<!-- Пропуск уровней -->
<h1>Заголовок</h1>
<h3>Сразу третий уровень</h3>

<!-- Несколько h1 -->
<h1>Первый h1</h1>
<h1>Второй h1</h1>

<!-- Заголовок для стиля -->
<h3>Мелкий текст (должен быть p с классом)</h3>

<!-- ✅ Визуально мелкий, но семантически правильный -->
<h2 class="text-sm">Визуально мелкий h2</h2>

<!-- Скрытый заголовок для структуры -->
<section aria-labelledby="hidden-title">
  <h2 id="hidden-title" class="sr-only">
    Навигация по сайту
  </h2>
  <nav>...</nav>
</section>

<style>
/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>`,
    language: 'html',
    level: 'beginner',
    tags: ['html', 'a11y', 'headings', 'structure'],
    whyRelevant2026: 'Screen readers используют заголовки для навигации',
    related: ['html-document-structure', 'html-aria-landmarks']
  },
  {
    id: 'html-color-contrast',
    title: 'Цветовой контраст',
    description: 'Обеспечение читаемости текста',
    code: `<!-- Минимальные требования WCAG 2.1 -->
<!-- AA: 4.5:1 для обычного текста, 3:1 для крупного -->
<!-- AAA: 7:1 для обычного текста, 4.5:1 для крупного -->

<style>
/* ✅ Хороший контраст */
.good {
  color: #1a1a1a;        /* Тёмный текст */
  background: #ffffff;   /* Светлый фон */
  /* Контраст: 16.1:1 */
}

/* ✅ Для тёмной темы */
.dark-good {
  color: #f5f5f5;
  background: #1a1a1a;
  /* Контраст: 15.3:1 */
}

/* ❌ Плохой контраст */
.bad {
  color: #999999;
  background: #ffffff;
  /* Контраст: 2.8:1 - не проходит */
}

/* Не полагаться только на цвет */
.error-field {
  border-color: red;
  /* Добавляем иконку или текст */
}

.error-field::after {
  content: '⚠ Ошибка';
}

/* Фокус должен быть виден */
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
  /* Контраст outline к фону минимум 3:1 */
}

/* Ссылки отличаются не только цветом */
a {
  color: #0066cc;
  text-decoration: underline;
}

/* Disabled состояние */
button:disabled {
  color: #767676;  /* Минимум 4.5:1 к фону */
  background: #e5e5e5;
  cursor: not-allowed;
}
</style>

<!-- Индикация ошибки не только цветом -->
<div class="field error">
  <label for="email">
    Email
    <span class="error-icon" aria-hidden="true">⚠</span>
  </label>
  <input id="email" aria-invalid="true">
  <span class="error-text">Введите корректный email</span>
</div>

<!-- Графики и диаграммы -->
<svg role="img" aria-label="График продаж">
  <!-- Используйте паттерны, не только цвета -->
  <pattern id="stripes">...</pattern>
  <rect fill="url(#stripes)"/>
</svg>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'a11y', 'color', 'contrast', 'wcag'],
    whyRelevant2026: 'WCAG 2.2 требует контраст для всех интерактивных элементов',
    related: ['css-dark-mode', 'html-focus-visible']
  },
  {
    id: 'html-screen-reader-text',
    title: 'Текст для screen readers',
    description: 'Скрытый текст и дополнительный контекст',
    code: `<style>
/* Visually hidden но доступен для screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Скрыть от всех включая screen readers */
.hidden {
  display: none;
}

/* Или */
[hidden] {
  display: none;
}
</style>

<!-- Дополнительный контекст для ссылок -->
<a href="/article">
  Читать далее
  <span class="sr-only">о новых возможностях React 19</span>
</a>

<!-- Иконки с описанием -->
<button>
  <svg aria-hidden="true">...</svg>
  <span class="sr-only">Удалить товар</span>
</button>

<!-- Таблица с контекстом -->
<table>
  <tr>
    <td>iPhone 15</td>
    <td>
      <button>
        <span class="sr-only">Добавить iPhone 15 в </span>
        корзину
      </button>
    </td>
  </tr>
</table>

<!-- Пагинация -->
<nav aria-label="Пагинация">
  <a href="?page=1">
    <span aria-hidden="true">←</span>
    <span class="sr-only">Предыдущая страница</span>
  </a>
  <a href="?page=2" aria-current="page">
    <span class="sr-only">Страница </span>2
  </a>
</nav>

<!-- aria-label vs sr-only -->
<!-- aria-label заменяет контент -->
<button aria-label="Закрыть диалог">×</button>

<!-- sr-only дополняет контент -->
<button>
  ×
  <span class="sr-only"> - закрыть диалог</span>
</button>

<!-- Статусы и badges -->
<span class="badge badge-new">
  New
  <span class="sr-only">товар</span>
</span>`,
    language: 'html',
    level: 'intermediate',
    tags: ['html', 'a11y', 'screen-reader', 'sr-only'],
    whyRelevant2026: 'Контекст для screen readers улучшает понимание интерфейса',
    related: ['html-aria-live', 'html-buttons-links']
  }
]

export default accessibility
