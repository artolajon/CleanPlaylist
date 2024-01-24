import { Component } from '@angular/core';
import { SpotifyService } from './services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CleanPlaylist | Full Discography Playlist Generator';
  year = new Date().getFullYear();

  constructor(private spotifyService: SpotifyService){
    spotifyService.getStatus().subscribe(result =>{
      console.log("Server active");
    });
  }
}
