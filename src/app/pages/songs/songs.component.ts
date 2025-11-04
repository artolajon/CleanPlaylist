import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/interfaces/album';
import { Artist } from 'src/app/interfaces/artist';
import { InputError } from 'src/app/interfaces/input-error';
import { Song } from 'src/app/interfaces/song';
import { BlacklistService } from 'src/app/services/blacklist.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {

  input: string | null = null;
  inputElements: string[] = [];
  albums: Album[] = [];
  errors: InputError[] = [];
  loadCompleted: boolean = false;
  alreadyAdded: Song[] = [];
  blacklist: string[];
  counter: number = 0;
  artist: Artist;
  filtersVisible: boolean = false;
  sortDescending: boolean = false;
  filters: { id: string, selected: boolean, description: string }[] = [
    { id: "SORTDESC", selected: true, description: "Newest first" },
    { id: "NOFEAT", selected: false, description: "Only songs that belong to them" },
    { id: "NOALBUMS", selected: false, description: "Only singles" },
    { id: "NOSHORT", selected: false, description: "Remove songs shorter than 1min" },
    { id: "BLACKLIST", selected: true, description: "Apply blacklist words" }
  ];

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService, private router: Router, private blacklistService: BlacklistService) { }

  ngOnInit(): void {
    this.counter = 0;
    this.route.queryParams.subscribe(async params => {
      this.input = params['artist'];
      if (this.input) {
        this.getArtist(this.input);
        this.findAlbums(this.input);
      }
    });

    this.blacklistService.get().subscribe(response => this.blacklist = response);
  }

  getArtist(artistId: string) {
    this.spotifyService.getArtist(artistId).subscribe(response => {
      this.artist = response;
    });
  }

  findAlbums(artistId: string, attemp = 1) {
    this.spotifyService.getArtistAlbums(artistId).subscribe({
      next: async (albums: Album[]) => {
        await this.startSelection(albums);
        this.loadCompleted = true;
      },
      error: (error) => {
        console.error(error);
        if (attemp > 5) {
          this.errors.push({ input: artistId, message: error.message });
        } else {
          //retry
          setTimeout(() => this.findAlbums(artistId, attemp + 1), 3000)
        }
      }
    });
  }

  async startSelection(albums: Album[]) {
    for (let album of albums) {
      album.songs = (await this.spotifyService.getAlbumSongs(album.id).toPromise()).map((song: Song) => {
        song.featArtists = song.artists.filter(songArtist => !album.artists.some(albumArtist => songArtist.id == albumArtist.id));
        return song;
      });
      this.albums.push(album);
      this.counter += album.songs.length;
      this.selectSongs(album);

      if (album.songs.some(c => c.selected) && album.songs.some(c => !c.selected)) {
        album.selected = 'SOME';
      }
      else if (album.songs.some(c => c.selected)) {
        album.selected = 'ALL';
      }
      else {
        album.selected = 'NONE';
      }
    }
    // ensure albums are presented in the selected sort order
    this.sortAlbums();
  }

  /**
   * Sort albums in-place according to release date.
   */
  sortAlbums() {
    this.albums.sort((a: Album, b: Album) => {
      const ta = this.getTimeFromDate(a.releaseDate);
      const tb = this.getTimeFromDate(b.releaseDate);
      let sortDesc = this.filters.find(c => c.id == 'SORTDESC')?.selected;
      return sortDesc ? tb - ta : ta - tb;
    });
  }

  private getTimeFromDate(dateStr: string | undefined): number {
    if (!dateStr) return 0;
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) return parsed;
    // fallback: try parse year-only strings like '2020'
    const y = parseInt(dateStr as string, 10);
    if (!isNaN(y)) return new Date(y, 0, 1).getTime();
    return 0;
  }

  async restartSelection() {
    this.resetSelection();
    this.sortAlbums();
    for (let album of this.albums) {
      this.selectSongs(album);

      if (album.songs.some(c => c.selected) && album.songs.some(c => !c.selected)) {
        album.selected = 'SOME';
      }
      else if (album.songs.some(c => c.selected)) {
        album.selected = 'ALL';
      }
      else {
        album.selected = 'NONE';
      }
    }
  }

  checkAlbum(album: Album) {
    switch (album.selected) {
      case 'ALL': {

        album.songs.forEach(song => {
          song.selected = false;
          this.alreadyAdded = this.alreadyAdded.filter(c => c.id != song.id);
        });
        album.selected = 'NONE';
        break;
      }
      case 'SOME': {
        album.songs.forEach(song => {
          song.selected = true;
          song.reasonForNotSelect = null;
          this.alreadyAdded.push(song);
        });

        album.selected = 'ALL';
        break;
      }
      case 'NONE': {
        this.selectSongs(album);
        album.selected = 'SOME';
        break;
      }
    }
  }

  createPlaylist() {
    let allSelectedSongs: Song[] = [];
    this.albums.forEach(albums => {
      albums.songs.filter(c => c.selected).forEach(song => {
        allSelectedSongs.push(song);
      });
    });

    sessionStorage.setItem('songs', JSON.stringify(allSelectedSongs));
    sessionStorage.setItem('artist_name', this.artist.name);

    this.router.navigate(['/playlist']);

  }

  async retry() {
    for (let i = 0; i < this.errors.length; i++) {
      this.findAlbums(this.errors[i].input);
      if (i % 5 == 0) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    this.errors = [];
  }

  selectSongs(album: Album) {
    if (this.filters.some(c => c.selected && c.id == 'NOALBUMS')) {
      if (album.albumType != 'single') {
        album.songs.forEach(song => song.reasonForNotSelect = 'Not a single');
        return;
      }
    }

    album.songs.forEach(song => {
      let reason = this.getReasonToNotSelect(song);
      // NOSHORT filter: exclude songs shorter than 1min

      song.reasonForNotSelect = reason;
      if (reason == null) {
        this.alreadyAdded.push(song);
        song.selected = true;
      }
    })
  }
  getReasonToNotSelect(song: Song): string | null {
    if (!song.artists.some(c => c.id == this.input)) {
      return `Not their song`;
    }

    if (this.filters.some(c => c.selected && c.id == 'NOSHORT') && song.durationMs < 60000) {
      return 'Shorter than 1min';
    }

    if (this.alreadyAdded.some(c => c.name == song.name)) {
      return "Already added";
    }

    if (this.filters.some(c => c.selected && c.id == 'BLACKLIST')) {
      if (this.blacklist.some(c => song.name.toLowerCase().includes(c))) {
        let word = this.blacklist.find(c => song.name.toLowerCase().includes(c));
        return `Includes word '${word}'`;
      }
    }

    if (this.filters.some(c => c.selected && c.id == 'NOFEAT')) {
      if (song.artists[0].id != this.input) {
        return `Is a feature`;
      }
    }


    return null;
  }

  resetSelection() {
    this.albums.forEach(album => {
      album.songs.forEach(song => {
        song.selected = false;
        song.reasonForNotSelect = null;
      });
      album.selected = 'NONE';
    });
    this.alreadyAdded = [];
  }


  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }
}
