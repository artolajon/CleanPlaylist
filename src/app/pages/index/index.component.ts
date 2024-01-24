import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Artist } from 'src/app/interfaces/artist';
import { InputError } from 'src/app/interfaces/input-error';
import { ArtistCandidate } from 'src/app/models/artist-candidate';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  artistsForm = new FormGroup({
    'name': new FormControl("", Validators.required)
  });
  input: string|null = null;
  inputElements: string[] = [];
  foundArtists: Artist[];
  errors: InputError[] = [];
  searching: boolean;

  constructor(private router: Router, private spotifyService: SpotifyService) { }

  ngOnInit(): void {
  }

  searchArtists(){
    let input = this.artistsForm.value.name as string;
    if (input != null){
      this.findName(input);
    }
  }

  findName(name: string, attemp = 1){
    this.searching = true;
    this.spotifyService.getArtists(name).subscribe({
      next: (foundArtists: Artist[]) =>{
        this.searching = false;
        this.foundArtists = foundArtists;

      },
      error: (error)=>{
        console.error(error);
        if (attemp>5){
          this.errors.push({input: name, message:error.message});
          this.searching = false;
        }else{
          //retry
          setTimeout(()=> this.findName(name, attemp+1), 3000)
        }
      }});
  }

  searchForSongs(artistId: string){
    this.router.navigate(['/songs'],{queryParams: {artist: artistId}});
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
