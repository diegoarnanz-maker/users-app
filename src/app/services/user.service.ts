import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [];
  private url: string = 'http://ec2-13-60-24-108.eu-north-1.compute.amazonaws.com:4000/api/users';


  constructor(private http: HttpClient) { }

  findAll(): Observable<User[]> {
    // return of(this.users);
    // return this.http.get('http://localhost:4000/api/users').pipe(
    //   map((users: any) => users as User[])
    // );
    return this.http.get<User[]>(this.url);
  }

  findAllPageable(page: number): Observable<any> {
    return this.http.get<any>(`${this.url}/page/${page}`);
  }

  findById(id: number): Observable<User> {
    // return this.http.get<User>(this.url + '/' + id);
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }

  remove(id: number): Observable<any> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
