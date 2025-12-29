const DB_NAME = 'web-music-player'
const STORE = 'player'
const KEY = 'state'
const POSITION_KEY = 'position'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE)
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function savePlayerState(state: unknown) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).put(state, KEY)
}

export async function loadPlayerState<T>(): Promise<T | null> {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readonly')
  const req = tx.objectStore(STORE).get(KEY)

  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror = () => resolve(null)
  })
}

export async function savePlaybackPosition(trackId: string, position: number) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).put({ trackId, position}, POSITION_KEY)
}

export async function loadPlaybackPosition(): Promise<{
    trackId: string
    position: number
} | null> {
    const db = await openDB()
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(POSITION_KEY)

    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror = () => resolve(null)
    })
}