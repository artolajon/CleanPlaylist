import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {

  csvUrl = 'assets/data/blacklist';
  constructor(private http: HttpClient) { }

  get(): Observable<string[]>{
    let blacklist = this.getCustomBlacklist();
    if (blacklist)
    {
      return blacklist;
    }
    return this.getDefaultBlacklist();
  }
  getCustomBlacklist(): Observable<string[]>{
    let blacklist = localStorage.getItem('custom-blacklist');
    if (blacklist)
    {
      let list = JSON.parse(blacklist);
      return list.filter(c=> c && c!='')
    }
    return null;
  }

  getDefaultBlacklist(): Observable<string[]>{
    return this.http.get('assets/data/blacklist.txt',{responseType: 'text'}).pipe(map((response:string)=> response.split('\r\n').filter(c=> c && c!='')));
  }

  updateBlacklist(blacklist: string[]){
    localStorage.setItem('custom-blacklist', JSON.stringify(blacklist));
  }
}
