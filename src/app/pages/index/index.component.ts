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
    'name': new FormControl("", Validators.required)
  });

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  searchArtists(){
    let input = (this.artistsForm.value.name as string).replace(/\n/g, ',');

    this.router.navigate(['/artist'],{queryParams: {name: input}});
  }

}
