import { ExternalIds } from "./external-ids"
import { ExternalUrls } from "./external-urls"
import { LinkedFrom } from "./linked-from"
import { Restrictions } from "./restrictions"
import { SimplifiedArtist } from "./simplified-artist"

export interface Song {
  artists: SimplifiedArtist[]
  availableMarkets: string[]
  discNumber: number
  durationMs: number
  explicit: boolean
  externalIds: ExternalIds
  externalUrls: ExternalUrls
  href: string
  id: string
  isPlayable: boolean
  linkedFrom: LinkedFrom
  restrictions: Restrictions
  name: string
  popularity: number
  previewUrl: string
  trackNumber: number
  type: number
  uri: string
  isLocal: boolean
  selected: boolean
  reasonForNotSelect: string
  featArtists: SimplifiedArtist[]
}
