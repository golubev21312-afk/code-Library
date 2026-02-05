import type { Snippet } from '@/types'

export const selectors: Snippet[] = [
  {
    id: 'css-has-selector',
    title: ':has() - Parent Selector',
    description: 'Выбор родительского элемента на основе дочерних',
    code: `/* Стилизация родителя если есть определённый дочерний элемент */
.card:has(img) {
  padding: 0;
}

/* Форма с ошибкой */
.form-group:has(.input:invalid) {
  border-color: red;
}

/* Контейнер с пустым списком */
.container:has(ul:empty) {
  display: none;
}

/* Комбинация с :not() */
.card:has(img):not(:has(.badge)) {
  border-radius: 12px;
}

/* Выбор предыдущего сиблинга (через родителя) */
.list:has(li:hover) li:not(:hover) {
  opacity: 0.5;
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['css', 'selectors', 'has', 'parent-selector'],
    whyRelevant2026: ':has() полностью поддерживается во всех браузерах и революционно меняет возможности CSS',
    related: ['css-is-where', 'css-not-selector']
  },
  {
    id: 'css-is-where',
    title: ':is() и :where() селекторы',
    description: 'Упрощение сложных селекторов и управление специфичностью',
    code: `/* :is() - берёт специфичность самого специфичного аргумента */
:is(h1, h2, h3, h4, h5, h6):hover {
  color: blue;
}

/* Вложенные :is() */
:is(article, section) :is(h1, h2, h3) {
  margin-top: 1.5em;
}

/* :where() - всегда нулевая специфичность */
:where(h1, h2, h3) {
  font-weight: bold;
}

/* Полезно для сброса стилей библиотек */
:where(.btn, .button, [role="button"]) {
  cursor: pointer;
}

/* Комбинация для легкого переопределения */
:where(.card) :is(h1, h2, h3) {
  color: inherit;
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['css', 'selectors', 'is', 'where', 'specificity'],
    whyRelevant2026: ':is() и :where() существенно упрощают написание и поддержку CSS',
    related: ['css-has-selector', 'css-not-selector']
  },
  {
    id: 'css-not-selector',
    title: ':not() расширенный селектор',
    description: 'Исключение элементов с поддержкой списка селекторов',
    code: `/* Исключение нескольких классов */
.btn:not(.btn-primary, .btn-secondary) {
  background: gray;
}

/* Все интерактивные элементы кроме disabled */
:not(:disabled):is(button, input, select):focus {
  outline: 2px solid blue;
}

/* Все дети кроме первого и последнего */
li:not(:first-child, :last-child) {
  border-top: 1px solid #eee;
}

/* Комбинация с атрибутами */
a:not([href^="http"], [href^="//"]) {
  color: inherit;
}

/* Исключение по содержимому (с :has) */
.card:not(:has(img)) {
  min-height: 200px;
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['css', 'selectors', 'not', 'exclusion'],
    whyRelevant2026: 'Расширенный :not() с поддержкой списка селекторов теперь стандарт',
    related: ['css-has-selector', 'css-is-where']
  },
  {
    id: 'css-nth-selectors',
    title: 'Продвинутые :nth-* селекторы',
    description: 'Сложные паттерны выбора элементов по позиции',
    code: `/* Каждый 3-й элемент начиная со 2-го */
li:nth-child(3n + 2) {
  background: #f0f0f0;
}

/* Первые 5 элементов */
li:nth-child(-n + 5) {
  font-weight: bold;
}

/* Последние 3 элемента */
li:nth-last-child(-n + 3) {
  color: red;
}

/* nth-child с селектором (of selector) */
li:nth-child(2 of .important) {
  border: 2px solid gold;
}

/* Чётные строки только среди видимых */
tr:nth-child(even of :not(.hidden)) {
  background: #fafafa;
}

/* nth-last-child с фильтром */
p:nth-last-child(1 of .highlight) {
  margin-bottom: 2em;
}`,
    language: 'css',
    level: 'advanced',
    tags: ['css', 'selectors', 'nth-child', 'patterns'],
    whyRelevant2026: 'Синтаксис "of S" в :nth-child() даёт мощные возможности выборки',
    related: ['css-is-where', 'css-not-selector']
  },
  {
    id: 'css-attribute-selectors',
    title: 'Селекторы атрибутов',
    description: 'Выбор элементов по атрибутам и их значениям',
    code: `/* Точное значение */
[data-theme="dark"] {
  background: #1a1a1a;
}

/* Начинается с (префикс) */
[class^="btn-"] {
  padding: 0.5rem 1rem;
}

/* Заканчивается на (суффикс) */
[href$=".pdf"]::after {
  content: " (PDF)";
}

/* Содержит подстроку */
[class*="grid"] {
  display: grid;
}

/* Содержит слово (разделённое пробелами) */
[class~="active"] {
  font-weight: bold;
}

/* Начинается с или равно (для lang) */
[lang|="en"] {
  quotes: '"' '"';
}

/* Регистронезависимый поиск */
[href*="example" i] {
  color: blue;
}

/* Регистрозависимый (явно) */
[data-id="ABC" s] {
  text-transform: uppercase;
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['css', 'selectors', 'attributes'],
    whyRelevant2026: 'Селекторы атрибутов незаменимы для стилизации компонентов',
    related: ['css-data-attributes', 'css-has-selector']
  },
  {
    id: 'css-logical-selectors',
    title: 'Логические комбинации селекторов',
    description: 'Создание сложных условий выборки элементов',
    code: `/* Элемент с несколькими условиями (AND) */
input[type="text"]:focus:valid {
  border-color: green;
}

/* Элемент с любым из условий (OR через :is) */
:is(.error, .warning, .info) {
  padding: 1rem;
  border-radius: 4px;
}

/* NOT + AND */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

/* Сложная логика с :has и :is */
.form:has(:is(input, textarea):invalid):not(:has(.error-message)) {
  border: 1px solid orange;
}

/* Только если единственный ребёнок */
p:only-child {
  font-size: 1.2em;
}

/* Только если единственный своего типа */
img:only-of-type {
  width: 100%;
}`,
    language: 'css',
    level: 'advanced',
    tags: ['css', 'selectors', 'logic', 'combinations'],
    whyRelevant2026: 'Комбинации селекторов позволяют описывать сложную логику без JS',
    related: ['css-has-selector', 'css-is-where', 'css-not-selector']
  },
  {
    id: 'css-state-selectors',
    title: 'Селекторы состояний',
    description: 'Стилизация на основе состояния элементов',
    code: `/* Состояния форм */
input:valid { border-color: green; }
input:invalid { border-color: red; }
input:placeholder-shown { font-style: italic; }
input:user-invalid { background: #ffe0e0; }

/* Интерактивные состояния */
button:hover:not(:disabled) { background: #0056b3; }
button:active { transform: scale(0.98); }
button:focus-visible { outline: 2px solid blue; }

/* Состояния ссылок */
a:link { color: blue; }
a:visited { color: purple; }
a:any-link { text-decoration: underline; }
a:local-link { font-weight: bold; }

/* Чекбоксы и радио */
input:checked + label { font-weight: bold; }
input:indeterminate + label { opacity: 0.7; }

/* Состояния элементов */
details:open summary { font-weight: bold; }
dialog:modal { backdrop-filter: blur(4px); }
:fullscreen { background: black; }`,
    language: 'css',
    level: 'intermediate',
    tags: ['css', 'selectors', 'states', 'pseudo-classes'],
    whyRelevant2026: 'Новые псевдоклассы как :user-invalid улучшают UX форм',
    related: ['css-form-validation', 'css-focus-visible']
  },
  {
    id: 'css-structural-selectors',
    title: 'Структурные селекторы',
    description: 'Выбор элементов по структуре DOM',
    code: `/* Пустой элемент */
.container:empty {
  display: none;
}

/* Элемент с содержимым (через :not(:empty)) */
.badge:not(:empty) {
  padding: 0.25rem 0.5rem;
}

/* Корневой элемент */
:root {
  --primary: #007bff;
}

/* Первый/последний элемент типа */
p:first-of-type { margin-top: 0; }
p:last-of-type { margin-bottom: 0; }

/* Цель якоря */
:target {
  animation: highlight 1s ease;
}

/* Область видимости (Shadow DOM) */
:host {
  display: block;
}

:host(.dark) {
  --bg: #1a1a1a;
}

/* Слот в Shadow DOM */
::slotted(p) {
  margin: 0;
}`,
    language: 'css',
    level: 'advanced',
    tags: ['css', 'selectors', 'structural', 'shadow-dom'],
    whyRelevant2026: 'Web Components и Shadow DOM требуют знания :host и ::slotted',
    related: ['css-nth-selectors', 'css-web-components']
  },
  {
    id: 'css-content-selectors',
    title: 'Селекторы по содержимому',
    description: 'Выбор элементов на основе их содержимого',
    code: `/* Элемент без текста (пустой) */
p:empty {
  display: none;
}

/* Элемент с только пробелами (через :blank - пока не везде) */
/* Альтернатива: JavaScript или :has с проверкой */

/* Через :has проверяем наличие определённого контента */
article:has(> img:first-child) {
  /* Статья начинается с картинки */
  padding-top: 0;
}

article:has(pre code) {
  /* Статья содержит код */
  font-family: system-ui;
}

/* Элемент без определённого дочернего */
.card:not(:has(img)) {
  min-height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Список без элементов */
ul:not(:has(li)) {
  display: none;
}

/* Форма без обязательных полей */
form:not(:has([required])) .required-note {
  display: none;
}`,
    language: 'css',
    level: 'advanced',
    tags: ['css', 'selectors', 'content', 'has'],
    whyRelevant2026: ':has() открыл возможность стилизации на основе содержимого',
    related: ['css-has-selector', 'css-structural-selectors']
  },
  {
    id: 'css-lang-dir-selectors',
    title: 'Селекторы языка и направления',
    description: 'Стилизация для многоязычных интерфейсов',
    code: `/* По языку */
:lang(ru) {
  quotes: '«' '»';
}

:lang(en) {
  quotes: '"' '"';
}

/* Несколько языков */
:lang(ar, he, fa) {
  font-family: 'Noto Sans Arabic', sans-serif;
}

/* По направлению текста */
:dir(rtl) {
  text-align: right;
}

:dir(ltr) {
  text-align: left;
}

/* Логические свойства вместо физических */
.sidebar {
  margin-inline-start: 1rem; /* left в LTR, right в RTL */
  padding-inline-end: 2rem;
  border-inline-start: 3px solid blue;
}

/* Автоматическое направление иконок */
:dir(rtl) .icon-arrow {
  transform: scaleX(-1);
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['css', 'selectors', 'i18n', 'rtl', 'ltr'],
    whyRelevant2026: 'Глобальные приложения требуют правильной поддержки RTL/LTR',
    related: ['css-logical-properties', 'css-writing-modes']
  }
]

export default selectors
