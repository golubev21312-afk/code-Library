import { useFavoritesStore, selectIsFavorite, selectFavoriteIds, selectFavoritesCount } from '../favoritesStore'

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favoriteIds: [] })
  })

  describe('toggleFavorite', () => {
    it('adds an id when not in favorites', () => {
      useFavoritesStore.getState().toggleFavorite('snippet-1')
      expect(useFavoritesStore.getState().favoriteIds).toEqual(['snippet-1'])
    })

    it('removes an id when already in favorites', () => {
      useFavoritesStore.setState({ favoriteIds: ['snippet-1'] })
      useFavoritesStore.getState().toggleFavorite('snippet-1')
      expect(useFavoritesStore.getState().favoriteIds).toEqual([])
    })
  })

  describe('addFavorite', () => {
    it('adds a new id', () => {
      useFavoritesStore.getState().addFavorite('snippet-1')
      expect(useFavoritesStore.getState().favoriteIds).toEqual(['snippet-1'])
    })

    it('does not duplicate an existing id', () => {
      useFavoritesStore.setState({ favoriteIds: ['snippet-1'] })
      useFavoritesStore.getState().addFavorite('snippet-1')
      expect(useFavoritesStore.getState().favoriteIds).toEqual(['snippet-1'])
    })
  })

  describe('removeFavorite', () => {
    it('removes an existing id', () => {
      useFavoritesStore.setState({ favoriteIds: ['snippet-1', 'snippet-2'] })
      useFavoritesStore.getState().removeFavorite('snippet-1')
      expect(useFavoritesStore.getState().favoriteIds).toEqual(['snippet-2'])
    })

    it('does nothing if id is not in favorites', () => {
      useFavoritesStore.setState({ favoriteIds: ['snippet-1'] })
      useFavoritesStore.getState().removeFavorite('snippet-99')
      expect(useFavoritesStore.getState().favoriteIds).toEqual(['snippet-1'])
    })
  })

  describe('clearFavorites', () => {
    it('removes all favorites', () => {
      useFavoritesStore.setState({ favoriteIds: ['a', 'b', 'c'] })
      useFavoritesStore.getState().clearFavorites()
      expect(useFavoritesStore.getState().favoriteIds).toEqual([])
    })
  })

  describe('isFavorite', () => {
    it('returns true for a favorited id', () => {
      useFavoritesStore.setState({ favoriteIds: ['snippet-1'] })
      expect(useFavoritesStore.getState().isFavorite('snippet-1')).toBe(true)
    })

    it('returns false for a non-favorited id', () => {
      expect(useFavoritesStore.getState().isFavorite('snippet-1')).toBe(false)
    })
  })

  describe('count', () => {
    it('returns the number of favorites', () => {
      useFavoritesStore.setState({ favoriteIds: ['a', 'b'] })
      expect(useFavoritesStore.getState().count()).toBe(2)
    })
  })

  describe('selectors', () => {
    it('selectFavoriteIds returns favoriteIds', () => {
      const state = { favoriteIds: ['a', 'b'] } as ReturnType<typeof useFavoritesStore.getState>
      expect(selectFavoriteIds(state)).toEqual(['a', 'b'])
    })

    it('selectFavoritesCount returns length', () => {
      const state = { favoriteIds: ['a', 'b', 'c'] } as ReturnType<typeof useFavoritesStore.getState>
      expect(selectFavoritesCount(state)).toBe(3)
    })

    it('selectIsFavorite returns true/false correctly', () => {
      const state = { favoriteIds: ['a'] } as ReturnType<typeof useFavoritesStore.getState>
      expect(selectIsFavorite('a')(state)).toBe(true)
      expect(selectIsFavorite('b')(state)).toBe(false)
    })
  })
})
