import { ExternalUrls } from "./external-urls"

export interface SimplifiedArtist {
  externalUrls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}
