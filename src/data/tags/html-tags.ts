export interface HtmlTag {
  tag: string
  description: string
  example: string
  category: 'structure' | 'text' | 'form' | 'media' | 'table' | 'semantic' | 'interactive'
}

export const htmlTags: HtmlTag[] = [
  // Structure
  { tag: 'div', description: 'Блочный контейнер', category: 'structure', example: `<div class="container">
  <p>Контент внутри div</p>
</div>` },
  { tag: 'span', description: 'Строчный контейнер', category: 'structure', example: `<p>Текст с <span class="highlight">выделением</span></p>` },
  { tag: 'header', description: 'Шапка страницы/секции', category: 'structure', example: `<header>
  <h1>Заголовок сайта</h1>
  <nav>...</nav>
</header>` },
  { tag: 'footer', description: 'Подвал страницы/секции', category: 'structure', example: `<footer>
  <p>&copy; 2026 Company</p>
</footer>` },
  { tag: 'main', description: 'Основное содержимое', category: 'structure', example: `<main>
  <h1>Главный контент</h1>
  <article>...</article>
</main>` },
  { tag: 'section', description: 'Тематическая секция', category: 'structure', example: `<section>
  <h2>О нас</h2>
  <p>Описание компании</p>
</section>` },
  { tag: 'article', description: 'Независимый контент', category: 'structure', example: `<article>
  <h2>Заголовок статьи</h2>
  <p>Текст статьи...</p>
</article>` },
  { tag: 'aside', description: 'Боковой контент', category: 'structure', example: `<aside>
  <h3>Связанные статьи</h3>
  <ul>...</ul>
</aside>` },
  { tag: 'nav', description: 'Навигация', category: 'structure', example: `<nav>
  <a href="/">Главная</a>
  <a href="/about">О нас</a>
</nav>` },

  // Text
  { tag: 'h1-h6', description: 'Заголовки 1-6 уровня', category: 'text', example: `<h1>Главный заголовок</h1>
<h2>Подзаголовок</h2>
<h3>Заголовок секции</h3>` },
  { tag: 'p', description: 'Параграф текста', category: 'text', example: `<p>Это параграф текста. Может содержать <strong>важный</strong> текст.</p>` },
  { tag: 'a', description: 'Гиперссылка', category: 'text', example: `<a href="https://example.com" target="_blank">Открыть сайт</a>
<a href="#section">Якорная ссылка</a>` },
  { tag: 'strong', description: 'Важный текст (жирный)', category: 'text', example: `<p>Это <strong>очень важно</strong> знать.</p>` },
  { tag: 'em', description: 'Акцентированный текст (курсив)', category: 'text', example: `<p>Слово <em>акцентировано</em> курсивом.</p>` },
  { tag: 'code', description: 'Код (моноширинный)', category: 'text', example: `<p>Используйте <code>console.log()</code> для отладки.</p>` },
  { tag: 'pre', description: 'Преформатированный текст', category: 'text', example: `<pre>
function hello() {
  console.log('Hello!');
}
</pre>` },
  { tag: 'blockquote', description: 'Цитата', category: 'text', example: `<blockquote cite="https://example.com">
  <p>Это цитата из источника.</p>
</blockquote>` },
  { tag: 'ul', description: 'Маркированный список', category: 'text', example: `<ul>
  <li>Первый пункт</li>
  <li>Второй пункт</li>
</ul>` },
  { tag: 'ol', description: 'Нумерованный список', category: 'text', example: `<ol>
  <li>Шаг первый</li>
  <li>Шаг второй</li>
</ol>` },
  { tag: 'mark', description: 'Выделенный текст', category: 'text', example: `<p>Найдено: <mark>ключевое слово</mark> в тексте.</p>` },

  // Forms
  { tag: 'form', description: 'Форма', category: 'form', example: `<form action="/submit" method="POST">
  <input type="text" name="name">
  <button type="submit">Отправить</button>
</form>` },
  { tag: 'input', description: 'Поле ввода', category: 'form', example: `<input type="text" placeholder="Имя">
<input type="email" required>
<input type="password" minlength="8">
<input type="checkbox" checked>
<input type="radio" name="choice">` },
  { tag: 'textarea', description: 'Многострочное поле', category: 'form', example: `<textarea rows="4" cols="50" placeholder="Введите текст..."></textarea>` },
  { tag: 'button', description: 'Кнопка', category: 'form', example: `<button type="button">Нажми</button>
<button type="submit">Отправить</button>
<button type="reset">Сбросить</button>` },
  { tag: 'select', description: 'Выпадающий список', category: 'form', example: `<select name="city">
  <option value="">Выберите город</option>
  <option value="msk">Москва</option>
  <option value="spb">Санкт-Петербург</option>
</select>` },
  { tag: 'label', description: 'Подпись поля', category: 'form', example: `<label for="email">Email:</label>
<input type="email" id="email">` },
  { tag: 'fieldset', description: 'Группа полей', category: 'form', example: `<fieldset>
  <legend>Контактные данные</legend>
  <input type="text" placeholder="Имя">
  <input type="email" placeholder="Email">
</fieldset>` },

  // Media
  { tag: 'img', description: 'Изображение', category: 'media', example: `<img src="photo.jpg" alt="Описание" width="300" height="200" loading="lazy">` },
  { tag: 'video', description: 'Видео', category: 'media', example: `<video controls width="640">
  <source src="video.mp4" type="video/mp4">
  Ваш браузер не поддерживает видео.
</video>` },
  { tag: 'audio', description: 'Аудио', category: 'media', example: `<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
</audio>` },
  { tag: 'picture', description: 'Адаптивное изображение', category: 'media', example: `<picture>
  <source media="(min-width: 800px)" srcset="large.jpg">
  <source media="(min-width: 400px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Адаптивное фото">
</picture>` },
  { tag: 'figure', description: 'Иллюстрация с подписью', category: 'media', example: `<figure>
  <img src="chart.png" alt="График">
  <figcaption>Рис. 1 — Рост продаж</figcaption>
</figure>` },
  { tag: 'svg', description: 'Векторная графика', category: 'media', example: `<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="blue"/>
</svg>` },
  { tag: 'iframe', description: 'Встроенный фрейм', category: 'media', example: `<iframe src="https://example.com" width="600" height="400" loading="lazy"></iframe>` },

  // Table
  { tag: 'table', description: 'Таблица', category: 'table', example: `<table>
  <thead>
    <tr><th>Имя</th><th>Возраст</th></tr>
  </thead>
  <tbody>
    <tr><td>Анна</td><td>25</td></tr>
    <tr><td>Иван</td><td>30</td></tr>
  </tbody>
</table>` },

  // Semantic
  { tag: 'time', description: 'Дата/время', category: 'semantic', example: `<time datetime="2026-01-15">15 января 2026</time>
<time datetime="14:30">14:30</time>` },
  { tag: 'address', description: 'Контактная информация', category: 'semantic', example: `<address>
  <a href="mailto:info@example.com">info@example.com</a>
  <a href="tel:+71234567890">+7 123 456-78-90</a>
</address>` },
  { tag: 'abbr', description: 'Аббревиатура', category: 'semantic', example: `<abbr title="HyperText Markup Language">HTML</abbr>` },

  // Interactive
  { tag: 'details', description: 'Раскрывающийся блок', category: 'interactive', example: `<details>
  <summary>Показать подробности</summary>
  <p>Скрытый контент, который появится при клике.</p>
</details>` },
  { tag: 'dialog', description: 'Модальное окно', category: 'interactive', example: `<dialog id="modal">
  <h2>Заголовок</h2>
  <p>Контент модалки</p>
  <button onclick="this.closest('dialog').close()">Закрыть</button>
</dialog>
<button onclick="document.getElementById('modal').showModal()">Открыть</button>` },
  { tag: 'template', description: 'Шаблон для клонирования', category: 'interactive', example: `<template id="card-template">
  <div class="card">
    <h3></h3>
    <p></p>
  </div>
</template>` },
]

export const htmlCategories: Record<HtmlTag['category'], string> = {
  structure: 'Структура',
  text: 'Текст',
  form: 'Формы',
  media: 'Медиа',
  table: 'Таблицы',
  semantic: 'Семантика',
  interactive: 'Интерактивные',
}
