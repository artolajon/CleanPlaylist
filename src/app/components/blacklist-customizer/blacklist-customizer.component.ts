import { Component, OnInit } from '@angular/core';
import { BlacklistService } from '../../services/blacklist.service';

@Component({
  selector: 'app-blacklist-customizer',
  templateUrl: './blacklist-customizer.component.html',
  styleUrls: ['./blacklist-customizer.component.scss']
})
export class BlacklistCustomizerComponent implements OnInit {
  blacklist: string[] = [];
  newItem: string = '';
  isSaved: boolean = false;


  constructor(private blacklistService: BlacklistService) { }

  ngOnInit() {
    this.loadBlacklist();
  }

  addItem() {
    if (this.newItem.trim()) {
      this.isSaved = false;
      this.blacklist.push(this.newItem.trim());
      this.newItem = '';
    }
  }

  removeItem(index: number) {
    this.blacklist.splice(index, 1);
    this.isSaved = false;
  }

  saveBlacklist() {
    this.blacklistService.updateBlacklist(this.blacklist);
    this.isSaved = true;
  }

  loadBlacklist() {
    const saved = localStorage.getItem('custom-blacklist');
    if (saved) {
      this.blacklist = JSON.parse(saved);
    } else {
      this.blacklistService.getDefaultBlacklist().subscribe(list => {
        this.blacklist = list;
      });
    }
  }

  resetBlacklist() {
    localStorage.removeItem('custom-blacklist');
    this.blacklistService.getDefaultBlacklist().subscribe(list => {
      this.blacklist = list;
      this.isSaved = false;
    });
  }
}
