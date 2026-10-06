import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistRequest } from 'src/app/interfaces/playlist-request';
import { Song } from 'src/app/interfaces/song';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
    standalone: false
})
export class PlaylistComponent implements OnInit {

  playlistForm = new FormGroup({
    'name': new FormControl("", [Validators.required, Validators.maxLength(100)]),
    'description': new FormControl("", [Validators.maxLength(255)]),
  });
  playlistUrl: string;
  songs: Song[] = [];
  loading: boolean;
  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService, private router: Router) { }

  ngOnInit(): void {
    let songs = sessionStorage.getItem('songs');
    if (songs){
      this.songs = JSON.parse(songs);
    }
    let artistName = sessionStorage.getItem('artist_name');
    if (artistName){
      this.playlistForm.controls["name"].setValue(artistName);
    }
    else{
      let data = sessionStorage.getItem('data');
      if (data){
        this.playlistForm.patchValue(JSON.parse(data));
      }
    }


    this.route.queryParams.subscribe(params => {
      let spotifyCode = params['code'];
      if (spotifyCode){
        this.savePlaylistOnSpotify(spotifyCode);
      }
    });
  }

  savePlaylistOnSpotify(code: string){
    this.loading=true;
    let playlistData:PlaylistRequest = {
      description: this.playlistForm.value.description as string,
      name: this.playlistForm.value.name as string,
      tracks: this.songs.map(c=>c.uri),
    }

    this.spotifyService.createPlaylist(code, playlistData).subscribe(url=>{
      this.loading=false;
      this.playlistUrl=url;
      window.open(url, "_blank");
    })
  }

  connectToSpotify(){
    sessionStorage.removeItem('artist_name');
    sessionStorage.setItem('data', JSON.stringify(this.playlistForm.value));
    this.loading=true;
    this.spotifyService.getLoginUrl().subscribe(url=>{
      this.loading=false;

      window.location.href = url;
    });
  }

  reset(){
    this.playlistUrl=null;
    this.loading=false;
    this.router.navigate(['/form']);
  }



}
