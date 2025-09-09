import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

declare var window: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  // A master list to hold all users fetched from the API
  allUsers: any[] = [];
  // The list of users to be displayed after filtering
  users: any[] = []; 
  
  paginatedUsers: any[] = [];
  userForm!: FormGroup;

  isEditMode = false;
  currentUserId: number | null = null;
  formModal: any;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private apiService: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadUsers();
    
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('userModal')
    );
    
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadUsers(): void {
    this.apiService.getUsers().subscribe(data => {
      // Populate both the master list and the displayed list initially
      this.allUsers = data;
      this.users = data;
      this.updatePaginatedUsers();
    });
  }

  // THIS IS THE MISSING FUNCTION
  applyFilter(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    
    if (!searchTerm) {
      this.users = this.allUsers;
    } else {
      this.users = this.allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    this.currentPage = 1; // Reset to first page after any search
    this.updatePaginatedUsers();
  }
  
  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  changePage(newPage: number): boolean {
    if (newPage < 1 || (newPage - 1) * this.itemsPerPage >= this.users.length) {
        return false;
    }
    this.currentPage = newPage;
    this.updatePaginatedUsers();
    return false;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentUserId = null;
    this.userForm.reset();
  }

  openEditModal(user: any): void {
    this.isEditMode = true;
    this.currentUserId = user.id;
    this.userForm.setValue({
      name: user.name,
      username: user.username,
      email: user.email
    });
  }

  onUserFormSubmit(): void {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    if (this.isEditMode && this.currentUserId) {
      this.apiService.updateUser(this.currentUserId, userData).subscribe(updatedUser => {
        // Update both the master list and the filtered list
        let index = this.users.findIndex(u => u.id === this.currentUserId);
        if (index !== -1) this.users[index] = updatedUser;
        
        index = this.allUsers.findIndex(u => u.id === this.currentUserId);
        if (index !== -1) this.allUsers[index] = updatedUser;

        this.updatePaginatedUsers();
      });
    } else {
      this.apiService.addUser(userData).subscribe(newUser => {
        // Add to both lists to ensure consistency
        this.users.unshift(newUser);
        this.allUsers.unshift(newUser);
        this.updatePaginatedUsers();
      });
    }
    
    this.formModal.hide();
  }
  
  onDelete(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(userId).subscribe(() => {
        // Remove from both lists
        this.users = this.users.filter(u => u.id !== userId);
        this.allUsers = this.allUsers.filter(u => u.id !== userId);

        this.updatePaginatedUsers();
        if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
          this.changePage(this.currentPage - 1);
        }
      });
    }
  }
}