import { Component, Input, OnInit } from '@angular/core';
import { ArtistCandidate } from 'src/app/models/artist-candidate';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss']
})
export class ArtistCardComponent implements OnInit {

  @Input()
  artist!: ArtistCandidate;
  @Input()
  showInput: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
