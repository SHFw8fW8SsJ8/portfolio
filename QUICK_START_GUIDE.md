# Project Uploading System - Quick Start Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  PROJECT UPLOADING SYSTEM                   │
└─────────────────────────────────────────────────────────────┘

Admin Dashboard (/admin)
    ↓
    ├── Posts Tab (Existing Blog System)
    │   └── Create/Edit/Delete blog posts
    │
    └── Projects Tab (NEW)
        ├── Upload Form
        │   ├── Title
        │   ├── Date
        │   ├── Image 1 (Main gallery image)
        │   ├── Image 2 (Detail view)
        │   ├── Image 3 (Detail view)
        │   ├── Paragraph 1
        │   ├── Paragraph 2
        │   └── Paragraph 3
        │
        └── Projects Table
            ├── List all projects
            ├── Edit individual projects
            └── Delete projects

                        ↓

            projects.json (Database)
            {
              "projects": [
                { id, title, date, image1, image2, image3, paragraph1, paragraph2, paragraph3 }
              ]
            }

                        ↓

    API Endpoints (/api/projects)
    ├── GET    /api/projects       → Fetch all projects
    ├── GET    /api/projects/:id   → Fetch single project
    ├── POST   /api/projects       → Create project
    ├── PUT    /api/projects/:id   → Update project
    └── DELETE /api/projects/:id   → Delete project

                        ↓

Public Website
    │
    ├── /works.html (Portfolio Gallery)
    │   ├── Dynamic gallery grid
    │   ├── Project thumbnails
    │   ├── Links to project details
    │   └── Links to /project-details.html?id=<id>
    │
    └── /project-details.html (Project Details Page)
        ├── Full project display
        ├── All 3 images
        ├── All 3 paragraphs
        ├── Project metadata
        └── Back link to gallery
```

## Step-by-Step Workflow

### 1. Upload a Project

```
Admin Panel Login
    ↓
Click "Projects" Tab
    ↓
Fill Project Form:
  - Title: "My Amazing Project"
  - Date: "2024-01-18"
  - Upload Image 1 → /uploads/timestamp-image1.jpg
  - Upload Image 2 → /uploads/timestamp-image2.jpg
  - Upload Image 3 → /uploads/timestamp-image3.jpg
  - Write Paragraph 1
  - Write Paragraph 2
  - Write Paragraph 3
    ↓
Click "Save"
    ↓
Project saved to projects.json with auto-generated ID
    ↓
Success message shown
```

### 2. View Projects on Public Website

```
Visit /works.html
    ↓
Page loads and fetches /api/projects
    ↓
JavaScript generates gallery:
  <div class="gallery">
    For each project:
      <div class="project-card">
        <img src="image1" />
        <h6>Project Title</h6>
        <a href="/project-details.html?id=1">View</a>
      </div>
  </div>
    ↓
User sees dynamic project gallery
    ↓
Click on project card
    ↓
Navigate to /project-details.html?id=1
```

### 3. View Project Details

```
/project-details.html?id=1 loads
    ↓
JavaScript reads URL parameter (id=1)
    ↓
Fetch /api/projects/1
    ↓
Project data returned:
{
  "id": "1",
  "title": "My Amazing Project",
  "date": "2024-01-18",
  "image1": "/uploads/...",
  "image2": "/uploads/...",
  "image3": "/uploads/...",
  "paragraph1": "...",
  "paragraph2": "...",
  "paragraph3": "..."
}
    ↓
HTML template filled with project data:
<h3>My Amazing Project</h3>
<img src="image1" />
<p>paragraph1</p>
<p>paragraph2</p>
<div class="two-column">
  <img src="image2" />
  <img src="image3" />
</div>
<p>paragraph3</p>
    ↓
User views complete project with all images and content
    ↓
Click "Back to Portfolio" → returns to /works.html
```

### 4. Edit a Project

```
Admin Panel → Projects Tab
    ↓
Find project in "Existing Projects" table
    ↓
Click "Edit" button
    ↓
Form populates with existing project data
    ↓
Modify any fields as needed
    ↓
Click "Update"
    ↓
API sends PUT request with updated data
    ↓
projects.json is updated
    ↓
Success message shown
    ↓
Projects table refreshes
```

### 5. Delete a Project

```
Admin Panel → Projects Tab
    ↓
Find project in "Existing Projects" table
    ↓
Click "Delete" button
    ↓
Confirmation dialog appears
    ↓
Confirm deletion
    ↓
API sends DELETE request
    ↓
Project removed from projects.json
    ↓
Project no longer appears in gallery
```

## Key Files Modified

| File | Changes | Purpose |
|------|---------|---------|
| `projects.json` | Created | Database for project storage |
| `admin.html` | Added Projects tab & form | Admin interface for project management |
| `admin.js` | Added project functions | Handle project CRUD operations |
| `server.js` | Added API endpoints | REST API for projects |
| `works.html` | Dynamic gallery | Display all projects from database |
| `project-details.html` | Created | Display individual project details |

## Comparison: Blog vs Projects System

| Feature | Blog Posts | Projects |
|---------|-----------|----------|
| Fields | title, date, author, hero, excerpt, content (multiple), categories, gallery | title, date, image1, image2, image3, paragraph1, paragraph2, paragraph3 |
| Storage | posts.json | projects.json |
| API Base | /api/posts | /api/projects |
| Gallery Display | blogs.html | works.html |
| Detail Page | blog-details.html?id= | project-details.html?id= |
| Images | 1 main + gallery | 3 specific images |
| Content | Multiple paragraphs + categories | 3 paragraphs exactly |

## Features Implemented

✅ Dynamic project gallery (no more static HTML)  
✅ 3 image support per project  
✅ 3 paragraph support per project  
✅ Full CRUD operations (Create, Read, Update, Delete)  
✅ Admin dashboard tab system  
✅ Automatic image uploading  
✅ Dynamic project details page  
✅ Error handling and user feedback  
✅ Mobile-responsive design (using Tailwind classes)  
✅ Consistent styling with existing portfolio  

## Database Location

All project data is stored in:
```
d:\User\Documents\Website\!NewPortfolio\projects.json
```

## API Base URL

When running locally:
```
http://localhost:3001/api/projects
```

## Important Notes

1. **Static Projects Removed**: All hardcoded project items in works.html have been replaced with dynamic loading
2. **Image Storage**: Project images are stored in `/uploads/` directory
3. **Auto-generated IDs**: Each project gets a unique auto-incrementing ID
4. **Tab System**: Admin dashboard now uses tabs for better organization
5. **Responsive**: All new components are fully responsive using Tailwind CSS
6. **Consistent**: Design matches existing portfolio styling

## Testing the System

1. **Start the server**: `npm start`
2. **Access admin**: `http://localhost:3001/admin`
3. **Login**: username: `admin`, password: `123`
4. **Switch to Projects tab**: Click the "Projects" button
5. **Upload a test project**: Fill the form and click Save
6. **View portfolio**: `http://localhost:3001/works.html`
7. **Click project**: Click on a project card to view details
