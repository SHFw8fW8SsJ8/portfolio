document.addEventListener('DOMContentLoaded', () => {
  // ==================== POSTS ELEMENTS ====================
  const adminForm = document.getElementById('adminForm');
  const adminIdInput = document.getElementById('admin_id');
  const adminTitleInput = document.getElementById('admin_title');
  const adminDateInput = document.getElementById('admin_date');
  const adminAuthorInput = document.getElementById('admin_author');
  const adminHeroInput = document.getElementById('admin_hero');
  const adminHeroUploadInput = document.getElementById('admin_hero_upload');
  const adminHeroPreview = document.getElementById('admin_hero_preview');
  const adminExcerptInput = document.getElementById('admin_excerpt');
  const adminContentInput = document.getElementById('admin_content');
  const adminCategoriesInput = document.getElementById('admin_categories');
  const adminGalleryInput = document.getElementById('admin_gallery');
  const adminSubmitButton = document.getElementById('admin_submit');
  const adminResetButton = document.getElementById('admin_reset');
  const adminPostsTbody = document.getElementById('adminPostsTbody');
  const adminStatusSpan = document.getElementById('admin_status');

  // ==================== PROJECTS ELEMENTS ====================
  const adminProjectForm = document.getElementById('adminProjectForm');
  const projectIdInput = document.getElementById('project_id');
  const projectTitleInput = document.getElementById('project_title');
  const projectDateInput = document.getElementById('project_date');
  const projectImage1Input = document.getElementById('project_image1');
  const projectImage1UploadInput = document.getElementById('project_image1_upload');
  const projectImage1Preview = document.getElementById('project_image1_preview');
  const projectImage2Input = document.getElementById('project_image2');
  const projectImage2UploadInput = document.getElementById('project_image2_upload');
  const projectImage2Preview = document.getElementById('project_image2_preview');
  const projectImage3Input = document.getElementById('project_image3');
  const projectImage3UploadInput = document.getElementById('project_image3_upload');
  const projectImage3Preview = document.getElementById('project_image3_preview');
  const projectImage4Input = document.getElementById('project_image4');
  const projectImage4UploadInput = document.getElementById('project_image4_upload');
  const projectImage4Preview = document.getElementById('project_image4_preview');
  const projectCategoryInput = document.getElementById('project_category');
  const projectParagraph1Input = document.getElementById('project_paragraph1');
  const projectParagraph2TitleInput = document.getElementById('project_paragraph2_title');
  const projectParagraph2Input = document.getElementById('project_paragraph2');
  const projectSubmitButton = document.getElementById('project_submit');
  const projectResetButton = document.getElementById('project_reset');
  const adminProjectsTbody = document.getElementById('adminProjectsTbody');
  const projectStatusSpan = document.getElementById('project_status');

  // ==================== TAB NAVIGATION ====================
  const postsTab = document.getElementById('postsTab');
  const projectsTab = document.getElementById('projectsTab');
  const postsSection = document.getElementById('postsSection');
  const projectsSection = document.getElementById('projectsSection');

  // Login elements
  const loginForm = document.getElementById('loginForm');
  const loginSection = document.getElementById('loginSection');
  const dashboardSection = document.getElementById('dashboardSection');
  const loginError = document.getElementById('login_error');

  const API_BASE_URL = '/api/posts';
  const PROJECTS_API_URL = '/api/projects';
  const UPLOAD_URL = '/api/upload';

  // Helper to show status messages
  const showStatus = (message, isError = false) => {
    adminStatusSpan.textContent = message;
    adminStatusSpan.style.color = isError ? 'red' : '#1de5f3';
    setTimeout(() => {
      adminStatusSpan.textContent = '';
      adminStatusSpan.style.color = '';
    }, 3000);
  };

  const showProjectStatus = (message, isError = false) => {
    projectStatusSpan.textContent = message;
    projectStatusSpan.style.color = isError ? 'red' : '#1de5f3';
    setTimeout(() => {
      projectStatusSpan.textContent = '';
      projectStatusSpan.style.color = '';
    }, 3000);
  };

  // ==================== TAB NAVIGATION ====================
  postsTab.addEventListener('click', () => {
    postsSection.style.display = 'block';
    projectsSection.style.display = 'none';
    postsTab.classList.add('border-main');
    postsTab.classList.remove('opacity-50', 'border-transparent');
    projectsTab.classList.remove('border-main');
    projectsTab.classList.add('opacity-50', 'border-transparent');
  });

  projectsTab.addEventListener('click', () => {
    postsSection.style.display = 'none';
    projectsSection.style.display = 'block';
    projectsTab.classList.add('border-main');
    projectsTab.classList.remove('opacity-50', 'border-transparent');
    postsTab.classList.remove('border-main');
    postsTab.classList.add('opacity-50', 'border-transparent');
  });

  // Fetch and display posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { posts } = await response.json();
      adminPostsTbody.innerHTML = ''; // Clear existing rows
      posts.forEach(post => {
        const row = adminPostsTbody.insertRow();
        row.innerHTML = `
          <td class="py-[8px] px-[8px]">${post.id}</td>
          <td class="py-[8px] px-[8px]">${post.title}</td>
          <td class="py-[8px] px-[8px]">${post.date}</td>
          <td class="py-[8px] px-[8px]">${post.author}</td>
          <td class="py-[8px] px-[8px]">
            <button class="edit-btn px-[10px] py-[5px] bg-blue-500 text-white rounded-[3px] text-[10px] mr-[5px]" data-id="${post.id}">Edit</button>
            <button class="delete-btn px-[10px] py-[5px] bg-red-500 text-white rounded-[3px] text-[10px]" data-id="${post.id}">Delete</button>
          </td>
        `;
      });
      addEventListenersToButtons();
    } catch (error) {
      console.error('Error fetching posts:', error);
      showStatus('Failed to fetch posts.', true);
    }
  };

  // Add event listeners to dynamically created buttons
  const addEventListenersToButtons = () => {
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.onclick = (e) => editPost(e.target.dataset.id);
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.onclick = (e) => deletePost(e.target.dataset.id);
    });
  };

  // ==================== PROJECTS FUNCTIONS ====================
  // Fetch and display projects
  const fetchProjects = async () => {
    try {
      const response = await fetch(PROJECTS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { projects } = await response.json();
      adminProjectsTbody.innerHTML = '';
      projects.forEach(project => {
        const row = adminProjectsTbody.insertRow();
        row.innerHTML = `
          <td class="py-[8px] px-[8px]">${project.id}</td>
          <td class="py-[8px] px-[8px]">${project.title}</td>
          <td class="py-[8px] px-[8px]">${project.date}</td>
          <td class="py-[8px] px-[8px]">
            <button class="edit-project-btn px-[10px] py-[5px] bg-blue-500 text-white rounded-[3px] text-[10px] mr-[5px]" data-id="${project.id}">Edit</button>
            <button class="delete-project-btn px-[10px] py-[5px] bg-red-500 text-white rounded-[3px] text-[10px]" data-id="${project.id}">Delete</button>
          </td>
        `;
      });
      addProjectEventListeners();
    } catch (error) {
      console.error('Error fetching projects:', error);
      showProjectStatus('Failed to fetch projects.', true);
    }
  };

  const addProjectEventListeners = () => {
    document.querySelectorAll('.edit-project-btn').forEach(button => {
      button.onclick = (e) => editProject(e.target.dataset.id);
    });
    document.querySelectorAll('.delete-project-btn').forEach(button => {
      button.onclick = (e) => deleteProject(e.target.dataset.id);
    });
  };

  const editProject = async (id) => {
    try {
      const response = await fetch(`${PROJECTS_API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { project } = await response.json();
      projectIdInput.value = project.id;
      projectTitleInput.value = project.title;
      projectDateInput.value = project.date;
      projectCategoryInput.value = project.category || '';
      projectImage1Input.value = project.image1;
      projectImage1Preview.src = project.image1;
      projectImage1Preview.style.display = project.image1 ? 'block' : 'none';
      projectImage2Input.value = project.image2;
      projectImage2Preview.src = project.image2;
      projectImage2Preview.style.display = project.image2 ? 'block' : 'none';
      projectImage3Input.value = project.image3;
      projectImage3Preview.src = project.image3;
      projectImage3Preview.style.display = project.image3 ? 'block' : 'none';
      projectImage4Input.value = project.image4 || '';
      projectImage4Preview.src = project.image4 || '';
      projectImage4Preview.style.display = project.image4 ? 'block' : 'none';
      projectParagraph1Input.value = project.paragraph1 || '';
      projectParagraph2TitleInput.value = project.paragraph2Title || '';
      projectParagraph2Input.value = project.paragraph2 || '';
      projectSubmitButton.textContent = 'Update';
    } catch (error) {
      console.error('Error fetching project for edit:', error);
      showProjectStatus('Failed to load project for editing.', true);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }
    try {
      const response = await fetch(`${PROJECTS_API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      showProjectStatus('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      showProjectStatus(`Failed to delete project: ${error.message}`, true);
    }
  };

  // Handle project form submission
  adminProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = projectIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${PROJECTS_API_URL}/${id}` : PROJECTS_API_URL;

    const payload = {
      title: projectTitleInput.value,
      date: projectDateInput.value,
      category: projectCategoryInput.value,
      image1: projectImage1Input.value,
      image2: projectImage2Input.value,
      image3: projectImage3Input.value,
      image4: projectImage4Input.value,
      paragraph1: projectParagraph1Input.value,
      paragraph2Title: projectParagraph2TitleInput.value,
      paragraph2: projectParagraph2Input.value,
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      showProjectStatus(`Project ${id ? 'updated' : 'created'} successfully!`);
      adminProjectForm.reset();
      projectImage1Preview.style.display = 'none';
      projectImage2Preview.style.display = 'none';
      projectImage3Preview.style.display = 'none';
      projectImage4Preview.style.display = 'none';
      projectIdInput.value = '';
      projectSubmitButton.textContent = 'Save';
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      showProjectStatus(`Failed to save project: ${error.message}`, true);
    }
  });

  // Handle project form reset
  projectResetButton.addEventListener('click', () => {
    adminProjectForm.reset();
    projectIdInput.value = '';
    projectSubmitButton.textContent = 'Save';
    projectImage1Preview.style.display = 'none';
    projectImage2Preview.style.display = 'none';
    projectImage3Preview.style.display = 'none';
    projectImage4Preview.style.display = 'none';
    showProjectStatus('Form reset.');
  });

  // Image upload handlers for projects
  const handleProjectImageUpload = (uploadInput, imageInput, preview) => {
    uploadInput.addEventListener('change', async () => {
      const file = uploadInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(UPLOAD_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        imageInput.value = data.filePath;
        preview.src = data.filePath;
        preview.style.display = 'block';
        showProjectStatus('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
        showProjectStatus('Image upload failed.', true);
      }
    });
  };

  handleProjectImageUpload(projectImage1UploadInput, projectImage1Input, projectImage1Preview);
  handleProjectImageUpload(projectImage2UploadInput, projectImage2Input, projectImage2Preview);
  handleProjectImageUpload(projectImage3UploadInput, projectImage3Input, projectImage3Preview);
  handleProjectImageUpload(projectImage4UploadInput, projectImage4Input, projectImage4Preview);

  // Auth status and login handling
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (data && data.loggedIn) {
        if (loginSection) loginSection.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'block';
        fetchPosts();
        fetchProjects();
      } else {
        if (loginSection) loginSection.style.display = 'block';
        if (dashboardSection) dashboardSection.style.display = 'none';
      }
    } catch (e) {
      if (loginSection) loginSection.style.display = 'block';
      if (dashboardSection) dashboardSection.style.display = 'none';
    }
  };

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (loginError) loginError.style.display = 'none';
      const username = document.getElementById('login_username').value.trim();
      const password = document.getElementById('login_password').value;
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Login failed');
        }
        checkAuth();
      } catch (err) {
        if (loginError) {
          loginError.textContent = err.message;
          loginError.style.display = 'block';
        }
      }
    });
  }

  // Populate form for editing
  const editPost = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { post } = await response.json();
      adminIdInput.value = post.id;
      adminTitleInput.value = post.title;
      adminDateInput.value = post.date;
      adminAuthorInput.value = post.author;
      adminHeroInput.value = post.hero;
      adminHeroPreview.src = post.hero;
      adminHeroPreview.style.display = post.hero ? 'block' : 'none';
      adminExcerptInput.value = post.excerpt;
      adminContentInput.value = Array.isArray(post.content) ? post.content.join('\n') : post.content;
      adminCategoriesInput.value = Array.isArray(post.categories) ? post.categories.join(', ') : post.categories;
      adminGalleryInput.value = Array.isArray(post.gallery) ? post.gallery.join(', ') : post.gallery;
      adminSubmitButton.textContent = 'Update';
    } catch (error) {
      console.error('Error fetching post for edit:', error);
      showStatus('Failed to load post for editing.', true);
    }
  };

  // Handle form submission (Create/Update)
  adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = adminIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE_URL}/${id}` : API_BASE_URL;

    const payload = {
      title: adminTitleInput.value,
      date: adminDateInput.value,
      author: adminAuthorInput.value,
      hero: adminHeroInput.value,
      excerpt: adminExcerptInput.value,
      content: adminContentInput.value.split('\n').map(s => s.trim()).filter(Boolean),
      categories: adminCategoriesInput.value.split(',').map(s => s.trim()).filter(Boolean),
      gallery: adminGalleryInput.value.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      showStatus(`Post ${id ? 'updated' : 'created'} successfully!`);
      adminForm.reset();
      adminHeroPreview.style.display = 'none';
      adminIdInput.value = ''; // Clear hidden ID
      adminSubmitButton.textContent = 'Save';
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error('Error saving post:', error);
      showStatus(`Failed to save post: ${error.message}`, true);
    }
  });

  // Handle delete operation
  const deletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      showStatus('Post deleted successfully!');
      fetchPosts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting post:', error);
      showStatus(`Failed to delete post: ${error.message}`, true);
    }
  };

  // Handle form reset
  adminHeroUploadInput.addEventListener('change', async () => {
    const file = adminHeroUploadInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      adminHeroInput.value = data.filePath;
      adminHeroPreview.src = data.filePath;
      adminHeroPreview.style.display = 'block';
      showStatus('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      showStatus('Image upload failed.', true);
    }
  });

  // Handle form reset
  adminResetButton.addEventListener('click', () => {
    adminForm.reset();
    adminIdInput.value = '';
    adminSubmitButton.textContent = 'Save';
    adminHeroPreview.style.display = 'none';
    showStatus('Form reset.');
  });

  // Initial auth check when the page loads
  checkAuth();
});