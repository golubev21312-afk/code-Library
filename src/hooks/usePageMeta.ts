import { useEffect } from 'react'

interface PageMeta {
  title: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogType?: string
}

const SITE_NAME = 'Code Library'
const DEFAULT_DESCRIPTION =
  'Библиотека 215+ сниппетов для React, TypeScript, JavaScript, CSS и HTML'

function setMetaTag(name: string, content: string, attribute = 'name') {
  let el = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attribute, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function usePageMeta({ title, description, ogTitle, ogDescription, ogType }: PageMeta) {
  useEffect(() => {
    const prev = document.title
    document.title = `${title} — ${SITE_NAME}`

    const desc = description ?? DEFAULT_DESCRIPTION
    setMetaTag('description', desc)
    setMetaTag('og:title', ogTitle ?? title, 'property')
    setMetaTag('og:description', ogDescription ?? desc, 'property')
    setMetaTag('og:type', ogType ?? 'website', 'property')
    setMetaTag('og:site_name', SITE_NAME, 'property')

    return () => {
      document.title = prev
    }
  }, [title, description, ogTitle, ogDescription, ogType])
}
