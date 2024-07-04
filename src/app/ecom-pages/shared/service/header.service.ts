import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  headerChange: EventEmitter<void> = new EventEmitter<void>()
  constructor() { }

  emitHeaderChange():void{
    this.headerChange.emit();
  }
}
