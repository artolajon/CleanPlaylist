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
  isCustom: boolean = false;

  constructor(private blacklistService: BlacklistService) { }

  ngOnInit() {
    this.loadBlacklist();
  }

  addItem() {
    if (this.newItem.trim()) {
      this.blacklist.push(this.newItem.trim());
      this.newItem = '';
    }
  }

  removeItem(index: number) {
    this.blacklist.splice(index, 1);
  }

  saveBlacklist() {
    this.blacklistService.updateBlacklist(this.blacklist);
    this.isCustom = true;
    alert('Blacklist saved!');
  }

  loadBlacklist() {
    const saved = localStorage.getItem('custom-blacklist');
    if (saved) {
      this.blacklist = JSON.parse(saved);
      this.isCustom = true;
    } else {
      this.blacklistService.getDefaultBlacklist().subscribe(list => {
        this.blacklist = list;
        this.isCustom = false;
      });
    }
  }

  resetBlacklist() {
    localStorage.removeItem('custom-blacklist');
    this.blacklistService.getDefaultBlacklist().subscribe(list => {
      this.blacklist = list;
      this.isCustom = false;
    });
  }
}
