import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Artist } from '../interfaces/artist';
import { PlaylistRequest } from '../interfaces/playlist-request';
import { Song } from '../interfaces/song';
import { Album } from '../interfaces/album';


const httpOptionsGet = {
  headers: new HttpHeaders({
    'Cache-Control': 'max-age=2592000' //1 month
  })
};
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getStatus(){
    return this.http.get<Artist[]>(`${this.url}/status`,httpOptionsGet);
  }
  getArtists(name: string): Observable<Artist[]>{
    return this.http.get<Artist[]>(`${this.url}/artist?filter=${name}`,httpOptionsGet);
  }

  getArtistAlbums(artistId: string): Observable<Album[]>{
    return this.http.get<Album[]>(`${this.url}/artist/${artistId}/albums`,httpOptionsGet);
  }

  getAlbumSongs(albumId: string): Observable<Song[]>{
    return this.http.get<Song[]>(`${this.url}/album/${albumId}/songs`,httpOptionsGet);
  }

  getLoginUrl(): Observable<string>{
    return this.http.get(`${this.url}/session`, {
      headers:  new HttpHeaders({
        'x-origin': 'CleanPlaylist'
      }),
     responseType: 'text'
    } );
  }

  createPlaylist(code:string, playlist: PlaylistRequest): Observable<string>{
    return this.http.post(`${this.url}/playlist`, JSON.stringify(playlist), {
      headers:  new HttpHeaders({
        'Authorization': code,
        'Content-Type': 'application/json',
        'x-origin': 'CleanPlaylist'
      }),
      responseType: 'text'
    } );
  }
}
