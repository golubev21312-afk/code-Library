export interface PopularTag {
  name: string
  type: 'html' | 'css'
  title: string
  description: string
  details: string
  example: string
  tips?: string[]
}

export const popularTags: PopularTag[] = [
  // HTML Tags
  {
    name: 'div',
    type: 'html',
    title: 'Универсальный контейнер',
    description: 'Блочный элемент для группировки контента и создания структуры страницы.',
    details: `<div> — это основной строительный блок веб-страниц. Он не имеет семантического значения,
но идеально подходит для:
• Создания обёрток и контейнеров
• Группировки элементов для стилизации
• Построения сеток и layouts
• Применения JavaScript-обработчиков к группе элементов`,
    example: `<!-- Карточка товара -->
<div class="card">
  <div class="card-image">
    <img src="product.jpg" alt="Товар">
  </div>
  <div class="card-content">
    <h3 class="card-title">Название товара</h3>
    <p class="card-price">1 999 ₽</p>
    <button class="card-button">В корзину</button>
  </div>
</div>

<!-- Сетка из карточек -->
<div class="grid">
  <div class="grid-item">Элемент 1</div>
  <div class="grid-item">Элемент 2</div>
  <div class="grid-item">Элемент 3</div>
</div>`,
    tips: [
      'Используйте семантические теги (article, section, nav) где возможно',
      'Не злоупотребляйте вложенностью — это усложняет код',
      'Давайте осмысленные классы для читаемости'
    ]
  },
  {
    name: 'flex',
    type: 'css',
    title: 'Flexbox раскладка',
    description: 'Мощный инструмент для создания гибких одномерных layouts.',
    details: `Flexbox — это модель раскладки, которая позволяет легко:
• Выравнивать элементы по горизонтали и вертикали
• Распределять пространство между элементами
• Менять порядок элементов без изменения HTML
• Создавать адаптивные интерфейсы`,
    example: `/* Контейнер с центрированием */
.container {
  display: flex;
  justify-content: center;  /* по горизонтали */
  align-items: center;      /* по вертикали */
  gap: 1rem;                /* отступы между элементами */
}

/* Навигация с элементами по краям */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

/* Карточки в ряд с переносом */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.card {
  flex: 1 1 300px;  /* растягивается, минимум 300px */
}

/* Вертикальный список */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}`,
    tips: [
      'justify-content — выравнивание по главной оси',
      'align-items — выравнивание по поперечной оси',
      'gap — современная замена margin между элементами',
      'flex: 1 — элемент займёт всё доступное пространство'
    ]
  },
  {
    name: 'button',
    type: 'html',
    title: 'Интерактивная кнопка',
    description: 'Кликабельный элемент для действий пользователя.',
    details: `<button> — правильный элемент для всех кликабельных действий:
• Отправка форм (type="submit")
• Сброс форм (type="reset")
• JavaScript-действия (type="button")

Преимущества перед <div> или <a>:
• Доступен с клавиатуры (Tab, Enter, Space)
• Правильно читается скринридерами
• Можно отключить (disabled)`,
    example: `<!-- Основные типы кнопок -->
<button type="submit">Отправить форму</button>
<button type="button">Обычная кнопка</button>
<button type="reset">Сбросить</button>

<!-- Кнопка с иконкой -->
<button type="button" class="btn-icon">
  <svg>...</svg>
  <span>Добавить в корзину</span>
</button>

<!-- Отключённая кнопка -->
<button type="submit" disabled>Загрузка...</button>

<!-- Кнопка-ссылка (когда нужен переход) -->
<a href="/catalog" class="btn">Перейти в каталог</a>`,
    tips: [
      'Всегда указывайте type для избежания случайной отправки форм',
      'Используйте disabled для неактивных кнопок',
      'Для навигации используйте <a>, не <button>'
    ]
  },
  {
    name: 'input',
    type: 'html',
    title: 'Поле ввода',
    description: 'Универсальный элемент для получения данных от пользователя.',
    details: `<input> имеет множество типов для разных данных:
• text, email, password, tel — текстовые данные
• number, range — числа
• date, time, datetime-local — дата и время
• checkbox, radio — выбор опций
• file — загрузка файлов
• hidden — скрытые данные`,
    example: `<!-- Текстовые поля -->
<input type="text" placeholder="Имя" required>
<input type="email" placeholder="Email" autocomplete="email">
<input type="password" minlength="8" placeholder="Пароль">
<input type="tel" pattern="[0-9]{10}" placeholder="Телефон">

<!-- Числа и даты -->
<input type="number" min="1" max="100" step="1">
<input type="date" min="2024-01-01">
<input type="range" min="0" max="100" value="50">

<!-- Чекбоксы и радио -->
<label>
  <input type="checkbox" name="agree" required>
  Согласен с условиями
</label>

<label>
  <input type="radio" name="size" value="s"> S
</label>
<label>
  <input type="radio" name="size" value="m" checked> M
</label>

<!-- Файлы -->
<input type="file" accept="image/*" multiple>`,
    tips: [
      'Используйте правильный type для мобильной клавиатуры',
      'autocomplete помогает браузеру заполнять поля',
      'Всегда связывайте с <label> для доступности'
    ]
  },
  {
    name: 'grid',
    type: 'css',
    title: 'CSS Grid раскладка',
    description: 'Двумерная система раскладки для сложных интерфейсов.',
    details: `CSS Grid идеален для:
• Сложных двумерных layouts
• Галерей изображений
• Dashboards и админ-панелей
• Любых интерфейсов с колонками и строками

Основные концепции:
• grid-template-columns/rows — определение сетки
• gap — отступы между ячейками
• grid-column/row — размещение элементов`,
    example: `/* Простая сетка из 3 колонок */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* Адаптивная сетка (auto-fit) */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Layout страницы */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }

/* Элемент на несколько ячеек */
.featured {
  grid-column: span 2;  /* занять 2 колонки */
  grid-row: span 2;     /* занять 2 строки */
}`,
    tips: [
      'fr — доля свободного пространства',
      'auto-fit + minmax = идеальная адаптивность',
      'grid-template-areas — наглядное описание layout',
      'Используйте Grid для 2D, Flex для 1D раскладок'
    ]
  },
  {
    name: 'a',
    type: 'html',
    title: 'Гиперссылка',
    description: 'Элемент для навигации между страницами и разделами.',
    details: `<a> — основа навигации в вебе:
• Переход на другие страницы (href="url")
• Якорные ссылки (href="#section")
• Ссылки на email (href="mailto:...")
• Ссылки на телефон (href="tel:...")
• Скачивание файлов (download)`,
    example: `<!-- Обычные ссылки -->
<a href="/about">О нас</a>
<a href="https://example.com" target="_blank" rel="noopener">
  Внешний сайт
</a>

<!-- Якорная навигация -->
<a href="#contacts">Перейти к контактам</a>
<section id="contacts">...</section>

<!-- Контактные ссылки -->
<a href="mailto:info@example.com">Написать письмо</a>
<a href="tel:+79001234567">Позвонить</a>

<!-- Скачивание файла -->
<a href="/files/price.pdf" download="Прайс-лист.pdf">
  Скачать прайс
</a>

<!-- Кнопка-ссылка -->
<a href="/signup" class="btn btn-primary">
  Зарегистрироваться
</a>`,
    tips: [
      'target="_blank" требует rel="noopener" для безопасности',
      'Для действий без перехода используйте <button>',
      'download атрибут работает только для same-origin'
    ]
  },
  {
    name: 'position',
    type: 'css',
    title: 'Позиционирование',
    description: 'Управление расположением элементов на странице.',
    details: `Типы позиционирования:
• static — по умолчанию, обычный поток
• relative — относительно своей позиции
• absolute — относительно позиционированного родителя
• fixed — относительно viewport
• sticky — гибрид relative и fixed`,
    example: `/* Relative: смещение от своей позиции */
.badge {
  position: relative;
  top: -10px;
  left: 5px;
}

/* Absolute: относительно родителя */
.card {
  position: relative;  /* создаём контекст */
}
.card-badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

/* Fixed: прилипает к viewport */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* Sticky: прилипает при скролле */
.sidebar {
  position: sticky;
  top: 20px;  /* прилипнет на 20px от верха */
}

/* Центрирование absolute элемента */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,
    tips: [
      'absolute ищет ближайшего позиционированного родителя',
      'z-index работает только с позиционированными элементами',
      'sticky не работает если у родителя overflow: hidden'
    ]
  },
  {
    name: 'img',
    type: 'html',
    title: 'Изображение',
    description: 'Встраивание изображений на страницу.',
    details: `<img> — замещаемый элемент для отображения картинок:
• src — путь к изображению
• alt — описание для доступности и SEO
• loading="lazy" — ленивая загрузка
• width/height — размеры (важно для CLS)`,
    example: `<!-- Базовое использование -->
<img
  src="photo.jpg"
  alt="Описание изображения"
  width="800"
  height="600"
>

<!-- Ленивая загрузка -->
<img
  src="large-image.jpg"
  alt="Фото"
  loading="lazy"
>

<!-- Адаптивное изображение -->
<img
  src="image-800.jpg"
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, 800px"
  alt="Адаптивное фото"
>

<!-- Picture для разных форматов -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Фото">
</picture>`,
    tips: [
      'Всегда указывайте alt для доступности',
      'width и height предотвращают сдвиг контента (CLS)',
      'loading="lazy" для изображений ниже fold',
      'Используйте WebP/AVIF для меньшего размера'
    ]
  },
  {
    name: 'transition',
    type: 'css',
    title: 'CSS переходы',
    description: 'Плавная анимация изменения свойств.',
    details: `transition создаёт плавный переход между состояниями:
• transition-property — какие свойства анимировать
• transition-duration — длительность
• transition-timing-function — функция плавности
• transition-delay — задержка`,
    example: `/* Базовый переход */
.button {
  background: #3b82f6;
  transition: background-color 0.2s ease;
}
.button:hover {
  background: #2563eb;
}

/* Несколько свойств */
.card {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

/* Все свойства (осторожно с производительностью) */
.link {
  transition: all 0.3s ease;
}

/* Разные timing-functions */
.element {
  transition: transform 0.3s ease-in-out;
  /* ease, ease-in, ease-out, ease-in-out, linear */
  /* cubic-bezier(0.68, -0.55, 0.265, 1.55) */
}

/* Задержка для эффекта каскада */
.item:nth-child(1) { transition-delay: 0ms; }
.item:nth-child(2) { transition-delay: 50ms; }
.item:nth-child(3) { transition-delay: 100ms; }`,
    tips: [
      'Анимируйте только transform и opacity для производительности',
      'Избегайте transition: all на сложных элементах',
      'cubic-bezier() для кастомных кривых анимации'
    ]
  },
  {
    name: 'form',
    type: 'html',
    title: 'Форма',
    description: 'Контейнер для сбора и отправки данных.',
    details: `<form> группирует поля ввода и управляет их отправкой:
• action — URL для отправки данных
• method — GET или POST
• Автоматическая валидация HTML5
• События submit для JavaScript`,
    example: `<!-- Базовая форма -->
<form action="/api/contact" method="POST">
  <label>
    Имя
    <input type="text" name="name" required>
  </label>

  <label>
    Email
    <input type="email" name="email" required>
  </label>

  <label>
    Сообщение
    <textarea name="message" rows="4" required></textarea>
  </label>

  <button type="submit">Отправить</button>
</form>

<!-- Форма с JavaScript -->
<form id="loginForm">
  <input type="email" name="email" required>
  <input type="password" name="password" required>
  <button type="submit">Войти</button>
</form>

<script>
document.getElementById('loginForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    // отправка через fetch...
  });
</script>

<!-- Форма загрузки файлов -->
<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="avatar" accept="image/*">
  <button type="submit">Загрузить</button>
</form>`,
    tips: [
      'enctype="multipart/form-data" для загрузки файлов',
      'novalidate отключает HTML5 валидацию',
      'FormData упрощает работу с данными формы в JS'
    ]
  },
]
