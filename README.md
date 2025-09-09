# Tech Inverge Solutions - Angular Internship Task

This is a small Angular application built as a technical evaluation for the L1 Internship role at Tech Inverge Solutions.

The application was built from scratch in 6 days by a developer new to the Angular framework, demonstrating an ability to learn quickly and solve problems effectively.

---

## Features

-   **Mock Authentication:** A fully functional login page with a hardcoded user (`admin` / `admin123`).
-   **Route Protection:** A route guard prevents unauthorized access to the main dashboard.
-   **Stateful CRUD Operations:** A user management dashboard with full Create, Read, Update, and Delete functionality.
-   **Real-time Search:** Instantly filter users by name, username, or email.
-   **Client-Side Pagination:** A clean and efficient pagination system to handle large sets of data.
-   **Responsive Design:** Styled with Bootstrap for a clean and responsive UI that works on all screen sizes.

---

## Technical Highlights

-   **Stateful `ApiService`:** To overcome the limitations of a stateless demo API, a stateful service was created to cache data and manage all CRUD operations locally. This provides a realistic and persistent user experience for the session.
-   **Modern Angular:** Built with modern, standalone components for a clean and modular architecture.
-   **Reactive Forms:** Used for robust form handling and validation on the login page.

---

## How to Run This Project

1.  Clone the repository: `git clone [your-repo-url]`
2.  Navigate to the project directory: `cd your-project-name`
3.  Install dependencies: `npm install`
4.  Run the application: `ng serve -o`
5.  The application will be available at `http://localhost:4200`.

**Login Credentials:**
-   **Username:** admin
-   **Password:** admin123
