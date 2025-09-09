import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  
  // This array will act as our local, persistent "database" for the session.
  private localUsers: any[] = [];
  private hasFetched = false;

  constructor(private http: HttpClient) { }

  /**
   * Fetches users from the API only once, then serves from a local cache.
   * This ensures data persists between component views.
   */
  getUsers(): Observable<any[]> {
    if (this.hasFetched) {
      return of(this.localUsers); // Return local data if it exists
    }
    
    // Fetch from API, store it locally, mark as fetched, then return.
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(users => {
        this.localUsers = users;
        this.hasFetched = true;
      })
    );
  }

  /**
   * Adds a user to the local array with a correct, sequential new ID.
   * This mimics a real database auto-incrementing ID.
   */
  addUser(user: any): Observable<any> {
    // Find the highest current ID and add 1 to it.
    const maxId = this.localUsers.length > 0 ? Math.max(...this.localUsers.map(u => u.id)) : 0;
    const newUser = { id: maxId + 1, ...user };

    this.localUsers.unshift(newUser); // Add to the beginning of the array for immediate visibility
    return of(newUser);
  }

  /**
   * Finds and updates a user within the local array.
   */
  updateUser(id: number, updatedUserData: any): Observable<any> {
    const userIndex = this.localUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      // Merge existing user data with new data to preserve fields like 'id'
      this.localUsers[userIndex] = { ...this.localUsers[userIndex], ...updatedUserData };
      return of(this.localUsers[userIndex]);
    }
    return of(null); // Or you could return an error observable
  }

  /**
   * Removes a user from the local array.
   */
  deleteUser(id: number): Observable<any> {
    const initialLength = this.localUsers.length;
    this.localUsers = this.localUsers.filter(u => u.id !== id);
    // Return a success object if an item was actually removed
    return of({ success: this.localUsers.length < initialLength });
  }
}