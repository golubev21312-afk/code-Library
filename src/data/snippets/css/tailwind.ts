import type { Snippet } from '@/types'

export const tailwind: Snippet[] = [
  {
    id: 'tw-v4-config',
    title: 'Tailwind v4 CSS Config',
    description: 'Конфигурация Tailwind v4 через CSS',
    code: `/* tailwind.css */
@import "tailwindcss";

/* Кастомные цвета */
@theme inline {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-accent: #f59e0b;

  /* Расширение палитры */
  --color-brand-50: #eff6ff;
  --color-brand-500: #3b82f6;
  --color-brand-900: #1e3a8a;
}

/* Кастомные шрифты */
@theme inline {
  --font-display: "Cal Sans", sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
}

/* Кастомные брейкпоинты */
@theme inline {
  --breakpoint-xs: 475px;
  --breakpoint-3xl: 1920px;
}

/* Кастомные анимации */
@theme inline {
  --animate-fade-in: fade-in 0.3s ease-out;
  --animate-slide-up: slide-up 0.4s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['tailwind', 'css', 'config', 'v4'],
    whyRelevant2026: 'Tailwind v4 использует CSS-first конфигурацию вместо JS',
    related: ['tw-dark-mode', 'tw-custom-variants']
  },
  {
    id: 'tw-dark-mode',
    title: 'Dark Mode в Tailwind v4',
    description: 'Настройка тёмной темы через CSS',
    code: `/* Определение тёмной темы через вариант */
@custom-variant dark (&:is(.dark *));

/* CSS переменные для тем */
@theme inline {
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-card: #ffffff;
  --color-muted: #737373;
}

/* Тёмная тема */
.dark {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
  --color-card: #171717;
  --color-muted: #a3a3a3;
}

/* Использование */
<div class="bg-background text-foreground">
  <div class="dark:bg-card">
    <!-- Автоматически меняется в .dark -->
  </div>
</div>

/* Системные предпочтения */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --color-background: #0a0a0a;
    /* ... остальные переменные */
  }
}`,
    language: 'css',
    level: 'intermediate',
    tags: ['tailwind', 'css', 'dark-mode', 'themes'],
    whyRelevant2026: '@custom-variant - новый способ определения вариантов в Tailwind v4',
    related: ['tw-v4-config', 'tw-custom-variants']
  },
  {
    id: 'tw-custom-variants',
    title: 'Custom Variants',
    description: 'Создание кастомных вариантов в Tailwind',
    code: `/* Вариант для группы */
@custom-variant group-hover (&:is(:where(.group):hover *));

/* Вариант для состояния открыто */
@custom-variant open (&:is([open] *, [data-open] *));

/* Вариант для RTL */
@custom-variant rtl (&:is([dir="rtl"] *));

/* Вариант для принта */
@custom-variant print {
  @media print {
    &
  }
}

/* Использование */
<div class="group">
  <span class="group-hover:text-blue-500">
    Hover на родителя
  </span>
</div>

<details open>
  <summary>Toggle</summary>
  <div class="open:animate-fade-in">
    Контент
  </div>
</details>

/* Сложные варианты с комбинациями */
@custom-variant dark-hover (&:is(.dark *):hover);

<button class="dark-hover:bg-gray-700">
  Hover только в dark mode
</button>`,
    language: 'css',
    level: 'advanced',
    tags: ['tailwind', 'css', 'variants', 'custom'],
    whyRelevant2026: 'Кастомные варианты позволяют описывать сложную логику декларативно',
    related: ['tw-v4-config', 'tw-dark-mode']
  },
  {
    id: 'tw-container-queries',
    title: 'Container Queries',
    description: 'Адаптивность на основе размера контейнера',
    code: `/* Определение контейнера */
<div class="@container">
  <div class="@sm:flex @md:grid @lg:grid-cols-3">
    <!-- Стили зависят от размера контейнера, не viewport -->
  </div>
</div>

/* Именованные контейнеры */
<div class="@container/sidebar">
  <nav class="@sm/sidebar:flex-col">
    <!-- Реагирует на размер sidebar контейнера -->
  </nav>
</div>

/* Размеры container queries в Tailwind */
/* @xs: 20rem (320px) */
/* @sm: 24rem (384px) */
/* @md: 28rem (448px) */
/* @lg: 32rem (512px) */
/* @xl: 36rem (576px) */

