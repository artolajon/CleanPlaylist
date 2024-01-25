import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, retry } from 'rxjs';
import { Album } from 'src/app/interfaces/album';
import { InputError } from 'src/app/interfaces/input-error';
import { Song } from 'src/app/interfaces/song';
import { SongCandidates } from 'src/app/models/song-candidates';
import { BlacklistService } from 'src/app/services/blacklist.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { v4 as uuidv4 } from 'uuid';

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


  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService, private router: Router, private blacklistService: BlacklistService ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.input = params['artist'];
      if (this.input){
          this.findAlbums(this.input);
      }
    });

    this.blacklistService.get().subscribe(response =>{this.blacklist = response; console.log(this.blacklist) });
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
        }
        this.selectSongs();
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

  createPlaylist(){
    let allSelectedSongs:Song[] = [];
    this.albums.forEach(albums=>{
      albums.songs.filter(c=> c.selected).forEach(song=>{
        allSelectedSongs.push(song);
      });
    });

    sessionStorage.setItem('songs', JSON.stringify(allSelectedSongs));

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

  selectSongs(){


    this.albums.forEach(album=>{
      album.songs.forEach(song=>{

        let reason = this.getReasonToNotSelect(song);

        if(reason == null){
          this.alreadyAdded.push(song);
          song.selected=true;
        }else{
          song.reasonForNotSelect = reason;
        }
      })
    })
  }
  getReasonToNotSelect(song: Song): string | null {
    if (this.alreadyAdded.some(c=> c.name==song.name)){
      return "Already added";
    }

    if (this.blacklist.some(c=> song.name.toLowerCase().includes(c))){
      let word = this.blacklist.find(c=> song.name.toLowerCase().includes(c));
      return `Includes word '${word}'`;
    }

    if (!song.artists.some(c=> c.id == this.input)){
      return `Not their song`;
    }
    return null;
  }

}
