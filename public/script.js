/* ========================================
   Rawad Health - Frontend JavaScript
   Connected to Express + MongoDB Backend
   ======================================== */

const API_BASE = window.location.origin; // e.g. http://localhost:5000

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initBackToTop();
  initCurrentPage();
});

// ===== Navbar =====
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const header = document.querySelector('.header');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .slide-right, .slide-left');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ===== Back to Top =====
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== Current Page Logic =====
function initCurrentPage() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') {
    initHomePage();
  } else if (page === 'jobs.html') {
    initJobsPage();
  } else if (page === 'job-details.html') {
    initJobDetailsPage();
  } else if (page === 'apply.html') {
    initApplyPage();
  } else if (page === 'contact.html') {
    initContactPage();
  }
}

// ===========================
//        HOME PAGE
// ===========================
async function initHomePage() {
  animateCounters();
  await renderFeaturedJobs();
}

async function renderFeaturedJobs() {
  const grid = document.getElementById('featured-jobs-grid');
  if (!grid) return;

  try {
    const res = await fetch(`${API_BASE}/api/jobs`);
    const jobs = await res.json();
    const featured = jobs.slice(0, 3);

    if (featured.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1;">لا توجد وظائف متاحة حالياً</p>';
      return;
    }

    grid.innerHTML = featured.map(job => `
      <div class="job-card fade-in">
        <div class="job-card-header">
          <div class="job-company-logo">${job.companyLogo || '🏥'}</div>
          <div>
            <h3>${job.title}</h3>
            <span>${job.company}</span>
          </div>
        </div>
        <div class="job-tags">
          <span class="job-tag tag-specialty">${job.specialty.replace('-', ' ')}</span>
          <span class="job-tag tag-city">${job.city}</span>
          <span class="job-tag tag-type">${job.jobType.replace('-', ' ')}</span>
        </div>
        <div class="job-salary">${job.salary}</div>
        <div class="job-card-footer">
          <span class="job-date">${formatDate(job.createdAt)}</span>
          <a href="job-details.html?id=${job._id}" class="job-apply-link">عرض التفاصيل ←</a>
        </div>
      </div>
    `).join('');

    initScrollAnimations();
  } catch (err) {
    console.error('Error loading featured jobs:', err);
    grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1;">خطأ في تحميل الوظائف</p>';
  }
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = Math.floor(current).toLocaleString('ar-SA') + suffix;
    }, 30);
  });
}

// ===========================
//        JOBS PAGE
// ===========================
let allJobs = []; // cache for client-side filtering

