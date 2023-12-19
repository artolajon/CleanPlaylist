import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {

  csvUrl = 'assets/data/blacklist';
  constructor(private http: HttpClient) { }

  getCustomBlacklist(){
    let blacklist = localStorage.getItem('custom-blacklist');
    if (blacklist)
    {
      return JSON.parse(blacklist);
    }
    return null;
  }

  getDefaultBlacklist(){
    return this.http.get('assets/data/blacklist.txt',{responseType: 'text'}).pipe(map(response=> response.split('\r\n')));
  }

  updateBlacklist(blacklist: string[]){
    localStorage.setItem('custom-blacklist', JSON.stringify(blacklist));
  }
}
