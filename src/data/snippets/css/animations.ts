import type { Snippet } from '@/types'

export const animations: Snippet[] = [
  {
    id: 'css-view-transitions',
    title: 'View Transitions API',
    description: 'Плавные переходы между состояниями страницы',
    code: `/* Базовый переход */
::view-transition {
  /* Корневой элемент перехода */
}

::view-transition-old(root) {
  animation: fade-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}

/* Именованные переходы для элементов */
.card {
  view-transition-name: card;
}

::view-transition-old(card) {
  animation: scale-down 0.3s ease-out;
}

::view-transition-new(card) {
  animation: scale-up 0.3s ease-in;
}

/* Кастомные анимации */
@keyframes slide-from-right {
  from { transform: translateX(100%); }
}

@keyframes slide-to-left {
  to { transform: translateX(-100%); }
}

::view-transition-old(page) {
  animation: slide-to-left 0.4s ease-in-out;
}

::view-transition-new(page) {
  animation: slide-from-right 0.4s ease-in-out;
}`,
    language: 'css',
    level: 'advanced',
    tags: ['css', 'animations', 'view-transitions', 'spa'],
    whyRelevant2026: 'View Transitions API - стандарт для SPA-подобных переходов без JS-фреймворков',
    related: ['css-keyframes', 'css-scroll-animations']
  },
  {
    id: 'css-scroll-animations',
    title: 'Scroll-driven Animations',
    description: 'Анимации привязанные к прокрутке страницы',
    code: `/* Прогресс-бар при скролле */
.progress-bar {
  animation: grow-width linear;
  animation-timeline: scroll();
}

@keyframes grow-width {
  from { width: 0%; }
  to { width: 100%; }
}

/* Появление элементов при скролле */
.fade-in-section {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Параллакс эффект */
.parallax-bg {
  animation: parallax linear;
  animation-timeline: scroll();
}

@keyframes parallax {
  from { transform: translateY(0); }
  to { transform: translateY(-200px); }
}

/* Горизонтальный скролл галереи */
.gallery {
  animation: scroll-horizontal linear;
  animation-timeline: scroll(x);
}`,
    language: 'css',
    level: 'advanced',
    tags: ['css', 'animations', 'scroll', 'parallax'],
    whyRelevant2026: 'Scroll-driven Animations позволяют создавать эффекты без JS',
    related: ['css-view-transitions', 'css-keyframes']
  },
  {
    id: 'css-keyframes',
    title: '@keyframes и animation',
    description: 'Создание сложных CSS-анимаций',
    code: `/* Базовая анимация */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.bouncing {
  animation: bounce 0.6s ease-in-out infinite;
}

/* Несколько анимаций */
.complex {
  animation:
    fadeIn 0.3s ease-out,
    slideUp 0.4s ease-out 0.1s,
    pulse 2s ease-in-out 0.5s infinite;
}

/* Остановка на последнем кадре */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Анимация с шагами (спрайты) */
@keyframes walk {
  to { background-position: -600px 0; }
}

.sprite {
  animation: walk 0.6s steps(6) infinite;
}

/* Пауза при hover */
.card {
  animation: float 3s ease-in-out infinite;
}

.card:hover {
  animation-play-state: paused;
}

/* Обратное направление */
.reverse {
  animation: spin 1s linear infinite reverse;
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['css', 'animations', 'keyframes'],
    whyRelevant2026: '@keyframes остаётся основой CSS-анимаций',
    related: ['css-transitions', 'css-scroll-animations']
  },
  {
    id: 'css-transitions',
    title: 'CSS Transitions',
    description: 'Плавные переходы между состояниями',
    code: `/* Базовый переход */
.button {
  background: #007bff;
  transition: background 0.2s ease;
}

.button:hover {
  background: #0056b3;
}

/* Множественные свойства */
.card {
  transition:
    transform 0.3s ease-out,
    box-shadow 0.3s ease-out,
    opacity 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

/* Разные тайминги для enter/leave */
.dropdown {
  opacity: 0;
  transform: translateY(-10px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.dropdown.open {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* transition-behavior: allow-discrete */
.modal {
  display: none;
  opacity: 0;
  transition:
    opacity 0.3s,
    display 0.3s allow-discrete;
}

.modal.open {
  display: block;
  opacity: 1;
}`,
    language: 'css',
    level: 'beginner',
    tags: ['css', 'animations', 'transitions'],
    whyRelevant2026: 'transition-behavior: allow-discrete позволяет анимировать display',
    related: ['css-keyframes', 'css-cubic-bezier']
  },
  {
    id: 'css-cubic-bezier',
    title: 'Кастомные timing functions',
    description: 'Создание уникальных кривых анимации',
    code: `/* Стандартные функции */
.ease { transition-timing-function: ease; }
.ease-in { transition-timing-function: ease-in; }
.ease-out { transition-timing-function: ease-out; }
.ease-in-out { transition-timing-function: ease-in-out; }
.linear { transition-timing-function: linear; }

/* Кастомные cubic-bezier */
.bounce-out {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.smooth-out {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.elastic {
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Шаговые функции */
.typewriter {
  animation: typing 3s steps(20) forwards;
}

.clock-tick {
  animation: rotate 60s steps(60) infinite;
}

/* linear() для сложных кривых */
.spring {
  transition-timing-function: linear(
    0, 0.006, 0.025, 0.056, 0.1, 0.157, 0.225, 0.306,
    0.4, 0.506, 0.625, 0.756, 0.9, 1.056, 1.025,
    1.006, 1, 0.994, 1
  );
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['css', 'animations', 'easing', 'timing'],
    whyRelevant2026: 'Функция linear() позволяет создавать сложные spring-эффекты',
    related: ['css-transitions', 'css-keyframes']
  },
  {
    id: 'css-motion-path',
    title: 'Motion Path анимации',
    description: 'Движение элементов по произвольной траектории',
    code: `/* Движение по кругу */
.orbit {
  offset-path: circle(100px at center);
  animation: move 4s linear infinite;
}

@keyframes move {
  to { offset-distance: 100%; }
}

/* Движение по SVG пути */
.along-path {
  offset-path: path('M 0 100 Q 150 0 300 100 T 600 100');
  offset-rotate: auto;
  animation: follow-path 3s ease-in-out infinite alternate;
}

@keyframes follow-path {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}

/* Движение по линии */
.diagonal {
  offset-path: path('M 0 0 L 200 200');
  animation: slide 2s ease infinite;
}

/* Контроль поворота */
.car {
  offset-path: path('M 0 100 C 50 0, 150 0, 200 100');
  offset-rotate: auto 90deg; /* Дополнительный поворот */
}

/* Комбинация с offset-anchor */
.satellite {
  offset-path: circle(150px);
  offset-anchor: center center;
  offset-rotate: 0deg; /* Не вращается */
}`,
    language: 'css',
    level: 'advanced',
    tags: ['css', 'animations', 'motion-path', 'svg'],
    whyRelevant2026: 'Motion Path позволяет создавать сложные траектории без JS',
    related: ['css-keyframes', 'css-transforms']
  },
  {
    id: 'css-transforms',
    title: '3D Transforms',
    description: 'Трёхмерные трансформации элементов',
    code: `/* Настройка перспективы */
.scene {
  perspective: 1000px;
  perspective-origin: center center;
}

/* 3D карточка с переворотом */
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-3d:hover {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  backface-visibility: hidden;
  position: absolute;
  inset: 0;
}

.card-back {
  transform: rotateY(180deg);
}

/* 3D куб */
.cube {
  transform-style: preserve-3d;
  animation: rotate-cube 10s linear infinite;
}

@keyframes rotate-cube {
  to { transform: rotateX(360deg) rotateY(360deg); }
}

/* Множественные трансформации */
.complex-3d {
  transform:
    perspective(1000px)
    translateZ(50px)
    rotateX(10deg)
    rotateY(-15deg)
    scale3d(1.1, 1.1, 1);
}`,
    language: 'css',
    level: 'advanced',
    tags: ['css', 'transforms', '3d', 'perspective'],
    whyRelevant2026: '3D-трансформации остаются мощным инструментом для визуальных эффектов',
    related: ['css-keyframes', 'css-motion-path']
  },
  {
    id: 'css-loading-spinners',
    title: 'CSS Loading анимации',
    description: 'Индикаторы загрузки на чистом CSS',
    code: `/* Spinning loader */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Dots loader */
.dots {
  display: flex;
  gap: 8px;
}

.dots span {
  width: 12px;
  height: 12px;
  background: #3498db;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dots span:nth-child(1) { animation-delay: -0.32s; }
.dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Skeleton loader */
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  to { background-position: -200% 0; }
}`,
    language: 'css',
    level: 'beginner',
    tags: ['css', 'animations', 'loading', 'ui'],
    whyRelevant2026: 'CSS-лоадеры остаются предпочтительнее JS-решений',
    related: ['css-keyframes', 'css-gradients']
  },
  {
    id: 'css-hover-effects',
    title: 'Hover эффекты',
    description: 'Интерактивные эффекты при наведении',
    code: `/* Underline анимация */
.link {
  position: relative;
}

.link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s ease;
}

.link:hover::after {
  width: 100%;
}

/* Gradient border */
.gradient-border {
  position: relative;
  background: white;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.gradient-border:hover::before {
  opacity: 1;
}

/* Shine effect */
.shine {
  position: relative;
  overflow: hidden;
}

.shine::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255,255,255,0.4),
    transparent
  );
  transform: translateX(-100%);
}

.shine:hover::after {
  animation: shine 0.6s ease-out;
}

@keyframes shine {
  to { transform: translateX(100%); }
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['css', 'animations', 'hover', 'effects'],
    whyRelevant2026: 'Микровзаимодействия улучшают UX любого интерфейса',
    related: ['css-transitions', 'css-pseudo-elements']
  },
  {
    id: 'css-reduced-motion',
    title: 'Accessibility и анимации',
    description: 'Учёт предпочтений пользователя по анимациям',
    code: `/* Отключение анимаций для prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Альтернативная анимация */
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .card:hover {
    transform: none;
    outline: 2px solid var(--primary);
  }
}

/* Проверка через CSS переменную */
:root {
  --animation-duration: 0.3s;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --animation-duration: 0s;
  }
}

.animated {
  transition-duration: var(--animation-duration);
}

/* Сохранение важных анимаций */
@media (prefers-reduced-motion: reduce) {
  /* Loader остаётся - он информативен */
  .spinner {
    animation-duration: 1s;
  }
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['css', 'animations', 'a11y', 'reduced-motion'],
    whyRelevant2026: 'Respect для prefers-reduced-motion - требование доступности',
    related: ['css-media-queries', 'css-transitions']
  }
]

export default animations
