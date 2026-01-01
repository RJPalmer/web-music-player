export type Track = {
  id: string
  src: string

  title: string
  artist: string
  album?: string
  duration?: number
  artwork?: string
  source?: 'upload' | 'library'
  available?: boolean
}