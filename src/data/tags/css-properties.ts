export interface CssProperty {
  property: string
  description: string
  example: string
  category: 'layout' | 'box' | 'typography' | 'visual' | 'flexbox' | 'grid' | 'transform' | 'animation'
}

export const cssProperties: CssProperty[] = [
  // Layout
  { property: 'display', description: 'Тип отображения элемента', category: 'layout', example: `display: block;
display: inline;
display: inline-block;
display: flex;
display: grid;
display: none;` },
  { property: 'position', description: 'Способ позиционирования', category: 'layout', example: `position: static;    /* по умолчанию */
position: relative;  /* относительно себя */
position: absolute;  /* относительно родителя */
position: fixed;     /* относительно viewport */
position: sticky;    /* гибрид relative/fixed */` },
  { property: 'top/right/bottom/left', description: 'Смещение позиционированного элемента', category: 'layout', example: `.element {
  position: absolute;
  top: 10px;
  right: 20px;
  bottom: auto;
  left: 20px;
}` },
  { property: 'z-index', description: 'Порядок наложения', category: 'layout', example: `.modal { z-index: 1000; }
.overlay { z-index: 999; }
.header { z-index: 100; }` },
  { property: 'overflow', description: 'Поведение при переполнении', category: 'layout', example: `overflow: visible;  /* по умолчанию */
overflow: hidden;   /* обрезать */
overflow: scroll;   /* всегда скролл */
overflow: auto;     /* скролл если нужно */
overflow-x: hidden;
overflow-y: auto;` },
  { property: 'visibility', description: 'Видимость элемента', category: 'layout', example: `visibility: visible;  /* виден */
visibility: hidden;   /* скрыт, но занимает место */
visibility: collapse; /* для таблиц */` },
  { property: 'opacity', description: 'Прозрачность', category: 'layout', example: `opacity: 1;    /* полностью видимый */
opacity: 0.5;  /* полупрозрачный */
opacity: 0;    /* полностью прозрачный */` },

  // Box Model
  { property: 'width/height', description: 'Ширина и высота', category: 'box', example: `width: 100px;
width: 50%;
width: 100vw;
height: auto;
height: 100vh;
height: fit-content;` },
  { property: 'min/max-width/height', description: 'Ограничения размеров', category: 'box', example: `min-width: 200px;
max-width: 1200px;
min-height: 100vh;
max-height: 500px;` },
  { property: 'margin', description: 'Внешние отступы', category: 'box', example: `margin: 10px;           /* все стороны */
margin: 10px 20px;      /* верх-низ лево-право */
margin: 10px 20px 30px; /* верх лево-право низ */
margin: 10px 20px 30px 40px; /* все стороны */
margin: 0 auto;         /* центрирование */` },
  { property: 'padding', description: 'Внутренние отступы', category: 'box', example: `padding: 10px;
padding: 10px 20px;
padding-top: 10px;
padding-inline: 20px;   /* лево + право */
padding-block: 10px;    /* верх + низ */` },
  { property: 'border', description: 'Граница элемента', category: 'box', example: `border: 1px solid #000;
border-width: 2px;
border-style: dashed;
border-color: red;
border-top: none;` },
  { property: 'border-radius', description: 'Скругление углов', category: 'box', example: `border-radius: 8px;
border-radius: 50%;     /* круг */
border-radius: 10px 20px;
border-top-left-radius: 10px;` },
  { property: 'box-sizing', description: 'Модель расчёта размеров', category: 'box', example: `box-sizing: content-box; /* по умолчанию */
box-sizing: border-box;  /* включая padding и border */

/* Рекомендуется глобально: */
*, *::before, *::after {
  box-sizing: border-box;
}` },
  { property: 'box-shadow', description: 'Тень элемента', category: 'box', example: `box-shadow: 0 2px 4px rgba(0,0,0,0.1);
box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1),
            0 2px 4px -1px rgba(0,0,0,0.06);
box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);` },

  // Typography
  { property: 'font-family', description: 'Семейство шрифта', category: 'typography', example: `font-family: Arial, sans-serif;
font-family: 'Roboto', sans-serif;
font-family: Georgia, serif;
font-family: monospace;` },
  { property: 'font-size', description: 'Размер шрифта', category: 'typography', example: `font-size: 16px;
font-size: 1rem;
font-size: 1.5em;
font-size: clamp(1rem, 2vw, 2rem);` },
  { property: 'font-weight', description: 'Жирность шрифта', category: 'typography', example: `font-weight: normal;  /* 400 */
font-weight: bold;    /* 700 */
font-weight: 100;     /* тонкий */
font-weight: 900;     /* жирный */` },
  { property: 'line-height', description: 'Межстрочный интервал', category: 'typography', example: `line-height: 1.5;     /* множитель */
line-height: 24px;    /* фиксированный */
line-height: 150%;    /* проценты */` },
  { property: 'text-align', description: 'Выравнивание текста', category: 'typography', example: `text-align: left;
text-align: center;
text-align: right;
text-align: justify;` },
  { property: 'text-decoration', description: 'Декорация текста', category: 'typography', example: `text-decoration: none;
text-decoration: underline;
text-decoration: line-through;
text-decoration: underline wavy red;` },
  { property: 'text-transform', description: 'Регистр текста', category: 'typography', example: `text-transform: uppercase;
text-transform: lowercase;
text-transform: capitalize;
text-transform: none;` },
  { property: 'white-space', description: 'Обработка пробелов', category: 'typography', example: `white-space: normal;    /* переносит */
white-space: nowrap;    /* не переносит */
white-space: pre;       /* сохраняет пробелы */
white-space: pre-wrap;  /* сохраняет + переносит */` },
  { property: 'text-overflow', description: 'Переполнение текста', category: 'typography', example: `.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}` },

  // Visual
  { property: 'color', description: 'Цвет текста', category: 'visual', example: `color: #333;
color: rgb(51, 51, 51);
color: rgba(0, 0, 0, 0.8);
color: hsl(0, 0%, 20%);
color: currentColor;` },
  { property: 'background', description: 'Фон элемента', category: 'visual', example: `background: #fff;
background: url('image.jpg') center/cover;
background: linear-gradient(to right, #f00, #00f);
background: radial-gradient(circle, #fff, #000);` },
  { property: 'background-color', description: 'Цвет фона', category: 'visual', example: `background-color: white;
background-color: transparent;
background-color: rgba(0, 0, 0, 0.5);` },
  { property: 'background-image', description: 'Изображение фона', category: 'visual', example: `background-image: url('bg.jpg');
background-image: linear-gradient(45deg, #f00, #00f);
background-image: url('a.png'), url('b.png');` },
  { property: 'filter', description: 'Фильтры', category: 'visual', example: `filter: blur(5px);
filter: brightness(1.2);
filter: contrast(1.5);
filter: grayscale(100%);
filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));` },
  { property: 'backdrop-filter', description: 'Фильтр фона', category: 'visual', example: `.glass {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
}` },
  { property: 'cursor', description: 'Вид курсора', category: 'visual', example: `cursor: pointer;
cursor: default;
cursor: not-allowed;
cursor: grab;
cursor: text;` },

  // Flexbox
  { property: 'display: flex', description: 'Включить flexbox', category: 'flexbox', example: `.container {
  display: flex;
  /* или inline-flex для строчного */
}` },
  { property: 'flex-direction', description: 'Направление оси', category: 'flexbox', example: `flex-direction: row;          /* → */
flex-direction: row-reverse;  /* ← */
flex-direction: column;       /* ↓ */
flex-direction: column-reverse; /* ↑ */` },
  { property: 'flex-wrap', description: 'Перенос элементов', category: 'flexbox', example: `flex-wrap: nowrap;   /* не переносить */
flex-wrap: wrap;     /* переносить */
flex-wrap: wrap-reverse;` },
  { property: 'justify-content', description: 'Выравнивание по главной оси', category: 'flexbox', example: `justify-content: flex-start;
justify-content: center;
justify-content: flex-end;
justify-content: space-between;
justify-content: space-around;
justify-content: space-evenly;` },
  { property: 'align-items', description: 'Выравнивание по поперечной оси', category: 'flexbox', example: `align-items: stretch;    /* по умолчанию */
align-items: flex-start;
align-items: center;
align-items: flex-end;
align-items: baseline;` },
  { property: 'gap', description: 'Отступы между элементами', category: 'flexbox', example: `gap: 10px;           /* row и column */
gap: 10px 20px;      /* row column */
row-gap: 10px;
column-gap: 20px;` },
  { property: 'flex', description: 'Сокращение flex-grow/shrink/basis', category: 'flexbox', example: `flex: 1;           /* grow: 1, shrink: 1, basis: 0 */
flex: 0 0 auto;    /* не растягивать */
flex: 1 1 200px;   /* база 200px, может расти/сжиматься */` },

  // Grid
  { property: 'display: grid', description: 'Включить grid', category: 'grid', example: `.container {
  display: grid;
}` },
  { property: 'grid-template-columns', description: 'Колонки сетки', category: 'grid', example: `grid-template-columns: 1fr 1fr 1fr;
grid-template-columns: repeat(3, 1fr);
grid-template-columns: 200px 1fr 200px;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));` },
  { property: 'grid-template-rows', description: 'Строки сетки', category: 'grid', example: `grid-template-rows: 100px auto 100px;
grid-template-rows: repeat(3, 1fr);
grid-template-rows: minmax(100px, auto);` },
  { property: 'grid-column/row', description: 'Позиция элемента', category: 'grid', example: `grid-column: 1 / 3;     /* с 1 по 3 линию */
grid-column: span 2;    /* занять 2 колонки */
grid-row: 1 / -1;       /* все строки */` },
  { property: 'place-items', description: 'Выравнивание элементов', category: 'grid', example: `place-items: center;           /* center center */
place-items: start end;        /* align justify */
place-items: stretch;` },
  { property: 'place-content', description: 'Выравнивание контента', category: 'grid', example: `place-content: center;
place-content: space-between;
place-content: start end;` },

  // Transform
  { property: 'transform', description: 'Трансформации', category: 'transform', example: `transform: translateX(100px);
transform: translateY(-50%);
transform: rotate(45deg);
transform: scale(1.5);
transform: skewX(10deg);
transform: rotate(45deg) scale(1.2);` },
  { property: 'translate', description: 'Смещение', category: 'transform', example: `translate: 100px 50px;
translate: 50% -50%;
translate: none;` },
  { property: 'rotate', description: 'Поворот', category: 'transform', example: `rotate: 45deg;
rotate: 0.5turn;
rotate: x 45deg;  /* 3D по оси X */` },
  { property: 'scale', description: 'Масштабирование', category: 'transform', example: `scale: 1.5;
scale: 1.5 2;     /* X Y */
scale: 0.5;` },
  { property: 'transform-origin', description: 'Точка трансформации', category: 'transform', example: `transform-origin: center;      /* по умолчанию */
transform-origin: top left;
transform-origin: 50% 100%;` },

  // Animation
  { property: 'transition', description: 'Плавный переход', category: 'animation', example: `transition: all 0.3s ease;
transition: opacity 0.3s, transform 0.3s;
transition: background-color 0.3s ease-in-out;
transition: none;` },
  { property: 'animation', description: 'Анимация keyframes', category: 'animation', example: `animation: fadeIn 0.3s ease forwards;
animation: spin 1s linear infinite;
animation: bounce 0.5s ease-in-out 3;

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}` },
  { property: 'animation-delay', description: 'Задержка анимации', category: 'animation', example: `animation-delay: 0.5s;
animation-delay: 500ms;
animation-delay: -0.5s; /* начать с середины */` },
  { property: 'animation-iteration-count', description: 'Количество повторений', category: 'animation', example: `animation-iteration-count: 1;
animation-iteration-count: 3;
animation-iteration-count: infinite;` },
]

export const cssCategories: Record<CssProperty['category'], string> = {
  layout: 'Раскладка',
  box: 'Блочная модель',
  typography: 'Типографика',
  visual: 'Визуальные',
  flexbox: 'Flexbox',
  grid: 'Grid',
  transform: 'Трансформации',
  animation: 'Анимации',
}
