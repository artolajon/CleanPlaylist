import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  artistsForm = new FormGroup({
    'names': new FormControl("", Validators.required)
  });

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  searchArtists(){
    let input = (this.artistsForm.value.names as string).replace(/\n/g, ',');
    let artistList = input.split(',').map(c=> c.trim()).filter(c=> c);

    this.router.navigate(['/artists'],{queryParams: {names: artistList.join()}})
  }

}
