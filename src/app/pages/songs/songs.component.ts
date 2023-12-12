import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, retry } from 'rxjs';
import { InputError } from 'src/app/interfaces/input-error';
import { Song } from 'src/app/interfaces/song';
import { SongCandidates } from 'src/app/models/song-candidates';
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
  playlist: Song[] = [];
  artistSongs: SongCandidates[] = [];
  songNumberLimit$ = new BehaviorSubject<number>(5);
  songNumberLimit = 5;
  errors: InputError[] = [];


  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.input = params['artists'];
      if (this.input){
        this.inputElements=this.input.split(',');

        for(let i = 0; i<this.inputElements.length; i++){
          this.findSongs(this.inputElements[i]);
          if (i % 5 == 0){
            await new Promise(r => setTimeout(r, 2000));
          }
        }
      }
    });

    this.songNumberLimit$.subscribe(c=>{
      setTimeout(()=>{
        this.calculatePlaylistLength();
      }, 100)

    })
  }

  findSongs(artistId: string, attemp=1){
    this.spotifyService.getTopSongs(artistId).subscribe({
      next: (songs: Song[]) =>{
        let songsList = new SongCandidates(artistId, songs);
        this.songNumberLimit$.subscribe(limit=>{
          songsList.select(limit);
        })
        this.artistSongs.push(songsList);

      },
      error: (error)=>{
        console.error(error);
        if (attemp>5){
          this.errors.push({input: artistId, message:error.error});
        }else{
          //retry
          setTimeout(()=> this.findSongs(artistId, attemp+1), 3000)
        }
      }});
  }

  editLimit(){
    this.songNumberLimit$.next(this.songNumberLimit);
  }

  calculatePlaylistLength(){

    let miliseconds=0;
    let songsCount=0;
    this.artistSongs.forEach(artist=>{
      artist.selectedSongs?.forEach(song=>{
        songsCount++;
        miliseconds += song.durationMs;
      })
    })
    let minutes = miliseconds / 1000 / 60;

    console.log({songsCount, miliseconds, minutes })
  }

  createPlaylist(){
    let allSelectedSongs:Song[] = [];
    this.artistSongs.forEach(artist=>{
      artist.selectedSongs?.forEach(song=>{
        allSelectedSongs.push(song);
      });
    });

    sessionStorage.setItem('songs', JSON.stringify(allSelectedSongs));

    this.router.navigate(['/playlist']);

  }

  async retry(){
    for(let i = 0; i<this.errors.length; i++){
      this.findSongs(this.errors[i].input);
      if (i % 5 == 0){
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    this.errors=[];
  }

}