/* Карточка адаптивная к своему контейнеру */
<article class="@container">
  <div class="
    flex flex-col
    @md:flex-row
    @lg:gap-6
  ">
    <img class="@md:w-1/3 @lg:w-1/4" />
    <div class="@md:flex-1">
      <h2 class="@lg:text-2xl">Title</h2>
    </div>
  </div>
</article>`,
    language: 'html',
    level: 'intermediate',
    tags: ['tailwind', 'css', 'container-queries', 'responsive'],
    whyRelevant2026: 'Container Queries - главный тренд адаптивной вёрстки',
    related: ['tw-responsive', 'css-container-queries']
  },
  {
    id: 'tw-responsive',
    title: 'Responsive Design',
    description: 'Адаптивная вёрстка с Tailwind',
    code: `/* Mobile-first подход */
<div class="
  flex flex-col
  sm:flex-row
  md:gap-6
  lg:gap-8
  xl:max-w-6xl
  2xl:max-w-7xl
">
  <!-- Контент -->
</div>

/* Брейкпоинты по умолчанию */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */

/* Скрытие/показ элементов */
<nav class="hidden md:flex">Desktop nav</nav>
<nav class="md:hidden">Mobile nav</nav>

/* Адаптивная типографика */
<h1 class="
  text-2xl
  sm:text-3xl
  md:text-4xl
  lg:text-5xl
">
  Responsive Heading
</h1>

/* Адаптивная сетка */
<div class="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
">
  <!-- Cards -->
</div>

/* Адаптивные отступы */
<section class="
  px-4 py-8
  md:px-8 md:py-12
  lg:px-16 lg:py-20
