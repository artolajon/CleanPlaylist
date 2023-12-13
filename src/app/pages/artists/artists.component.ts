import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from 'src/app/interfaces/artist';
import { InputError } from 'src/app/interfaces/input-error';
import { ArtistCandidate } from 'src/app/models/artist-candidate';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {

  input: string|null = null;
  inputElements: string[] = [];
  foundArtist: ArtistCandidate;
  errors: InputError[] = [];


  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService, private router: Router ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.input = params['name'];
      if (this.input){
        this.findName(this.input);
      }
    });
  }

  findName(name: string, attemp = 1){
    this.spotifyService.getArtists(name).subscribe({
      next: (foundArtists: Artist[]) =>{
        let artist = new ArtistCandidate(name, foundArtists);
        this.foundArtist = artist;
      },
      error: (error)=>{
        console.error(error);
        if (attemp>5){
          this.errors.push({input: name, message:error.error});
        }else{
          //retry
          setTimeout(()=> this.findName(name, attemp+1), 3000)
        }
      }});
  }

  searchForSongs(){
    this.router.navigate(['/songs'],{queryParams: {artist: this.foundArtist.selected.id}});
  }

  async retry(){
    for(let i = 0; i<this.errors.length; i++){
      this.findName(this.errors[i].input);
      if (i % 5 == 0){
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    this.errors=[];
  }

}
