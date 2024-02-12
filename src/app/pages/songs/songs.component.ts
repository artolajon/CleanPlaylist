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

  input: string|null = null;
  inputElements: string[] = [];
  albums: Album[] = [];
  errors: InputError[] = [];
  loadCompleted: boolean = false;
  alreadyAdded:Song[] = [];
  blacklist: string[];
  counter: number = 0;
  artist: Artist;


  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService, private router: Router, private blacklistService: BlacklistService ) { }

  ngOnInit(): void {
    this.counter=0;
    this.route.queryParams.subscribe(async params => {
      this.input = params['artist'];
      if (this.input){
          this.getArtist(this.input);
          this.findAlbums(this.input);
      }
    });

    this.blacklistService.get().subscribe(response =>this.blacklist = response);
  }

  getArtist(artistId: string) {
     this.spotifyService.getArtist(artistId).subscribe(response => {
      this.artist = response;
     });
  }

  findAlbums(artistId: string, attemp=1){
    this.spotifyService.getArtistAlbums(artistId).subscribe({
      next: async (albums: Album[]) =>{

        for(let album of albums){
          album.songs = (await this.spotifyService.getAlbumSongs(album.id).toPromise()).map((song: Song)=>{
            song.featArtists = song.artists.filter(songArtist=> !album.artists.some(albumArtist=>songArtist.id == albumArtist.id));
            return song;
          });
          this.albums.push(album);
          this.counter += album.songs.length;
          this.selectSongs(album);

          if (album.songs.some(c=> c.selected) && album.songs.some(c=> !c.selected)){
            album.selected = 'SOME';
          }
          else if (album.songs.some(c=> c.selected)){
            album.selected = 'ALL';
          }
          else{
            album.selected = 'NONE';
          }
        }
        this.loadCompleted = true;
      },
      error: (error)=>{
        console.error(error);
        if (attemp>5){
          this.errors.push({input: artistId, message:error.message});
        }else{
          //retry
          setTimeout(()=> this.findAlbums(artistId, attemp+1), 3000)
        }
      }});
  }

  checkAlbum(album: Album){
    switch (album.selected) {
      case 'ALL': {

        album.songs.forEach(song=> {
          song.selected=false;
          this.alreadyAdded = this.alreadyAdded.filter(c=> c.id!=song.id);
        });
        album.selected = 'NONE';
        break;
      }
      case 'SOME': {
        album.songs.forEach(song=> {
          song.selected=true;
          song.reasonForNotSelect=null;
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

  createPlaylist(){
    let allSelectedSongs:Song[] = [];
    this.albums.forEach(albums=>{
      albums.songs.filter(c=> c.selected).forEach(song=>{
        allSelectedSongs.push(song);
      });
    });

    sessionStorage.setItem('songs', JSON.stringify(allSelectedSongs));
    sessionStorage.setItem('artist_name',  this.artist.name);

    this.router.navigate(['/playlist']);

  }

  async retry(){
    for(let i = 0; i<this.errors.length; i++){
      this.findAlbums(this.errors[i].input);
      if (i % 5 == 0){
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    this.errors=[];
  }

  selectSongs(album: Album){
    album.songs.forEach(song=>{

      let reason = this.getReasonToNotSelect(song);

      song.reasonForNotSelect = reason;
      if(reason == null){
        this.alreadyAdded.push(song);
        song.selected=true;
      }
    })
  }
  getReasonToNotSelect(song: Song): string | null {
    if (!song.artists.some(c=> c.id == this.input)){
      return `Not their song`;
    }

    if (this.alreadyAdded.some(c=> c.name==song.name)){
      return "Already added";
    }

    if (this.blacklist.some(c=> song.name.toLowerCase().includes(c))){
      let word = this.blacklist.find(c=> song.name.toLowerCase().includes(c));
      return `Includes word '${word}'`;
    }
    return null;
  }

}
