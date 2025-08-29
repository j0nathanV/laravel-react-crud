# Client Management System

A complete client management application built with Laravel backend and React frontend. 

## 🏗️ Building for Production

When you want to prepare the application for a live website:

```bash
# Prepare the interface for production
npm run build

# Optimize the server for better performance
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📊 API Endpoints full-stack CRUD implementation with modern web technologies.

## 🎯 Project Objectives

This application evaluates backend (Laravel) and frontend (React) development in a single integrated workflow, implementing a comprehensive client management system.

## ✨ Core Features

### Backend (Laravel)
- **Complete CRUD Operations** for client management
- **API Routes**: List, Create, Delete clients
- **Field Validation**: 
  - `nombre` (required)
  - `email` (valid format and unique)
  - `telefono` (optional)
- **Data Validation** with Laravel Form Requests
- **RESTful API** structure

### Frontend (React)
- **Client Listing** - Display all registered clients
- **Client Creation** - Form to add new clients
- **Client Deletion** - Remove clients with confirmation
- **State Management** - Clear states for empty list, loading, and errors
- **Responsive Design** - Clean and readable interface

## 🌟 Enhanced Features (Optional Implementations)

- **Live Validation** - Real-time form validation feedback
- **Duplicate Detection** - Visual alerts for existing emails/names
- **Search & Filter** - Find clients quickly in the list
- **Pagination** - Navigate through large client databases
- **Error Handling** - Comprehensive error states and user feedback

## 🚀 Installation & Setup

### Prerequisites
- **Git** (to download the project)
- **MySQL Database** (choose one option):
  - XAMPP (recommended for beginners)
  - WAMP/MAMP
  - Local MySQL installation
  - Docker MySQL container
  - Laravel Sail (Docker-based)
- **Node.js** (version 16+)
- **PHP** (version 8.1+)
- **Composer** (PHP package manager)

### Step 1: Download the Project
```bash
# Clone the repository from GitHub
git clone https://github.com/j0nathanV/laravel-react-crud.git

# Navigate to the project folder
cd laravel-react-crud
```

### Step 2: Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### Step 3: Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 4: Database Configuration

#### Option 1: XAMPP (Recommended for beginners)
1. Start XAMPP and ensure MySQL is running
2. Open `.env` file in the project root
3. Configure database settings:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cliente-cuenca
DB_USERNAME=root
DB_PASSWORD=
```

#### Option 2: Local MySQL Installation
1. Start your MySQL service
2. Configure `.env` file with your MySQL credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cliente-cuenca
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### Option 3: Docker
```bash
# Run MySQL container
docker run -d --name mysql-client-app -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=cliente-cuenca -p 3306:3306 mysql:8.0
```
Then configure `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cliente-cuenca
DB_USERNAME=root
DB_PASSWORD=root
```

#### Option 4: Laravel Sail
```bash
# If using Sail, it will handle MySQL automatically
./vendor/bin/sail up -d
```

### Step 5: Setup Database
```bash
# Create database (if it doesn't exist)
php artisan db:create

# Run database migrations
php artisan migrate
```

**Note**: If `php artisan db:create` doesn't work with your MySQL setup, manually create the database `cliente-cuenca` using phpMyAdmin, MySQL Workbench, or command line.

### Step 6: Start the Application

You need to run both parts of the application:

#### First Terminal: Start the Backend
```bash
php artisan serve
```
This starts the server that handles your data.

#### Second Terminal: Start the Frontend  
```bash
npm run dev
```
This starts the visual interface.

**Important**: Keep both terminals open while using the application.

The application will automatically open in your browser, or go to the address shown in the second terminal.

## � API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/clientes` | List all clients |
| POST | `/api/v1/clientes` | Create new client |
| DELETE | `/api/v1/clientes/{id}` | Delete client |

## 📋 Usage Guide

### Adding Clients
1. Use the form on the left side
2. Enter **Name** (required, minimum 2 characters)
3. Enter **Email** (valid format, must be unique)
4. Enter **Phone** (optional, 8-15 digits)
5. Click "Add Client" to save

### Managing Clients
- **View**: All clients display in the main list
- **Search**: Use search functionality to filter clients
- **Delete**: Click delete button with confirmation prompt
- **Navigation**: Use pagination for large client lists

## ⚡ Validation Rules

### Backend Validation
- **Name**: Required, minimum 2 characters, realistic patterns
- **Email**: Required, valid format, unique in database
- **Phone**: Optional, 8-15 digits, realistic number patterns

### Frontend Validation
- **Real-time feedback** during form input
- **Duplicate checking** for emails and names
- **Visual error states** with clear messaging
- **Form state management** prevents invalid submissions

## 🛠️ Technical Implementation

### Backend Stack
- **Laravel 12** - PHP framework
- **MySQL** - Database management
- **Form Requests** - Input validation
- **API Resources** - Response formatting

### Frontend Stack
- **React 18** - JavaScript library
- **TypeScript** - Type safety
- **Custom Hooks** - State management
- **Tailwind CSS** - Styling framework

## � Troubleshooting

### Common Issues
**Database Connection**
- Make sure your MySQL service is running
- Check database name and credentials in `.env`
- Ensure database `cliente-cuenca` exists

**Application Not Loading**
- Verify both terminals are running (backend and frontend)
- Check if ports are available

**Cache Issues**
```bash
php artisan cache:clear
php artisan config:clear
```

## � Project Evaluation Criteria

✅ **Backend Implementation**
- CRUD operations for client management
- Proper validation and error handling
- RESTful API design
- Database relationship management

✅ **Frontend Implementation**
- Component-based architecture
- State management and user experience
- Responsive design implementation
- API integration and error handling

✅ **Integration Quality**
- Seamless backend-frontend communication
- Consistent data flow and validation
- User-friendly interface design
- Performance optimization

## 📝 License

Open source project available under the MIT License.

## 🧪 Testing (Optional)

If you want to verify that everything is working correctly, you can run automated tests:

### Basic Tests
```bash
# Check if all functionality works
php artisan test
```

### Specific Tests
```bash
# Test only client-related features
php artisan test --filter=Cliente
```

### Frontend Tests
```bash
# Test the user interface (if available)
npm test
```

**Note**: Tests use a separate database, so they won't affect your real client data.