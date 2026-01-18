# Project Uploading System - Example Usage

## Example Project JSON

Here's what a populated `projects.json` file looks like with sample projects:

```json
{
  "projects": [
    {
      "id": "1",
      "title": "E-Commerce Platform Redesign",
      "date": "2024-01-15",
      "image1": "/uploads/1705330000000-ecommerce-hero.jpg",
      "image2": "/uploads/1705330000001-ecommerce-dashboard.jpg",
      "image3": "/uploads/1705330000002-ecommerce-checkout.jpg",
      "paragraph1": "Redesigned a complete e-commerce platform to improve user experience and conversion rates. The project involved extensive user research, competitive analysis, and prototyping to identify key pain points in the existing shopping flow.",
      "paragraph2": "Implemented a modern checkout process that reduced cart abandonment by 35%. Added personalized product recommendations, improved product filtering, and optimized mobile responsiveness. The new design increased average order value by 22% within the first month.",
      "paragraph3": "Technologies used: React, Node.js, MongoDB, Stripe API, and TailwindCSS. The project also included implementing a comprehensive analytics dashboard to track user behavior and conversion metrics in real-time."
    },
    {
      "id": "2",
      "title": "Mobile Banking App UI",
      "date": "2024-01-10",
      "image1": "/uploads/1705329900000-banking-app-hero.jpg",
      "image2": "/uploads/1705329900001-banking-app-features.jpg",
      "image3": "/uploads/1705329900002-banking-app-wallet.jpg",
      "paragraph1": "Created a beautiful and intuitive user interface for a mobile banking application. Focused on simplifying complex financial operations and making them accessible to users of all technical levels. Conducted extensive user testing to validate design decisions.",
      "paragraph2": "Implemented key features including account overview, transfer money, bill payments, and investment tracking. The design emphasizes security through visual cues while maintaining a clean and modern aesthetic. Used color psychology to convey trust and reliability.",
      "paragraph3": "The app was built using Flutter and integrated with REST APIs for real-time data. Successfully launched on both iOS and Android platforms, achieving 4.8 star rating on app stores with over 100,000 downloads in the first quarter."
    },
    {
      "id": "3",
      "title": "Brand Identity & Website",
      "date": "2023-12-28",
      "image1": "/uploads/1705329800000-brand-hero.jpg",
      "image2": "/uploads/1705329800001-brand-guidelines.jpg",
      "image3": "/uploads/1705329800002-brand-website.jpg",
      "paragraph1": "Developed a comprehensive brand identity for a sustainable fashion startup. Created logo design, color palette, typography system, and brand guidelines that reflect the company's commitment to environmental responsibility and ethical production.",
      "paragraph2": "Designed and developed a responsive website showcasing the brand's values and product collection. Implemented e-commerce functionality, sustainability story pages, and impact metrics. The site emphasizes the journey from sustainable materials to finished products.",
      "paragraph3": "The brand identity was applied across all touchpoints including packaging, social media, and marketing materials. The website generated a 45% increase in online sales within three months and established the brand as a leader in sustainable fashion."
    }
  ]
}
```

## API Usage Examples

### Create a New Project (POST)

**Endpoint**: `POST /api/projects`

**Request**:
```json
{
  "title": "Website Redesign Project",
  "date": "2024-01-18",
  "image1": "/uploads/1705596000000-hero-image.jpg",
  "image2": "/uploads/1705596000001-detail-image.jpg",
  "image3": "/uploads/1705596000002-final-image.jpg",
  "paragraph1": "This is the first paragraph describing the project overview and goals.",
  "paragraph2": "This paragraph explains the challenges faced and solutions implemented.",
  "paragraph3": "Final paragraph discusses the results and impact of the project."
}
```

**Response**:
```json
{
  "project": {
    "id": "4",
    "title": "Website Redesign Project",
    "date": "2024-01-18",
    "image1": "/uploads/1705596000000-hero-image.jpg",
    "image2": "/uploads/1705596000001-detail-image.jpg",
    "image3": "/uploads/1705596000002-final-image.jpg",
    "paragraph1": "This is the first paragraph describing the project overview and goals.",
    "paragraph2": "This paragraph explains the challenges faced and solutions implemented.",
    "paragraph3": "Final paragraph discusses the results and impact of the project."
  }
}
```

### Get All Projects (GET)

**Endpoint**: `GET /api/projects`

**Response**:
```json
{
  "projects": [
    { /* project 1 */ },
    { /* project 2 */ },
    { /* project 3 */ },
    { /* project 4 */ }
  ]
}
```

### Get Single Project (GET)

**Endpoint**: `GET /api/projects/2`

**Response**:
```json
{
  "project": {
    "id": "2",
    "title": "Mobile Banking App UI",
    "date": "2024-01-10",
    "image1": "/uploads/1705329900000-banking-app-hero.jpg",
    "image2": "/uploads/1705329900001-banking-app-features.jpg",
    "image3": "/uploads/1705329900002-banking-app-wallet.jpg",
    "paragraph1": "...",
    "paragraph2": "...",
    "paragraph3": "..."
  }
}
```

### Update Project (PUT)

**Endpoint**: `PUT /api/projects/2`

