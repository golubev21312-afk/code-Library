import type { Snippet } from '@/types'

export const domManipulation: Snippet[] = [
  {
    id: 'js-query-selectors',
    title: 'Современные селекторы',
    description: 'querySelector, closest и matches',
    code: `// querySelector и querySelectorAll
const button = document.querySelector('button.primary')
const allButtons = document.querySelectorAll('button')

// Поиск внутри элемента
const form = document.querySelector('form')
const inputs = form?.querySelectorAll('input')

// closest - поиск вверх по дереву
button?.addEventListener('click', (e) => {
  const card = e.target.closest('.card')
  const row = e.target.closest('tr')
  console.log('Clicked in card:', card)
})

// matches - проверка селектора
function handleClick(e) {
  if (e.target.matches('button.delete')) {
    deleteItem(e.target.dataset.id)
  }
  if (e.target.matches('button.edit')) {
    editItem(e.target.dataset.id)
  }
}

// Делегирование событий с matches
document.querySelector('.list').addEventListener('click', (e) => {
  const item = e.target.closest('.list-item')
  if (!item) return

  if (e.target.matches('.delete-btn')) {
    item.remove()
  } else if (e.target.matches('.edit-btn')) {
    editItem(item.dataset.id)
  }
})

// :scope для относительных селекторов
const parent = document.querySelector('.parent')
const directChildren = parent?.querySelectorAll(':scope > .child')

// has() в JS (проверка наличия потомка)
const cardsWithImages = document.querySelectorAll('.card:has(img)')

// Комбинированные селекторы
const activeItems = document.querySelectorAll(
  '.item:not(.disabled):not([hidden])'
)

// contains - проверка содержит ли элемент другой
const parent = document.querySelector('.container')
const child = document.querySelector('.item')
console.log(parent?.contains(child)) // true/false`,
    language: 'js',
    level: 'beginner',
    tags: ['javascript', 'dom', 'selectors', 'events'],
    whyRelevant2026: ':has() селектор теперь доступен и в JS',
    related: ['js-event-delegation', 'js-dom-traversal']
  },
  {
    id: 'js-dom-manipulation',
    title: 'Манипуляции с DOM',
    description: 'Создание и модификация элементов',
    code: `// Создание элементов
const div = document.createElement('div')
div.className = 'card'
div.id = 'card-1'
div.textContent = 'Hello'

// innerHTML vs textContent
div.innerHTML = '<span>Hello</span>' // Парсит HTML
div.textContent = '<span>Hello</span>' // Просто текст

// Атрибуты
div.setAttribute('data-id', '123')
div.getAttribute('data-id') // '123'
div.dataset.id // '123' (для data-*)
div.removeAttribute('data-id')

// Классы
div.classList.add('active', 'visible')
div.classList.remove('hidden')
div.classList.toggle('selected')
div.classList.toggle('active', isActive) // force
div.classList.replace('old', 'new')
div.classList.contains('active') // true

// Стили
div.style.color = 'red'
div.style.cssText = 'color: red; font-size: 16px;'
div.style.setProperty('--custom-color', 'blue')
getComputedStyle(div).getPropertyValue('color')

// Вставка элементов
parent.appendChild(div)
parent.prepend(div) // В начало
parent.append(div1, div2, 'text') // Несколько + текст
parent.insertBefore(newElement, referenceElement)

// insertAdjacentHTML/Element/Text
element.insertAdjacentHTML('beforebegin', '<div>Before</div>')
element.insertAdjacentHTML('afterbegin', '<div>First child</div>')
element.insertAdjacentHTML('beforeend', '<div>Last child</div>')
element.insertAdjacentHTML('afterend', '<div>After</div>')

// Удаление
element.remove()
parent.removeChild(child)

// Клонирование
const clone = element.cloneNode(true) // true = глубокое

// DocumentFragment для batch операций
const fragment = document.createDocumentFragment()
items.forEach(item => {
  const li = document.createElement('li')
  li.textContent = item
  fragment.appendChild(li)
})
list.appendChild(fragment) // Один reflow

// Замена
parent.replaceChild(newChild, oldChild)
oldElement.replaceWith(newElement)`,
    language: 'js',
    level: 'beginner',
    tags: ['javascript', 'dom', 'manipulation', 'elements'],
    whyRelevant2026: 'Понимание DOM необходимо даже при использовании фреймворков',
    related: ['js-query-selectors', 'js-template-literals']
  },
  {
    id: 'js-intersection-observer',
    title: 'Intersection Observer',
    description: 'Отслеживание видимости элементов',
    code: `// Базовое использование
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Element is visible:', entry.target)
      entry.target.classList.add('visible')
    }
  })
})

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el)
})

// С опциями
const options = {
  root: null, // viewport (или конкретный элемент)
  rootMargin: '0px 0px -100px 0px', // отступы
  threshold: [0, 0.25, 0.5, 0.75, 1] // пороги видимости
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    console.log(\`\${entry.target.id}: \${entry.intersectionRatio * 100}% visible\`)
  })
}, options)

// Lazy loading изображений
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.classList.remove('lazy')
      observer.unobserve(img) // Отписываемся после загрузки
    }
  })
}, { rootMargin: '100px' }) // Preload за 100px до видимости

document.querySelectorAll('img.lazy').forEach(img => {
  imageObserver.observe(img)
})

// Infinite scroll
const sentinel = document.querySelector('.sentinel')

const scrollObserver = new IntersectionObserver(async (entries) => {
  if (entries[0].isIntersecting) {
    await loadMoreItems()
  }
}, { rootMargin: '200px' })

scrollObserver.observe(sentinel)

// Анимация прогресса чтения
const article = document.querySelector('article')

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const progress = 1 - entry.intersectionRatio
    document.querySelector('.progress-bar').style.width =
      \`\${progress * 100}%\`
  })
}, {
  threshold: Array.from({ length: 100 }, (_, i) => i / 100)
}).observe(article)`,
    language: 'js',
    level: 'intermediate',
    tags: ['javascript', 'dom', 'intersection-observer', 'lazy-loading'],
    whyRelevant2026: 'Intersection Observer - стандарт для lazy loading и анимаций',
    related: ['js-mutation-observer', 'js-resize-observer']
  },
  {
    id: 'js-mutation-observer',
    title: 'Mutation Observer',
    description: 'Отслеживание изменений в DOM',
    code: `// Базовое использование
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log('Mutation type:', mutation.type)
    console.log('Target:', mutation.target)

    if (mutation.type === 'childList') {
      console.log('Added:', mutation.addedNodes)
      console.log('Removed:', mutation.removedNodes)
    }

    if (mutation.type === 'attributes') {
      console.log('Attribute:', mutation.attributeName)
      console.log('Old value:', mutation.oldValue)
    }
  })
})

// Конфигурация
const config = {
  childList: true,      // Изменения дочерних элементов
  subtree: true,        // Включая потомков
  attributes: true,     // Изменения атрибутов
  attributeOldValue: true,
  attributeFilter: ['class', 'data-id'], // Только эти атрибуты
  characterData: true,  // Изменения текста
  characterDataOldValue: true
}

observer.observe(document.body, config)

// Отслеживание добавления элементов
const containerObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Инициализация нового элемента
        if (node.matches('.lazy-image')) {
          initLazyImage(node)
        }
        // Проверка потомков
        node.querySelectorAll('.lazy-image').forEach(initLazyImage)
      }
    }
  }
})

containerObserver.observe(document.body, {
  childList: true,
  subtree: true
})

// Отслеживание изменения темы
new MutationObserver((mutations) => {
  const mutation = mutations.find(m => m.attributeName === 'class')
  if (mutation) {
    const isDark = document.documentElement.classList.contains('dark')
    updateChartTheme(isDark)
  }
}).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
})

// Disconnect когда не нужен
function cleanup() {
  observer.disconnect()
}

// takeRecords - получить pending mutations
const pending = observer.takeRecords()`,
    language: 'js',
    level: 'advanced',
    tags: ['javascript', 'dom', 'mutation-observer', 'reactive'],
    whyRelevant2026: 'MutationObserver незаменим для интеграции с third-party кодом',
    related: ['js-intersection-observer', 'js-resize-observer']
  },
  {
    id: 'js-resize-observer',
    title: 'Resize Observer',
    description: 'Отслеживание изменения размеров элементов',
    code: `// Базовое использование
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect

    console.log(\`Size: \${width}x\${height}\`)

    // Адаптивная логика
    if (width < 400) {
      entry.target.classList.add('compact')
    } else {
      entry.target.classList.remove('compact')
    }
  }
})

observer.observe(document.querySelector('.resizable'))

// Несколько типов размеров
const detailedObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    // contentRect - размер контента
    console.log('Content:', entry.contentRect.width, entry.contentRect.height)

    // contentBoxSize - с учётом writing-mode
    if (entry.contentBoxSize) {
      const [size] = entry.contentBoxSize
      console.log('Content box:', size.inlineSize, size.blockSize)
    }

    // borderBoxSize - включая padding и border
    if (entry.borderBoxSize) {
      const [size] = entry.borderBoxSize
      console.log('Border box:', size.inlineSize, size.blockSize)
    }

    // devicePixelContentBoxSize - в пикселях устройства
    if (entry.devicePixelContentBoxSize) {
      const [size] = entry.devicePixelContentBoxSize
      console.log('Device pixels:', size.inlineSize, size.blockSize)
    }
  }
})

// Адаптивный chart
class ResponsiveChart {
  constructor(container) {
    this.container = container
    this.observer = new ResizeObserver(this.handleResize.bind(this))
    this.observer.observe(container)
  }

  handleResize(entries) {
    const { width, height } = entries[0].contentRect
    this.chart.resize(width, height)
  }

  destroy() {
    this.observer.disconnect()
  }
}

// Container queries в JS
const containerObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { inlineSize } = entry.contentBoxSize[0]

    entry.target.dataset.size =
      inlineSize < 300 ? 'sm' :
      inlineSize < 600 ? 'md' : 'lg'
  }
})

document.querySelectorAll('[data-container]').forEach(el => {
  containerObserver.observe(el)
})`,
    language: 'js',
    level: 'intermediate',
    tags: ['javascript', 'dom', 'resize-observer', 'responsive'],
    whyRelevant2026: 'ResizeObserver - основа для container queries в JS',
    related: ['js-intersection-observer', 'js-mutation-observer']
  }
]

export default domManipulation