">`,
    language: 'html',
    level: 'beginner',
    tags: ['tailwind', 'css', 'responsive', 'mobile-first'],
    whyRelevant2026: 'Mobile-first остаётся стандартом адаптивной разработки',
    related: ['tw-container-queries', 'tw-v4-config']
  },
  {
    id: 'tw-animations',
    title: 'Анимации в Tailwind',
    description: 'Встроенные и кастомные анимации',
    code: `/* Встроенные анимации */
<div class="animate-spin">Spinner</div>
<div class="animate-ping">Ping effect</div>
<div class="animate-pulse">Skeleton</div>
<div class="animate-bounce">Bouncing</div>

/* Кастомные анимации через @theme */
@theme inline {
  --animate-fade-in: fade-in 0.5s ease-out;
  --animate-slide-up: slide-up 0.4s ease-out;
  --animate-scale-in: scale-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Использование */
<div class="animate-fade-in">Появление</div>
<div class="animate-slide-up">Слайд вверх</div>

/* Transitions */
<button class="
  transition-all
  duration-300
  ease-in-out
  hover:scale-105
  hover:shadow-lg
">
  Hover me
</button>

/* Delay */
<div class="animate-fade-in delay-300">
  Задержка 300ms
</div>`,
    language: 'html',
    level: 'intermediate',
    tags: ['tailwind', 'css', 'animations', 'transitions'],
    whyRelevant2026: 'Tailwind v4 упростил добавление кастомных анимаций',
    related: ['css-keyframes', 'tw-v4-config']
  },
  {
    id: 'tw-gradients',
    title: 'Градиенты в Tailwind',
    description: 'Линейные и радиальные градиенты',
    code: `/* Линейный градиент */
<div class="
  bg-gradient-to-r
  from-blue-500
  to-purple-500
">
  Слева направо
</div>

/* Направления градиента */
/* to-t, to-tr, to-r, to-br, to-b, to-bl, to-l, to-tl */

/* Три цвета с via */
<div class="
  bg-gradient-to-r
  from-pink-500
  via-red-500
  to-yellow-500
">
  Радуга
</div>

/* Позиции цветов */
<div class="
  bg-gradient-to-r
  from-blue-500
  from-10%
  via-purple-500
  via-50%
  to-pink-500
  to-90%
">
  Кастомные позиции
</div>

/* Текстовый градиент */
<h1 class="
  bg-gradient-to-r
  from-blue-600
  to-purple-600
  bg-clip-text
  text-transparent
">
  Gradient Text
</h1>

/* Радиальный градиент (кастомный) */
@theme inline {
  --bg-radial: radial-gradient(
    circle at center,
    var(--color-primary) 0%,
    transparent 70%
  );
}

<div class="bg-radial">Радиальный</div>`,
    language: 'html',
    level: 'beginner',
    tags: ['tailwind', 'css', 'gradients', 'colors'],
    whyRelevant2026: 'Градиенты остаются ключевым визуальным элементом',
    related: ['tw-colors', 'css-gradients']
  },
  {
    id: 'tw-flexbox',
    title: 'Flexbox утилиты',
    description: 'Построение layouts с Flexbox',
    code: `/* Базовый flex контейнер */
<div class="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Right</div>
</div>

/* Вертикальный стек */
<div class="flex flex-col gap-2">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

/* Центрирование */
<div class="flex items-center justify-center min-h-screen">
  Идеально по центру
</div>

/* Flex grow/shrink */
<div class="flex">
  <div class="flex-none w-20">Fixed</div>
  <div class="flex-1">Grows</div>
  <div class="flex-shrink-0">No shrink</div>
</div>

/* Wrap */
<div class="flex flex-wrap gap-2">
  {items.map(item => <Tag />)}
</div>

/* Order */
<div class="flex">
  <div class="order-2">Second visually</div>
  <div class="order-1">First visually</div>
</div>

/* Self alignment */
<div class="flex items-start h-40">
  <div class="self-end">В конце</div>
  <div class="self-center">По центру</div>
</div>`,
    language: 'html',
    level: 'beginner',
    tags: ['tailwind', 'css', 'flexbox', 'layout'],
    whyRelevant2026: 'Flexbox - основа большинства UI-компонентов',
    related: ['tw-grid', 'css-flexbox']
  },
  {
    id: 'tw-grid',
    title: 'CSS Grid утилиты',
    description: 'Построение сеток с Grid',
    code: `/* Базовая сетка */
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

/* Адаптивная сетка */
<div class="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-6
">
  {cards.map(card => <Card />)}
</div>

/* Auto-fit для адаптивных колонок */
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  {items.map(item => <Item />)}
</div>

/* Span нескольких колонок/строк */
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2">Wide</div>
  <div class="col-span-1">Normal</div>
  <div class="row-span-2">Tall</div>
</div>

/* Template areas (кастомный) */
<div class="
  grid
  grid-rows-[auto_1fr_auto]
  grid-cols-[200px_1fr]
  min-h-screen
">
  <header class="col-span-2">Header</header>
  <aside>Sidebar</aside>
  <main>Content</main>
  <footer class="col-span-2">Footer</footer>
</div>

/* Place items */
<div class="grid place-items-center h-64">
  Центрировано
</div>`,
    language: 'html',
    level: 'intermediate',
    tags: ['tailwind', 'css', 'grid', 'layout'],
    whyRelevant2026: 'CSS Grid - стандарт для сложных layouts',
    related: ['tw-flexbox', 'css-grid']
  },
  {
    id: 'tw-prose',
    title: 'Typography Plugin',
    description: 'Стилизация текстового контента',
    code: `/* Базовое использование prose */
<article class="prose lg:prose-xl">
  <h1>Заголовок</h1>
  <p>Параграф с <a href="#">ссылкой</a>.</p>
  <ul>
    <li>Элемент списка</li>
  </ul>
  <pre><code>const x = 1;</code></pre>
</article>

/* Модификаторы размера */
<div class="prose-sm">Small text</div>
<div class="prose">Base</div>
<div class="prose-lg">Large</div>
<div class="prose-xl">Extra large</div>
<div class="prose-2xl">2X large</div>

/* Цветовые схемы */
<article class="
  prose
  prose-slate
  dark:prose-invert
">
  <!-- Автоматическая тёмная тема -->
</article>

/* Кастомизация элементов */
<article class="
  prose
  prose-headings:text-blue-600
  prose-a:text-purple-600
  prose-a:no-underline
  prose-code:bg-gray-100
  prose-pre:bg-gray-900
  prose-img:rounded-xl
">
  <!-- Кастомные стили для элементов -->
</article>

/* Ограничение ширины */
<div class="prose max-w-none">
  Полная ширина
</div>`,
    language: 'html',
    level: 'intermediate',
    tags: ['tailwind', 'css', 'typography', 'prose'],
    whyRelevant2026: '@tailwindcss/typography - must-have для контентных сайтов',
    related: ['tw-v4-config', 'css-typography']
  }
]

export default tailwind