**Request**:
```json
{
  "title": "Mobile Banking App UI - Updated",
  "date": "2024-01-10",
  "image1": "/uploads/new-image1.jpg",
  "image2": "/uploads/new-image2.jpg",
  "image3": "/uploads/new-image3.jpg",
  "paragraph1": "Updated paragraph 1...",
  "paragraph2": "Updated paragraph 2...",
  "paragraph3": "Updated paragraph 3..."
}
```

**Response**: Returns updated project object

### Delete Project (DELETE)

**Endpoint**: `DELETE /api/projects/1`

**Response**:
```json
{
  "success": true
}
```

## Frontend Integration Examples

### Displaying Projects in Gallery (works.html)

```javascript
fetch('/api/projects')
  .then(res => res.json())
  .then(({ projects }) => {
    const html = projects.map(project => `
      <div class="project-card">
        <img src="${project.image1}" alt="${project.title}">
        <h3>${project.title}</h3>
        <a href="project-details.html?id=${project.id}">View Project</a>
      </div>
    `).join('');
    
    document.getElementById('projectsGallery').innerHTML = html;
  });
```

### Loading Project Details (project-details.html)

```javascript
// Get project ID from URL
const projectId = new URLSearchParams(window.location.search).get('id');

// Fetch project data
fetch(`/api/projects/${projectId}`)
  .then(res => res.json())
  .then(({ project }) => {
    document.querySelector('h1').textContent = project.title;
    document.querySelector('img.hero').src = project.image1;
    document.querySelector('p.para1').textContent = project.paragraph1;
    document.querySelector('p.para2').textContent = project.paragraph2;
    document.querySelector('img.img2').src = project.image2;
    document.querySelector('img.img3').src = project.image3;
    document.querySelector('p.para3').textContent = project.paragraph3;
  });
```

## Admin Dashboard Form Submission

### How the Admin Form Works

1. **User fills form**:
   ```
   Title: "New Project"
   Date: "2024-01-18"
   Image 1: (upload file) → /uploads/timestamp-img1.jpg
   Image 2: (upload file) → /uploads/timestamp-img2.jpg
   Image 3: (upload file) → /uploads/timestamp-img3.jpg
   Paragraph 1: "Lorem ipsum..."
   Paragraph 2: "Dolor sit amet..."
   Paragraph 3: "Consectetur adipiscing..."
   ```

2. **Form submission**:
   ```javascript
   const payload = {
     title: "New Project",
     date: "2024-01-18",
     image1: "/uploads/timestamp-img1.jpg",
     image2: "/uploads/timestamp-img2.jpg",
     image3: "/uploads/timestamp-img3.jpg",
     paragraph1: "Lorem ipsum...",
     paragraph2: "Dolor sit amet...",
     paragraph3: "Consectetur adipiscing..."
   };
   
   fetch('/api/projects', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(payload)
   });
   ```

3. **Server response**:
   - Project is saved to `projects.json`
   - Auto-generated ID assigned
   - Success message displayed
   - Projects table refreshed

## Tab Navigation in Admin

### Posts Tab (Default)
- Manages blog posts
- Similar structure to projects
- Form for creating/editing posts

### Projects Tab (New)
- Manages portfolio projects
- Form with 3 image uploads
- Form with 3 paragraph text areas
- Table of existing projects

**Tab Switching Code**:
```javascript
document.getElementById('postsTab').onclick = () => {
  document.getElementById('postsSection').style.display = 'block';
  document.getElementById('projectsSection').style.display = 'none';
};

document.getElementById('projectsTab').onclick = () => {
  document.getElementById('postsSection').style.display = 'none';
  document.getElementById('projectsSection').style.display = 'block';
};
```

## File Upload Handling

When an image is uploaded:

1. File selected in upload input
2. Change event triggers upload handler
3. FormData created with file
4. POST request to `/api/upload`
5. Server saves file to `/uploads/` with timestamp
6. Returns file path: `/uploads/1705596000000-filename.jpg`
7. Path stored in form hidden input
8. Path sent with project data on save

Example:
```javascript
document.getElementById('project_image1_upload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('image', file);
  
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const { filePath } = await res.json();
  document.getElementById('project_image1').value = filePath;
  document.getElementById('project_image1_preview').src = filePath;
});
```

## Status Messages

The system provides feedback on all operations:

```javascript
const showProjectStatus = (message, isError = false) => {
  const span = document.getElementById('project_status');
  span.textContent = message;
  span.style.color = isError ? 'red' : 'green';
  
  setTimeout(() => {
    span.textContent = '';
  }, 3000);
};

// Usage
showProjectStatus('Project created successfully!');
showProjectStatus('Failed to upload image.', true);
```

## Complete User Journey

```
Admin → /admin
  ↓
Login (admin/123)
  ↓
Click "Projects" tab
  ↓
Fill in form:
  - Title: "Mobile App Design"
  - Date: "2024-01-18"
  - Upload 3 images
  - Write 3 paragraphs
  ↓
Click "Save"
  ↓
Project saved with ID "5"
  ↓
Success message shown
  ↓
Project appears in projects table
  ↓
Visit /works.html
  ↓
See new project in gallery
  ↓
Click project card
  ↓
View full details at /project-details.html?id=5
  ↓
See all 3 images and 3 paragraphs
```

## Notes

- All project IDs are auto-generated as sequential numbers
- Images are stored with unique timestamps to prevent conflicts
- The system automatically handles empty projects (displays "No projects uploaded yet")
- All components are fully responsive using Tailwind CSS
- Error handling ensures graceful failures with user feedback
