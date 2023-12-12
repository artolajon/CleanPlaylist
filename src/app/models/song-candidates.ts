import { Song } from "../interfaces/song";

export class SongCandidates {
  artist!: string;
  selectedSongs!: Song[] | undefined;
  songList!: Song[];

  constructor(artistId: string, songs: Song[]){
    this.artist = artistId;
    this.songList=songs;
  }

  select(limit: number){
    this.selectedSongs = this.songList.slice(0, limit);
  }
}
