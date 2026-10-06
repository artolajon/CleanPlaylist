import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputError } from 'src/app/interfaces/input-error';

@Component({
    selector: 'app-errors',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.scss'],
    standalone: false
})
export class ErrorsComponent implements OnInit {

  @Input() errors: InputError[]=[];
  @Output() retry: EventEmitter<any> = new EventEmitter();
  showErrors: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  emitRetry(){
    this.retry.emit();
  }

}
