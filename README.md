# Code Library

Библиотека 180+ сниппетов и примеров кода для современной веб-разработки.

## Tech Stack

- **React 19** + TypeScript
- **Vite 7** — сборка
- **Tailwind CSS v4** — стили (CSS-first конфигурация)
- **shadcn/ui** — UI компоненты
- **Zustand** — state management
- **react-syntax-highlighter** — подсветка кода
- **PWA** — работа офлайн

## Возможности

- 🌓 Тёмная/светлая/системная тема
- 📋 Копирование кода в буфер обмена
- ❤️ Избранные сниппеты (сохраняются локально)
- 🔍 Фильтрация по категориям и уровню сложности
- 🎨 Подсветка синтаксиса для TypeScript, JavaScript, React, CSS, HTML
- 📱 PWA — установка как приложение, работа офлайн
- 🔗 Информация о релевантности в 2026 году для каждого сниппета

## Сниппеты (184 шт.)

### TypeScript (50 сниппетов)
- **Utility Types** — Partial, Required, Pick, Omit, Record, и др.
- **Generics** — Generic Functions, Constraints, Conditional Types
- **Advanced** — Discriminated Unions, Type Guards, Template Literals
- **Decorators** — Class, Method, Field, Accessor Decorators (TC39)
- **Patterns** — Builder, Factory, Strategy, Observer, Result, State Machine
- **Functions** — Overloads, Type Predicates, HOF, Async Typing

### JavaScript (43 сниппета)
- **ES2025+** — Array.at, findLast, Object.groupBy, Promise.withResolvers
- **Async** — async/await, Promise.all/allSettled/race, AbortController
- **Web APIs** — Fetch, IntersectionObserver, Web Storage, Clipboard
- **Modern Patterns** — Proxy, Generators, WeakMap/WeakSet, Symbols, Modules
- **DOM** — Selectors, Manipulation, MutationObserver, ResizeObserver

### React (40 сниппетов)
- **Hooks** — useState, useEffect, useMemo, useCallback, useRef, и др.
- **Patterns** — Suspense, Error Boundaries, Compound Components, HOC
- **Context** — Basic, Reducer, Selectors, Composition, Testing
- **Server Components** — RSC, Client Components, Server Actions, Streaming
- **Performance** — memo, Virtualization, Code Splitting

### CSS/Tailwind (30 сниппетов)
- **Selectors** — :has(), :is(), :where(), :not(), nth-child
- **Animations** — View Transitions, Scroll-driven, Keyframes, Motion Path
- **Tailwind v4** — CSS Config, Dark Mode, Custom Variants, Container Queries

### HTML (21 сниппет)
- **Semantic** — Document Structure, Forms, Media, Dialog, Popover
- **Accessibility** — ARIA Landmarks, Live Regions, Keyboard Navigation, Focus

## Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка
npm run build

# Preview production build
npm run preview

# Линтинг
npm run lint
```

## Структура проекта

```
src/
├── components/
│   ├── ui/           # shadcn/ui компоненты
│   ├── code/         # CodeBlock с подсветкой
│   ├── snippets/     # SnippetCard
│   └── layout/       # Header с темой
├── data/
│   └── snippets/     # 184 сниппета по категориям
│       ├── typescript/
│       ├── javascript/
│       ├── react/
│       ├── css/
│       └── html/
├── pages/            # SnippetsPage
├── providers/        # ThemeProvider
├── store/            # Zustand (theme, favorites)
├── types/            # TypeScript типы
└── lib/              # Утилиты
```

## Лицензия

MIT
