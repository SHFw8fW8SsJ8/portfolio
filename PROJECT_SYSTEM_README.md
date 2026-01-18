# Project Uploading System Documentation

## Overview

A complete project management system has been implemented for the portfolio website, similar to the existing blog system. This allows administrators to upload, edit, and manage portfolio projects with 3 images and 3 paragraphs each.

## Features

### 1. **Admin Dashboard - Project Management Tab**
   - **Location**: `/admin`
   - **Access**: Login with admin credentials (username: `admin`, password: `123`)
   - **Tab Navigation**: Two tabs available:
     - **Posts** - Manage blog posts
     - **Projects** - Manage portfolio projects (NEW)

### 2. **Project Upload Form**
   The Projects tab contains a form to create and edit projects with the following fields:
   - **Title** - Project name
   - **Date** - Project date (YYYY-MM-DD format)
   - **Image 1** - Main project image (shown in gallery)
   - **Image 2** - Secondary project image
   - **Image 3** - Tertiary project image
   - **Paragraph 1** - First description paragraph
   - **Paragraph 2** - Second description paragraph
   - **Paragraph 3** - Third description paragraph

### 3. **Project Gallery (Works Page)**
   - **Location**: `/works.html`
   - **Features**:
     - Dynamically loads all uploaded projects
     - Displays project thumbnail (Image 1)
     - Shows project title
     - Links to detailed project page
     - Empty state message when no projects exist

### 4. **Project Details Page**
   - **Location**: `/project-details.html?id=<project-id>`
   - **Features**:
     - Dynamic content loading based on project ID
     - Displays all 3 project images
     - Shows all 3 paragraphs
     - Displays project metadata (date)
     - Back link to portfolio page

## Technical Architecture

### Database Structure

#### projects.json
```json
{
  "projects": [
    {
      "id": "1",
      "title": "Project Title",
      "date": "2024-01-15",
      "image1": "/uploads/image1.jpg",
      "image2": "/uploads/image2.jpg",
      "image3": "/uploads/image3.jpg",
      "paragraph1": "First paragraph content...",
      "paragraph2": "Second paragraph content...",
      "paragraph3": "Third paragraph content..."
    }
  ]
}
```

### API Endpoints

All endpoints are located under `/api/projects`

#### GET /api/projects
- **Description**: Fetch all projects
- **Response**: 
  ```json
  {
    "projects": [...]
  }
  ```

#### GET /api/projects/:id
- **Description**: Fetch a specific project by ID
- **Response**: 
  ```json
  {
    "project": {...}
  }
  ```

#### POST /api/projects
- **Description**: Create a new project
- **Body**: Project data (all fields)
- **Response**: Created project object

#### PUT /api/projects/:id
- **Description**: Update an existing project
- **Body**: Project data (all fields)
- **Response**: Updated project object

#### DELETE /api/projects/:id
- **Description**: Delete a project
- **Response**: 
  ```json
  {
    "success": true
  }
  ```

## File Structure

### New/Modified Files

1. **projects.json** (NEW)
   - Storage for all project data

2. **admin.html** (MODIFIED)
   - Added Projects tab
   - Added project upload form with 3 image fields and 3 paragraph fields
   - Added projects management table

3. **assets/js/admin.js** (MODIFIED)
   - Added tab navigation functionality
   - Added project CRUD operations
   - Added image upload handlers for all 3 project images

4. **server.js** (MODIFIED)
   - Added readProjects() and writeProjects() functions
   - Added /api/projects endpoints for all CRUD operations

5. **works.html** (MODIFIED)
   - Removed static project items
   - Added dynamic project gallery loading
   - Projects now load from projects.json via API

6. **project-details.html** (NEW)
   - Dynamic project details page
   - Loads project by ID from URL parameter (?id=)
   - Displays all project information including 3 images and 3 paragraphs

## Usage Guide

### Uploading a New Project

1. Navigate to `/admin`
2. Login with credentials (admin/123)
3. Click the "Projects" tab
4. Fill in the project form:
   - Enter project title
   - Set project date
   - Upload 3 project images
   - Write 3 paragraphs describing the project
5. Click "Save" button
6. Project will appear in works.html gallery

### Editing a Project

1. Go to Admin Dashboard > Projects tab
2. Find the project in the "Existing Projects" table
3. Click the "Edit" button
4. Modify any fields
5. Click "Update" button

### Deleting a Project

1. Go to Admin Dashboard > Projects tab
2. Find the project in the "Existing Projects" table
3. Click the "Delete" button
4. Confirm deletion

### Viewing Projects

- **Portfolio Gallery**: Visit `/works.html` to see all projects displayed in a grid
- **Project Details**: Click on any project to view full details with all 3 images and paragraphs

## Image Upload

- Images are automatically uploaded to `/uploads/` directory
- File names are generated with timestamps to avoid conflicts
- Supported formats: Common image formats (jpg, png, gif, etc.)
- Images are referenced with their upload paths in the project data

## Static Projects Removal

All hardcoded static projects have been removed from `works.html`. The page now dynamically generates the project gallery from the projects.json database.

## Frontend Integration

### Tab Navigation (admin.js)
- Clicking "Posts" tab shows the blog management section
- Clicking "Projects" tab shows the project management section
- Tab styling updates to show active tab

### Dynamic Project Gallery (works.js)
- Fetches all projects from `/api/projects` on page load
- Generates HTML for each project
- Links to project details with ID parameter

### Project Details Page (project-details.html)
- Reads project ID from URL query parameter
- Fetches project data via API
- Dynamically renders all content
- Handles errors gracefully

## Status Messages

The system provides visual feedback:
- **Green** messages for successful operations (create, update, delete)
- **Red** messages for errors
- Status messages auto-dismiss after 3 seconds

## Error Handling

- Missing project ID on details page shows error message
- API failures display user-friendly error messages
- Empty projects list shows "No projects uploaded yet" message
- Image upload failures are reported with feedback

## Future Enhancements

Potential improvements that could be added:
- Add categories/tags to projects
- Multiple gallery images per project
- Project client/budget information
- Project technology stack
- Comments on projects
- Project filtering/search
- Bulk project management

## Troubleshooting

### Projects not showing on works.html
- Check that server is running (`npm start`)
- Verify projects.json file exists
- Check browser console for API errors
- Ensure projects have been uploaded via admin panel

### Admin login issues
- Default credentials: username `admin`, password `123`
- Check server status
- Clear browser cache and try again

### Images not uploading
- Ensure /uploads directory exists
- Check file size limits
- Verify image format is supported
- Check browser console for errors

### Project not loading on details page
- Verify project ID in URL is correct
- Check that project exists in projects.json
- Ensure server is running
- Check browser console for errors
