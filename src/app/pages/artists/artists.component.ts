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


  constructor() { }

  ngOnInit(): void {

  }



}
