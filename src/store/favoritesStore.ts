import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const STORAGE_KEY = 'favorites-storage'

interface FavoritesState {
  /** Set ID избранных сниппетов */
  favoriteIds: string[]

  /** Переключить избранное */
  toggleFavorite: (id: string) => void

  /** Проверить, в избранном ли сниппет */
  isFavorite: (id: string) => boolean

  /** Получить все ID избранных */
  getFavorites: () => string[]

  /** Добавить в избранное */
  addFavorite: (id: string) => void

  /** Удалить из избранного */
  removeFavorite: (id: string) => void

  /** Очистить все избранное */
  clearFavorites: () => void

  /** Количество избранных */
  count: () => number
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (id) => {
        const { favoriteIds } = get()
        const isCurrentlyFavorite = favoriteIds.includes(id)

        set({
          favoriteIds: isCurrentlyFavorite
            ? favoriteIds.filter((fid) => fid !== id)
            : [...favoriteIds, id],
        })
      },

      isFavorite: (id) => {
        return get().favoriteIds.includes(id)
      },

      getFavorites: () => {
        return get().favoriteIds
      },

      addFavorite: (id) => {
        const { favoriteIds } = get()
        if (!favoriteIds.includes(id)) {
          set({ favoriteIds: [...favoriteIds, id] })
        }
      },

      removeFavorite: (id) => {
        set({
          favoriteIds: get().favoriteIds.filter((fid) => fid !== id),
        })
      },

      clearFavorites: () => {
        set({ favoriteIds: [] })
      },

      count: () => {
        return get().favoriteIds.length
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
)

// === Хук для удобного использования ===

export function useFavorites() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const addFavorite = useFavoritesStore((state) => state.addFavorite)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites)

  const isFavorite = (id: string) => favoriteIds.includes(id)
  const count = favoriteIds.length

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    count,
  }
}

// === Селекторы для оптимизации ререндеров ===

export const selectFavoriteIds = (state: FavoritesState) => state.favoriteIds
export const selectFavoritesCount = (state: FavoritesState) => state.favoriteIds.length
export const selectIsFavorite = (id: string) => (state: FavoritesState) =>
  state.favoriteIds.includes(id)
