import { ExternalUrls } from "./external-urls"
import { SimplifiedArtist } from "./simplified-artist"
import { Image } from "./image"
import { Restrictions } from "./restrictions"

export interface Album {
  albumGroup: string
  albumType: string
  artists: SimplifiedArtist[]
  availableMarkets: string[]
  externalUrls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  releaseDate: string
  releaseDatePrecision: string
  restrictions: Restrictions
  totalTracks: number
  type: string
  uri: string
}