async function initJobsPage() {
  await loadAllJobs();

  const filterBtn = document.getElementById('filter-btn');
  if (filterBtn) filterBtn.addEventListener('click', applyFilters);

  document.querySelectorAll('.filters-grid select').forEach(select => {
    select.addEventListener('change', applyFilters);
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', debounce(applyFilters, 300));
}

async function loadAllJobs() {
  const list = document.getElementById('jobs-list');
  if (list) list.innerHTML = '<div class="text-center" style="padding:40px;"><div class="loading-spinner"></div><p>جاري تحميل الوظائف...</p></div>';

  try {
    const res = await fetch(`${API_BASE}/api/jobs`);
    allJobs = await res.json();
    renderJobsList(allJobs);
  } catch (err) {
    console.error('Error loading jobs:', err);
    if (list) list.innerHTML = '<p style="text-align:center;color:#e74c3c;padding:40px;">خطأ في تحميل الوظائف. تأكد من أن السيرفر يعمل.</p>';
  }
}

function applyFilters() {
  const specialty  = document.getElementById('filter-specialty')?.value || '';
  const city       = document.getElementById('filter-city')?.value || '';
  const facilityType = document.getElementById('filter-facility')?.value || '';
  const jobType    = document.getElementById('filter-type')?.value || '';
  const searchTerm = document.getElementById('search-input')?.value?.toLowerCase() || '';

  let filtered = allJobs.filter(job => {
    if (specialty && job.specialty !== specialty) return false;
    if (city && job.city !== city) return false;
    if (facilityType && job.facilityType !== facilityType) return false;
    if (jobType && job.jobType !== jobType) return false;
    if (searchTerm) {
      const searchable = `${job.title} ${job.company} ${job.description}`.toLowerCase();
      if (!searchable.includes(searchTerm)) return false;
    }
    return true;
  });

  renderJobsList(filtered);
}

function renderJobsList(jobs) {
  const list = document.getElementById('jobs-list');
  const countEl = document.getElementById('jobs-count');
  if (!list) return;

  if (countEl) countEl.textContent = jobs.length;

  if (jobs.length === 0) {
    list.innerHTML = `
      <div class="text-center" style="padding: 60px 20px;">
        <div style="font-size: 3rem; margin-bottom: 15px;">🔍</div>
        <h3 style="color: #023E8A; margin-bottom: 10px;">لم يتم العثور على نتائج</h3>
        <p style="color: #666;">جرّب تغيير معايير البحث أو الفلاتر</p>
      </div>`;
    return;
  }

  list.innerHTML = jobs.map(job => `
    <div class="job-list-card fade-in">
      <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
        <div class="job-company-logo">${job.companyLogo || '🏥'}</div>
        <div class="job-list-info">
          <h3>${job.title}</h3>
          <div class="company-name">${job.company}</div>
          <div class="job-list-meta">
            <span>📍 ${job.city}</span>
            <span>🏥 ${job.facilityType}</span>
            <span>⏰ ${job.jobType.replace('-', ' ')}</span>
            <span>📅 ${formatDate(job.createdAt)}</span>
          </div>
        </div>
      </div>
      <div class="job-list-actions">
        <div class="job-list-salary">${job.salary}</div>
        <a href="job-details.html?id=${job._id}" class="btn btn-primary" style="padding: 8px 24px; font-size: 0.9rem;">عرض التفاصيل</a>
      </div>
    </div>
  `).join('');

  initScrollAnimations();
}

// ===========================
//      JOB DETAILS PAGE
// ===========================
async function initJobDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('id');

  if (!jobId) {
    setTextContent('job-title', 'الوظيفة غير موجودة');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/jobs/${jobId}`);
    if (!res.ok) throw new Error('Not found');
    const job = await res.json();

    setTextContent('job-title', job.title);
    setTextContent('job-company', job.company);
    setTextContent('job-description', job.description);
    setTextContent('job-salary-value', job.salary);
    setTextContent('job-city-value', job.city);
    setTextContent('job-type-value', job.jobType.replace('-', ' '));
    setTextContent('job-specialty-value', job.specialty.replace('-', ' '));
    setTextContent('job-facility-value', job.facilityType);
    setTextContent('job-date-value', formatDate(job.createdAt));

    renderList('job-tasks-list', job.tasks);
    renderList('job-requirements-list', job.requirements);
    renderList('job-benefits-list', job.benefits);

    const applyBtn = document.getElementById('apply-btn');
    if (applyBtn) applyBtn.href = `apply.html?job=${encodeURIComponent(job.title)}&id=${job._id}`;

    const applySidebarBtn = document.getElementById('apply-sidebar-btn');
    if (applySidebarBtn) applySidebarBtn.href = `apply.html?job=${encodeURIComponent(job.title)}&id=${job._id}`;

  } catch (err) {
    console.error('Error loading job details:', err);
    setTextContent('job-title', 'الوظيفة غير موجودة');
    setTextContent('job-description', 'لم نتمكن من تحميل بيانات الوظيفة. تأكد من أن الرابط صحيح.');
  }
}

// ===========================
//       APPLY PAGE
// ===========================
function initApplyPage() {
  const params = new URLSearchParams(window.location.search);
  const jobTitle = params.get('job');
  const jobId = params.get('id');

  if (jobTitle) {
    const titleEl = document.getElementById('apply-job-title');
    if (titleEl) titleEl.textContent = `التقديم على: ${decodeURIComponent(jobTitle)}`;
  }

  // File upload UX
  const fileUpload = document.querySelector('.file-upload');
  const fileInput = document.getElementById('cv-file');
  const fileName = document.getElementById('file-name');

  if (fileUpload && fileInput) {
    fileUpload.addEventListener('click', () => fileInput.click());
    fileUpload.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileUpload.style.borderColor = '#0077B6';
      fileUpload.style.background = 'rgba(0, 119, 182, 0.05)';
    });
    fileUpload.addEventListener('dragleave', () => {
      fileUpload.style.borderColor = '#d0d0d0';
      fileUpload.style.background = '#FAFAFA';
    });
    fileUpload.addEventListener('drop', (e) => {
      e.preventDefault();
      fileUpload.style.borderColor = '#d0d0d0';
      fileUpload.style.background = '#FAFAFA';
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        updateFileName(fileInput, fileName);
      }
    });
    fileInput.addEventListener('change', () => updateFileName(fileInput, fileName));
  }

  // Form submission — send to API
  const form = document.getElementById('apply-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateApplyForm(form)) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '⏳ جاري الإرسال...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        // Add job info from URL
        if (jobId) formData.append('jobId', jobId);
        if (jobTitle) formData.append('jobTitle', decodeURIComponent(jobTitle));

        const res = await fetch(`${API_BASE}/api/applications`, {
          method: 'POST',
          body: formData
        });

        const result = await res.json();

        if (!res.ok) {
          const errorMsg = result.details ? (Array.isArray(result.details) ? result.details.join('\n') : result.details) : result.error;
          showAlert('error-alert', errorMsg);
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          return;
        }

        showModal('success-modal');
        form.reset();
        if (fileName) fileName.textContent = '';
      } catch (err) {
        console.error('Submit error:', err);
        showAlert('error-alert', 'حدث خطأ في إرسال الطلب. تأكد من أن السيرفر يعمل.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

function updateFileName(input, display) {
  if (input.files.length && display) {
    display.textContent = `✅ ${input.files[0].name}`;
    display.style.color = '#2D9F4E';
    display.style.fontWeight = '600';
  }
}

function validateApplyForm(form) {
  const required = form.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    if (!field.value || !field.value.trim()) {
      field.style.borderColor = '#E74C3C';
      valid = false;
      field.addEventListener('input', () => { field.style.borderColor = '#e8e8e8'; }, { once: true });
    }
  });

  // Check phone pattern
  const phone = form.querySelector('[name="phone"]');
  if (phone && phone.value && !/^05[0-9]{8}$/.test(phone.value.trim())) {
    phone.style.borderColor = '#E74C3C';
    valid = false;
  }

  // Check email pattern
  const email = form.querySelector('[name="email"]');
  if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    email.style.borderColor = '#E74C3C';
    valid = false;
  }

  // Check file
  const fileInput = document.getElementById('cv-file');
  if (fileInput && !fileInput.files.length) {
    valid = false;
  }

  if (!valid) showAlert('error-alert', 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
  return valid;
}

// ===========================
//      CONTACT PAGE
// ===========================
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#E74C3C';
          valid = false;
          field.addEventListener('input', () => { field.style.borderColor = '#e8e8e8'; }, { once: true });
        }
      });
      if (valid) {
        showModal('success-modal');
        form.reset();
      } else {
        showAlert('error-alert', 'يرجى ملء جميع الحقول المطلوبة');
      }
    });
  }
}

// ===========================
//     UTILITY FUNCTIONS
// ===========================
function setTextContent(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderList(id, items) {
  const el = document.getElementById(id);
  if (!el || !items) return;
  el.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'اليوم';
  if (diffDays === 1) return 'منذ يوم';
  if (diffDays === 2) return 'منذ يومين';
  if (diffDays <= 7) return `منذ ${diffDays} أيام`;
  if (diffDays <= 14) return 'منذ أسبوع';
  if (diffDays <= 30) return 'منذ أسبوعين';
  return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showAlert(id, message) {
  const alert = document.getElementById(id);
  if (!alert) return;
  alert.textContent = message;
  alert.style.display = 'block';
  setTimeout(() => { alert.style.display = 'none'; }, 5000);
}

function showModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-close-btn')) {
      modal.classList.remove('active');
    }
  });
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
