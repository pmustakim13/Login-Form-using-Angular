import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  

  private localUsers: any[] = [];
  private hasFetched = false;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    if (this.hasFetched) {
      return of(this.localUsers); 
    }
    

    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(users => {
        this.localUsers = users;
        this.hasFetched = true;
      })
    );
  }

  addUser(user: any): Observable<any> {
    
    const maxId = this.localUsers.length > 0 ? Math.max(...this.localUsers.map(u => u.id)) : 0;
    const newUser = { id: maxId + 1, ...user };

    this.localUsers.unshift(newUser); 
    return of(newUser);
  }

  updateUser(id: number, updatedUserData: any): Observable<any> {
    const userIndex = this.localUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      
      this.localUsers[userIndex] = { ...this.localUsers[userIndex], ...updatedUserData };
      return of(this.localUsers[userIndex]);
    }
    return of(null); 
  }

  deleteUser(id: number): Observable<any> {
    const initialLength = this.localUsers.length;
    this.localUsers = this.localUsers.filter(u => u.id !== id);
    
    return of({ success: this.localUsers.length < initialLength });
  }
}
