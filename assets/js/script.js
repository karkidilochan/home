'use strict';

// Element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// Sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// Contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// Add event to all form input fields
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// Page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Add event to all nav links
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
  });
}

// Projects and filter functionality
document.addEventListener('DOMContentLoaded', () => {
  const projectList = document.getElementById('project-list');
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('.select-value');

  if (!projectList) console.error('Project list not found');
  if (!selectValue) console.error('Select value element not found');
  if (!select) console.error('Select button not found');

  fetch('./assets/data/projects.json')
    .then(response => response.json())
    .then(projects => {
      // Sort projects by year (most recent first)
      projects.sort((a, b) => b.year - a.year);

      function renderProjects(filter = 'all') {
        projectList.innerHTML = '';
        projects.forEach(project => {
          if (filter === 'all' || project.category.toLowerCase() === filter.toLowerCase()) {
            const projectItem = document.createElement('li');
            projectItem.className = 'project-item active';
            projectItem.setAttribute('data-filter-item', '');
            projectItem.setAttribute('data-category', project.category);
            projectItem.innerHTML = `
              <a href="${project.link}" target="_blank" rel="noopener noreferrer">
                <figure class="project-img">
                  <div class="project-item-icon-box">
                    <ion-icon name="eye-outline"></ion-icon>
                  </div>
                  <img src="${project.image}" alt="${project.title}" loading="lazy" width="200" height="200">
                </figure>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-category">${project.category} </p>
              </a>
            `;
            projectList.appendChild(projectItem);
          }
        });
      }

      renderProjects();

      let lastClickedBtn = filterButtons[0];
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          lastClickedBtn = button;
          const filterValue = button.textContent.toLowerCase();
          if (selectValue) selectValue.innerText = button.textContent;
          renderProjects(filterValue);
        });
      });

      select.addEventListener("click", function () { elementToggleFunc(this); });

      for (let i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener("click", function () {
          const selectedValue = this.innerText.toLowerCase();
          if (selectValue) selectValue.innerText = this.innerText;
          elementToggleFunc(select);
          renderProjects(selectedValue);
        });
      }
    })
    .catch(error => console.error('Error loading projects:', error));
});