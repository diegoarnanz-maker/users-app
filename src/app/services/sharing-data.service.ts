import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private _newUserEventEmitter: EventEmitter<User> = new EventEmitter();
  private _idUserEventemitter = new EventEmitter();
  // private _editUserEventemitter = new EventEmitter();
  private _findUserByIdEventemitter = new EventEmitter();
  private _selectedUserEventEmitter: EventEmitter<User> = new EventEmitter();
  private _pageUsersEventEmitter = new EventEmitter();
  private _handlerLoginEventEmitter = new EventEmitter();
  
  findUserById: any;

  constructor() { }

  get newUserEventEmitter(): EventEmitter<User> {
    return this._newUserEventEmitter;
  }

  get idUserEventemitter(): EventEmitter<number> {
    return this._idUserEventemitter;
  }

  // get editUserEventemitter(): EventEmitter<User> {
  //   return this._editUserEventemitter;
  // }

  get findUserByIdEventemitter(): EventEmitter<number> {
    return this._findUserByIdEventemitter;
  }

  get selectedUserEventEmitter(): EventEmitter<User> {
    return this._selectedUserEventEmitter;
  }

  get pageUsersEventEmitter() {
    return this._pageUsersEventEmitter;
  }

  get handlerLoginEventEmitter() {
    return this._handlerLoginEventEmitter;
  }
}
