/* ========================================
   Rawad Health - JavaScript
   ======================================== */

// Mark HTML as JS-capable (ensures fade-in sections are always visible if JS fails)
document.documentElement.classList.add('has-js');


// ===== Jobs Cache (loaded from Firestore) =====
let jobsCache = [];

// REMOVED: static jobsData = [
// Helper: get job field (Firestore jobs — returns field directly)
function getJobField(job, field) {
  return job[field];
}

// Helper: get UI string from translations
function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || key;
}

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initBackToTop();
  initCurrentPage();
  initAuthNav();
});

// ===== Auth Nav =====
function initAuthNav() {
  firebase.auth().onAuthStateChanged(function (user) {
    const authButtons    = document.getElementById('authButtons');
    const userMenu       = document.getElementById('userMenu');
    const userGreeting   = document.getElementById('userGreeting');
    // Mobile drawer auth elements
    const mobileAuthBtns = document.getElementById('mobileAuthButtons');
    const mobileUserMenu = document.getElementById('mobileUserMenu');
    const mobileGreeting = document.getElementById('mobileUserGreeting');
    // Mobile header auth elements (always-visible next to hamburger)
    const mobileHdrAuthBtns = document.getElementById('mobileHdrAuthBtns');
    const mobileHdrUser     = document.getElementById('mobileHdrUser');
    const mobileHdrGreeting = document.getElementById('mobileHdrGreeting');

    if (user) {
      firebase.firestore().collection('users').doc(user.uid).get().then(function (doc) {
        const userData    = doc.exists ? doc.data() : {};
        const displayName = userData.orgName || userData.name || user.displayName || 'Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…';
        localStorage.setItem('rawad_current_user', JSON.stringify(Object.assign({}, userData, { uid: user.uid })));
        // Desktop
        if (authButtons)    authButtons.style.display    = 'none';
        if (userMenu)       userMenu.style.display        = 'flex';
        if (userGreeting)   userGreeting.textContent      = 'Ù…Ø±Ø­Ø¨Ø§Ù‹ØŒ ' + displayName;
        // Mobile drawer
        if (mobileAuthBtns) mobileAuthBtns.style.display  = 'none';
        if (mobileUserMenu) mobileUserMenu.style.display   = 'flex';
        if (mobileGreeting) mobileGreeting.textContent     = 'Ù…Ø±Ø­Ø¨Ø§Ù‹ØŒ ' + displayName;
        // Mobile header
        if (mobileHdrAuthBtns) mobileHdrAuthBtns.style.display = 'none';
        if (mobileHdrUser)     mobileHdrUser.style.display     = 'flex';
        if (mobileHdrGreeting) mobileHdrGreeting.textContent   = displayName;
      });
    } else {
      localStorage.removeItem('rawad_current_user');
      // Desktop
      if (authButtons)    authButtons.style.display    = 'flex';
      if (userMenu)       userMenu.style.display        = 'none';
      // Mobile drawer
      if (mobileAuthBtns) mobileAuthBtns.style.display  = 'flex';
      if (mobileUserMenu) mobileUserMenu.style.display   = 'none';
      // Mobile header
      if (mobileHdrAuthBtns) mobileHdrAuthBtns.style.display = 'flex';
      if (mobileHdrUser)     mobileHdrUser.style.display     = 'none';
    }
  });
}

function authLogout() {
  firebase.auth().signOut().then(function () {
    localStorage.removeItem('rawad_current_user');
    window.location.href = 'index.html';
  });
}

// ===== Navbar =====
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks   = document.querySelector('.nav-links');
  const header     = document.querySelector('.header');

  // â”€â”€ Inject mobile-only auth section into nav drawer (hidden on desktop via CSS) â”€â”€
  if (navLinks && !navLinks.querySelector('.mobile-auth')) {
    const mobileAuth = document.createElement('div');
    mobileAuth.className = 'mobile-auth';
    mobileAuth.innerHTML = [
      '<div class="mobile-auth-divider"></div>',
      '<div class="mobile-auth-inner" id="mobileAuthButtons">',
        '<a href="login.html"    class="btn btn-outline  mobile-auth-btn">ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„</a>',
        '<a href="register.html" class="btn btn-primary  mobile-auth-btn">Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨</a>',
      '</div>',
      '<div class="mobile-user-section" id="mobileUserMenu" style="display:none;">',
        '<span class="mobile-user-greeting" id="mobileUserGreeting"></span>',
        '<button class="btn btn-outline mobile-auth-btn" onclick="authLogout()">ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬</button>',
      '</div>'
    ].join('');
    navLinks.appendChild(mobileAuth);
  }

  // â”€â”€ Inject always-visible mobile auth buttons next to hamburger â”€â”€
  const navbar = document.querySelector('.navbar');
  if (navbar && !navbar.querySelector('.mobile-header-auth')) {
    const mobileHdrAuth = document.createElement('div');
    mobileHdrAuth.className = 'mobile-header-auth';
    mobileHdrAuth.innerHTML = [
      '<div id="mobileHdrAuthBtns" style="display:flex;gap:6px;">',
        '<a href="login.html"    class="btn btn-outline  mobile-hdr-btn">ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„</a>',
        '<a href="register.html" class="btn btn-primary  mobile-hdr-btn">Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨</a>',
      '</div>',
      '<div id="mobileHdrUser" style="display:none;align-items:center;gap:8px;">',
        '<span id="mobileHdrGreeting" class="mobile-hdr-greeting"></span>',
        '<button class="btn btn-outline mobile-hdr-btn" onclick="authLogout()">Ø®Ø±ÙˆØ¬</button>',
      '</div>'
    ].join('');
    // Insert before hamburger so it appears to its left
    if (hamburger) {
      navbar.insertBefore(mobileHdrAuth, hamburger);
    } else {
      navbar.appendChild(mobileHdrAuth);
    }
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      // Prevent body scroll when menu is open
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on any link or button click inside it
    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Scroll effect
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Set active link
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

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
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

// ===== Home Page =====
function initHomePage() {
  renderFeaturedJobs();
  animateCounters();
}

function renderFeaturedJobs() {
  const grid = document.getElementById('featured-jobs-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="text-center" style="padding:40px;color:#888;">جاري التحميل...</div>';

  firebase.firestore().collection('jobs')
    .orderBy('createdAt', 'desc')
    .limit(3)
    .get()
    .then(function (snapshot) {
      const jobs = [];
      snapshot.forEach(function (doc) {
        jobs.push(Object.assign({ firestoreId: doc.id }, doc.data()));
      });

      if (jobs.length === 0) {
        grid.innerHTML = '<div class="text-center" style="padding:40px;color:#888;font-size:1rem;">لا يوجد وظائف متاحة حالياً</div>';
        return;
      }

      const viewDetailsText = currentLang === 'en' ? 'View Details →' : 'عرض التفاصيل ←';
      grid.innerHTML = jobs.map(function (job) {
        return `
          <div class="job-card fade-in">
            <div class="job-card-header">
              <div class="job-company-logo">${job.companyLogo || '🏥'}</div>
              <div>
                <h3>${job.title || ''}</h3>
                <span>${job.company || ''}</span>
              </div>
            </div>
            <div class="job-tags">
              <span class="job-tag tag-specialty">${job.specialty || ''}</span>
              <span class="job-tag tag-city">${job.city || ''}</span>
              <span class="job-tag tag-type">${job.jobType || ''}</span>
            </div>
            <div class="job-salary">${job.salary || ''}</div>
            <div class="job-card-footer">
              <span class="job-date">${job.date || ''}</span>
              <a href="job-details.html?id=${job.firestoreId}" class="job-apply-link">${viewDetailsText}</a>
            </div>
          </div>`;
      }).join('');
      initScrollAnimations();
    })
    .catch(function () {
      grid.innerHTML = '<div class="text-center" style="padding:40px;color:#888;">تعذّر تحميل الوظائف</div>';
    });
}
  const viewDetailsText = currentLang === 'en' ? 'View Details â†’' : 'Ø¹Ø±Ø¶ Ø§Ù„ØªÙØ§ØµÙŠÙ„ â†';
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count], .stat-card-number[data-count]');
  const locale = currentLang === 'en' ? 'en-US' : 'ar-SA';
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current).toLocaleString(locale) + suffix;
    }, 30);
  });
}

// ===== Jobs Page =====
function loadJobsFromFirestore() {
  const list = document.getElementById('jobs-list');
  const countEl = document.getElementById('jobs-count');
  if (!list) return;

  list.innerHTML = '<div class="text-center" style="padding:60px 20px;"><div style="font-size:2rem;margin-bottom:12px;">⏳</div><p style="color:#888;">جاري تحميل الوظائف...</p></div>';

  firebase.firestore().collection('jobs')
    .orderBy('createdAt', 'desc')
    .get()
    .then(function (snapshot) {
      jobsCache = [];
      snapshot.forEach(function (doc) {
        jobsCache.push(Object.assign({ firestoreId: doc.id }, doc.data()));
      });
      renderJobsList(jobsCache);
    })
    .catch(function () {
      list.innerHTML = '<div class="text-center" style="padding:60px 20px;"><p style="color:#888;">تعذّر تحميل الوظائف، حاول مجدداً.</p></div>';
    });
}

function initJobsPage() {
  loadJobsFromFirestore();

  const filterBtn = document.getElementById('filter-btn');
  if (filterBtn) filterBtn.addEventListener('click', applyFilters);

  document.querySelectorAll('.filters-grid select').forEach(function (select) {
    select.addEventListener('change', applyFilters);
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', debounce(applyFilters, 300));
}

function applyFilters() {
  const specialty   = document.getElementById('filter-specialty')?.value || '';
  const city        = document.getElementById('filter-city')?.value || '';
  const facilityType = document.getElementById('filter-facility')?.value || '';
  const jobType     = document.getElementById('filter-type')?.value || '';
  const searchTerm  = (document.getElementById('search-input')?.value || '').toLowerCase();

  const filtered = jobsCache.filter(function (job) {
    if (specialty    && job.specialty    !== specialty)    return false;
    if (city         && job.city         !== city)         return false;
    if (facilityType && job.facilityType !== facilityType) return false;
    if (jobType      && job.jobType      !== jobType)      return false;
    if (searchTerm) {
      const s = ((job.title || '') + ' ' + (job.company || '') + ' ' + (job.description || '')).toLowerCase();
      if (!s.includes(searchTerm)) return false;
    }
    return true;
  });

  renderJobsList(filtered);
}

function renderJobsList(jobs) {
  const list    = document.getElementById('jobs-list');
  const countEl = document.getElementById('jobs-count');
  if (!list) return;

  if (countEl) countEl.textContent = jobs.length;

  const hasFilter = (document.getElementById('filter-specialty')?.value  || '') ||
                    (document.getElementById('filter-city')?.value        || '') ||
                    (document.getElementById('filter-facility')?.value    || '') ||
                    (document.getElementById('filter-type')?.value        || '') ||
                    (document.getElementById('search-input')?.value       || '');

  if (jobs.length === 0) {
    const title = hasFilter
      ? (currentLang === 'en' ? 'No results found' : 'لم يتم العثور على نتائج')
      : (currentLang === 'en' ? 'No jobs available at the moment' : 'لا يوجد وظائف متاحة حالياً');
    const desc  = hasFilter
      ? (currentLang === 'en' ? 'Try changing your search criteria or filters' : 'جرّب تغيير معايير البحث أو الفلاتر')
      : '';
    list.innerHTML = `
      <div class="no-jobs-msg">
        <div class="no-jobs-icon">💼</div>
        <h3>${title}</h3>
        ${desc ? `<p>${desc}</p>` : ''}
      </div>`;
    return;
  }

  const viewDetailsText = currentLang === 'en' ? 'View Details' : 'عرض التفاصيل';
  list.innerHTML = jobs.map(function (job) {
    return `
      <div class="job-list-card fade-in">
        <div style="display:flex;align-items:center;gap:20px;flex:1;">
          <div class="job-company-logo">${job.companyLogo || '🏥'}</div>
          <div class="job-list-info">
            <h3>${job.title || ''}</h3>
            <div class="company-name">${job.company || ''}</div>
            <div class="job-list-meta">
              <span>📍 ${job.city || '-'}</span>
              <span>🏥 ${job.facilityType || '-'}</span>
              <span>⏰ ${job.jobType || '-'}</span>
              <span>📅 ${job.date || ''}</span>
            </div>
          </div>
        </div>
        <div class="job-list-actions">
          <div class="job-list-salary">${job.salary || ''}</div>
          <a href="job-details.html?id=${job.firestoreId}" class="btn btn-primary" style="padding:8px 24px;font-size:0.9rem;">${viewDetailsText}</a>
        </div>
      </div>`;
  }).join('');
  initScrollAnimations();
}

// ===== Job Details Page =====
function initJobDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const jobId  = params.get('id');

  if (!jobId) {
    setTextContent('job-title', 'الوظيفة غير موجودة');
    return;
  }

  firebase.firestore().collection('jobs').doc(jobId).get()
    .then(function (doc) {
      if (!doc.exists) {
        setTextContent('job-title', 'الوظيفة غير موجودة');
        return;
      }
      const job = doc.data();

      setTextContent('job-title',          job.title        || '');
      setTextContent('job-company',        job.company      || '');
      setTextContent('job-description',    job.description  || '');
      setTextContent('job-salary-value',   job.salary       || '-');
      setTextContent('job-city-value',     job.city         || '-');
      setTextContent('job-type-value',     job.jobType      || '-');
      setTextContent('job-specialty-value',job.specialty    || '-');
      setTextContent('job-facility-value', job.facilityType || '-');
      setTextContent('job-date-value',     job.date         || '-');

      renderList('job-tasks-list',        job.tasks);
      renderList('job-requirements-list', job.requirements);
      renderList('job-benefits-list',     job.benefits);

      const link = `apply.html?job=${encodeURIComponent(job.title || '')}&id=${doc.id}`;
      const applyBtn = document.getElementById('apply-btn');
      if (applyBtn) applyBtn.href = link;
      const applySidebarBtn = document.getElementById('apply-sidebar-btn');
      if (applySidebarBtn) applySidebarBtn.href = link;
    })
    .catch(function () {
      setTextContent('job-title', 'تعذّر تحميل الوظيفة');
    });
}

function setTextContent(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderList(id, items) {
  const el = document.getElementById(id);
  if (!el || !items) return;
  el.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}

// ===== Apply Page =====
function initApplyPage() {
  const params = new URLSearchParams(window.location.search);
  const jobTitle = params.get('job');
  const jobId = params.get('id');

  if (jobTitle) {
    const titleEl = document.getElementById('apply-job-title');
    if (titleEl) titleEl.textContent = `Ø§Ù„ØªÙ‚Ø¯ÙŠÙ… Ø¹Ù„Ù‰: ${decodeURIComponent(jobTitle)}`;
  }

  // File upload
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

  // Form submission
  const form = document.getElementById('apply-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateApplyForm(form)) {
        showModal('success-modal');
        form.reset();
        if (fileName) fileName.textContent = '';
      }
    });
  }
}

function updateFileName(input, display) {
  if (input.files.length && display) {
    display.textContent = `âœ… ${input.files[0].name}`;
    display.style.color = '#2D9F4E';
    display.style.fontWeight = '600';
  }
}

function validateApplyForm(form) {
  const required = form.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#E74C3C';
      valid = false;
      field.addEventListener('input', () => {
        field.style.borderColor = '#e8e8e8';
      }, { once: true });
    }
  });

  if (!valid) {
    const msg = currentLang === 'en' ? 'Please fill in all required fields' : 'ÙŠØ±Ø¬Ù‰ Ù…Ù„Ø¡ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©';
    showAlert('error-alert', msg);
  }

  return valid;
}

// ===== Contact Page =====
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
          field.addEventListener('input', () => {
            field.style.borderColor = '#e8e8e8';
          }, { once: true });
        }
      });

      if (valid) {
        showModal('success-modal');
        form.reset();
      } else {
        const msg = currentLang === 'en' ? 'Please fill in all required fields' : 'ÙŠØ±Ø¬Ù‰ Ù…Ù„Ø¡ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©';
        showAlert('error-alert', msg);
      }
    });
  }
}

// ===== Utility Functions =====
function showAlert(id, message) {
  const alert = document.getElementById(id);
  if (!alert) return;
  alert.textContent = message;
  alert.style.display = 'block';
  setTimeout(() => {
    alert.style.display = 'none';
  }, 5000);
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

// ===== Counter Animation for Stats =====
function startCountAnimation(element, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const locale = currentLang === 'en' ? 'en-US' : 'ar-SA';

  function update() {
    start += step;
    if (start >= target) {
      element.textContent = target.toLocaleString(locale);
      return;
    }
    element.textContent = Math.floor(start).toLocaleString(locale);
    requestAnimationFrame(update);
  }

  update();
}

// ===== Language Switcher (i18n) =====
const translations = {
  ar: {
    // Header / Nav
    langLabel: 'EN',
    navHome: 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©',
    navJobs: 'Ø§Ù„ÙˆØ¸Ø§Ø¦Ù',
    navContact: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§',
    browseJobs: 'ØªØµÙØ­ Ø§Ù„ÙˆØ¸Ø§Ø¦Ù',

    // Hero
    heroBadge: 'ðŸ¥ Ø§Ù„Ù…Ù†ØµØ© Ø§Ù„ØµØ­ÙŠØ© Ø§Ù„Ø£ÙˆÙ„Ù‰ ÙÙŠ Ø§Ù„Ù…Ù…Ù„ÙƒØ©',
    heroTitle: 'ÙˆØ¸ÙŠÙØªÙƒ Ø§Ù„ØµØ­ÙŠØ© <span>ØªØ¨Ø¯Ø£ Ù…Ù† Ù‡Ù†Ø§</span>',
    heroDesc: 'Ù…Ù†ØµØ© Rawad Health ØªØ±Ø¨Ø· Ø§Ù„ÙƒÙØ§Ø¡Ø§Øª Ø§Ù„ØµØ­ÙŠØ© Ø¨Ø£ÙØ¶Ù„ Ø§Ù„Ù…Ù†Ø´Ø¢Øª Ø§Ù„Ø·Ø¨ÙŠØ© ÙÙŠ Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©. Ø§ÙƒØªØ´Ù ÙØ±ØµØ§Ù‹ Ù…Ù…ÙŠØ²Ø© ØªÙ†Ø§Ø³Ø¨ ØªØ®ØµØµÙƒ ÙˆØ·Ù…ÙˆØ­Ùƒ Ø§Ù„Ù…Ù‡Ù†ÙŠ.',
    heroBtnJobs: 'ØªØµÙØ­ Ø§Ù„ÙˆØ¸Ø§Ø¦Ù Ø§Ù„Ù…ØªØ§Ø­Ø©',
    heroBtnContact: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§',

    // Hero stats
    statJobs: 'ÙˆØ¸ÙŠÙØ© Ù…ØªØ§Ø­Ø©',
    statFacilities: 'Ù…Ù†Ø´Ø£Ø© ØµØ­ÙŠØ©',
    statHired: 'ØªÙ… ØªÙˆØ¸ÙŠÙÙ‡Ù…',

    // Features
    featuresBadge: 'Ù…Ù…ÙŠØ²Ø§ØªÙ†Ø§',
    featuresTitle: 'Ù„Ù…Ø§Ø°Ø§ ØªØ®ØªØ§Ø± Rawad HealthØŸ',
    featuresDesc: 'Ù†Ù‚Ø¯Ù… Ù„Ùƒ ØªØ¬Ø±Ø¨Ø© ØªÙˆØ¸ÙŠÙ ØµØ­ÙŠ Ù…ØªÙƒØ§Ù…Ù„Ø© ÙˆÙ…Ù…ÙŠØ²Ø©',
    feat1Title: 'ÙˆØ¸Ø§Ø¦Ù Ù…ØªØ®ØµØµØ©',
    feat1Desc: 'Ù†ÙˆÙØ± ÙˆØ¸Ø§Ø¦Ù ÙÙŠ Ø¬Ù…ÙŠØ¹ Ø§Ù„ØªØ®ØµØµØ§Øª Ø§Ù„ØµØ­ÙŠØ© Ù…Ù† Ø§Ù„Ø·Ø¨ ÙˆØ§Ù„ØªÙ…Ø±ÙŠØ¶ Ø¥Ù„Ù‰ Ø§Ù„ØµÙŠØ¯Ù„Ø© ÙˆØ§Ù„Ø¹Ù„Ø§Ø¬ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠ ÙˆØ§Ù„Ù…Ø®ØªØ¨Ø±Ø§Øª.',
    feat2Title: 'Ù…Ù†Ø´Ø¢Øª Ù…ÙˆØ«ÙˆÙ‚Ø©',
    feat2Desc: 'Ù†ØªØ¹Ø§ÙˆÙ† Ù…Ø¹ Ø£ÙØ¶Ù„ Ø§Ù„Ù…Ø³ØªØ´ÙÙŠØ§Øª ÙˆØ§Ù„Ù…Ø±Ø§ÙƒØ² Ø§Ù„Ø·Ø¨ÙŠØ© ÙˆØ§Ù„Ø¹ÙŠØ§Ø¯Ø§Øª Ø§Ù„Ù…Ø±Ø®ØµØ© ÙÙŠ Ø¬Ù…ÙŠØ¹ Ø£Ù†Ø­Ø§Ø¡ Ø§Ù„Ù…Ù…Ù„ÙƒØ©.',
    feat3Title: 'ØªÙ‚Ø¯ÙŠÙ… Ø³Ø±ÙŠØ¹',
    feat3Desc: 'Ù‚Ø¯Ù‘Ù… Ø¹Ù„Ù‰ Ø§Ù„ÙˆØ¸Ø§Ø¦Ù Ø¨Ø³Ù‡ÙˆÙ„Ø© ÙˆØ³Ø±Ø¹Ø© Ù…Ù† Ø®Ù„Ø§Ù„ Ù†Ù…ÙˆØ°Ø¬ ØªÙ‚Ø¯ÙŠÙ… Ø¨Ø³ÙŠØ· ÙˆÙ…Ø¨Ø§Ø´Ø± Ø¨Ø¯ÙˆÙ† ØªØ¹Ù‚ÙŠØ¯.',
    feat4Title: 'ØªÙ†Ø¨ÙŠÙ‡Ø§Øª ÙÙˆØ±ÙŠØ©',
    feat4Desc: 'Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ø¥Ø´Ø¹Ø§Ø±Ø§Øª ÙÙˆØ±ÙŠØ© Ø¨Ø£Ø­Ø¯Ø« Ø§Ù„ÙˆØ¸Ø§Ø¦Ù Ø§Ù„ØªÙŠ ØªÙ†Ø§Ø³Ø¨ ØªØ®ØµØµÙƒ ÙˆÙ…Ø¯ÙŠÙ†ØªÙƒ.',

    // Services
    servicesBadge: 'Ø®Ø¯Ù…Ø§ØªÙ†Ø§',
    servicesTitle: 'Ù…Ø§Ø°Ø§ Ù†Ù‚Ø¯Ù… Ù„ÙƒØŸ',
    servicesDesc: 'Ù†ÙˆÙØ± Ù„Ùƒ Ù…Ø¬Ù…ÙˆØ¹Ø© Ù…ØªÙƒØ§Ù…Ù„Ø© Ù…Ù† Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ù„Ø¯Ø¹Ù… Ù…Ø³ÙŠØ±ØªÙƒ Ø§Ù„Ù…Ù‡Ù†ÙŠØ© ÙÙŠ Ø§Ù„Ù‚Ø·Ø§Ø¹ Ø§Ù„ØµØ­ÙŠ',
    svc1Title: 'Ø§Ù„ØªÙˆØ¸ÙŠÙ Ø§Ù„Ø·Ø¨ÙŠ',
    svc1Desc: 'Ù†Ø±Ø¨Ø·Ùƒ Ø¨Ø£ÙØ¶Ù„ Ø§Ù„ÙØ±Øµ Ø§Ù„ÙˆØ¸ÙŠÙÙŠØ© ÙÙŠ Ø§Ù„Ù…Ø³ØªØ´ÙÙŠØ§Øª ÙˆØ§Ù„Ù…Ø±Ø§ÙƒØ² Ø§Ù„Ø·Ø¨ÙŠØ© Ø§Ù„Ù…Ø±Ù…ÙˆÙ‚Ø© ÙÙŠ Ø¬Ù…ÙŠØ¹ Ø£Ù†Ø­Ø§Ø¡ Ø§Ù„Ù…Ù…Ù„ÙƒØ©ØŒ ÙÙŠ Ø£ÙƒØ«Ø± Ù…Ù† 20 ØªØ®ØµØµØ§Ù‹ ØµØ­ÙŠØ§Ù‹.',
    svc2Title: 'Ø§Ù„ØªØ¯Ø±ÙŠØ¨ ÙˆØ§Ù„ØªØ·ÙˆÙŠØ±',
    svc2Desc: 'Ù†ÙˆÙØ± Ø¨Ø±Ø§Ù…Ø¬ ØªØ¯Ø±ÙŠØ¨ÙŠØ© Ù…ØªØ®ØµØµØ© Ù„Ù„ÙƒÙˆØ§Ø¯Ø± Ø§Ù„ØµØ­ÙŠØ© Ù„ØªØ¹Ø²ÙŠØ² Ù…Ù‡Ø§Ø±Ø§ØªÙ‡Ù…ØŒ ÙˆÙ…ÙˆØ§ÙƒØ¨Ø© Ø£Ø­Ø¯Ø« Ø§Ù„Ù…Ø³ØªØ¬Ø¯Ø§Øª Ø§Ù„Ø·Ø¨ÙŠØ© ÙˆØªØ·ÙˆÙŠØ± Ø£Ø¯Ø§Ø¦Ù‡Ù… Ø§Ù„Ù…Ù‡Ù†ÙŠ.',

    // Latest jobs
    latestJobsTitle: 'Ø£Ø­Ø¯Ø« Ø§Ù„ÙˆØ¸Ø§Ø¦Ù Ø§Ù„Ù…ØªØ§Ø­Ø©',
    latestJobsDesc: 'Ø§ÙƒØªØ´Ù Ø£Ø­Ø¯Ø« Ø§Ù„ÙØ±Øµ Ø§Ù„ÙˆØ¸ÙŠÙÙŠØ© ÙÙŠ Ø§Ù„Ù‚Ø·Ø§Ø¹ Ø§Ù„ØµØ­ÙŠ',
    viewAllJobs: 'Ø¹Ø±Ø¶ Ø¬Ù…ÙŠØ¹ Ø§Ù„ÙˆØ¸Ø§Ø¦Ù â†’',
    learnMore: 'Ø§Ø¹Ø±Ù Ø£ÙƒØ«Ø±',

    // CTA
    ctaTitle: 'Ø¬Ø§Ù‡Ø² Ù„Ù„Ø®Ø·ÙˆØ© Ø§Ù„Ù‚Ø§Ø¯Ù…Ø© ÙÙŠ Ù…Ø³ÙŠØ±ØªÙƒ Ø§Ù„Ù…Ù‡Ù†ÙŠØ©ØŸ',
    ctaDesc: 'Ø§Ù†Ø¶Ù… Ø¥Ù„Ù‰ Ø¢Ù„Ø§Ù Ø§Ù„Ù…Ù‡Ù†ÙŠÙŠÙ† Ø§Ù„ØµØ­ÙŠÙŠÙ† Ø§Ù„Ø°ÙŠÙ† ÙˆØ¬Ø¯ÙˆØ§ ÙˆØ¸Ø§Ø¦ÙÙ‡Ù… Ø§Ù„Ù…Ø«Ø§Ù„ÙŠØ© Ø¹Ø¨Ø± Rawad Health',
    ctaContact: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§',

    // Footer
    footerAbout: 'Ù…Ù†ØµØ© Ø§Ù„ØªÙˆØ¸ÙŠÙ Ø§Ù„ØµØ­ÙŠ Ø§Ù„Ø±Ø§Ø¦Ø¯Ø© ÙÙŠ Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©. Ù†Ø±Ø¨Ø· Ø§Ù„ÙƒÙØ§Ø¡Ø§Øª Ø§Ù„ØµØ­ÙŠØ© Ø¨Ø£ÙØ¶Ù„ Ø§Ù„ÙØ±Øµ Ø§Ù„ÙˆØ¸ÙŠÙÙŠØ© ÙÙŠ Ø§Ù„Ù‚Ø·Ø§Ø¹ Ø§Ù„ØµØ­ÙŠ.',
    quickLinks: 'Ø±ÙˆØ§Ø¨Ø· Ø³Ø±ÙŠØ¹Ø©',
    specialties: 'Ø§Ù„ØªØ®ØµØµØ§Øª',
    contactUs: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§',
    copyright: 'Â© 2026 Rawad Health. Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ‚ Ù…Ø­ÙÙˆØ¸Ø©.',
    footerAddress: 'Ø§Ù„Ø±ÙŠØ§Ø¶ØŒ Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©',

    // Jobs page
    jobsPageTitle: 'Ø§Ù„ÙˆØ¸Ø§Ø¦Ù Ø§Ù„Ù…ØªØ§Ø­Ø©',
    jobsPageDesc: 'Ø§ÙƒØªØ´Ù ÙØ±ØµØ§Ù‹ ÙˆØ¸ÙŠÙÙŠØ© Ù…Ù…ÙŠØ²Ø© ÙÙŠ Ø§Ù„Ù‚Ø·Ø§Ø¹ Ø§Ù„ØµØ­ÙŠ Ø¨Ø§Ù„Ù…Ù…Ù„ÙƒØ©',
    breadcrumbHome: 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©',
    breadcrumbJobs: 'Ø§Ù„ÙˆØ¸Ø§Ø¦Ù',
    filterSearch: 'Ø¨Ø­Ø«',
    filterSearchPlaceholder: 'Ø§Ø¨Ø­Ø« Ø¹Ù† ÙˆØ¸ÙŠÙØ©...',
    filterSpecialty: 'Ø§Ù„ØªØ®ØµØµ',
    filterAllSpecialties: 'Ø¬Ù…ÙŠØ¹ Ø§Ù„ØªØ®ØµØµØ§Øª',
    filterCity: 'Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©',
    filterAllCities: 'Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ø¯Ù†',
    filterFacility: 'Ù†ÙˆØ¹ Ø§Ù„Ù…Ù†Ø´Ø£Ø©',
    filterAllFacilities: 'Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ù†Ø´Ø¢Øª',
    filterWorkType: 'Ù†ÙˆØ¹ Ø§Ù„Ø¯ÙˆØ§Ù…',
    filterAllTypes: 'Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø£Ù†ÙˆØ§Ø¹',
    filterBtn: 'ðŸ” Ø¨Ø­Ø«',
    searchResults: 'Ù†ØªØ§Ø¦Ø¬ Ø§Ù„Ø¨Ø­Ø«:',
    jobUnit: 'ÙˆØ¸ÙŠÙØ©',
    noJobCta: 'Ù„Ù… ØªØ¬Ø¯ Ø§Ù„ÙˆØ¸ÙŠÙØ© Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø©ØŸ',
    noJobCtaDesc: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ ÙˆØ³Ù†Ø³Ø§Ø¹Ø¯Ùƒ ÙÙŠ Ø¥ÙŠØ¬Ø§Ø¯ Ø§Ù„ÙØ±ØµØ© Ø§Ù„Ù…Ø«Ø§Ù„ÙŠØ© Ø§Ù„ØªÙŠ ØªÙ†Ø§Ø³Ø¨ ØªØ®ØµØµÙƒ',

    // Specialties for filters
    specGeneral: 'Ø·Ø¨ Ø¹Ø§Ù…',
    specDentistry: 'Ø·Ø¨ Ø£Ø³Ù†Ø§Ù†',
    specNursing: 'ØªÙ…Ø±ÙŠØ¶',
    specPharmacy: 'ØµÙŠØ¯Ù„Ø©',
    specPhysio: 'Ø¹Ù„Ø§Ø¬ Ø·Ø¨ÙŠØ¹ÙŠ',
    specRadiology: 'Ø£Ø´Ø¹Ø©',
    specLab: 'Ù…Ø®ØªØ¨Ø±Ø§Øª',
    specNutrition: 'ØªØºØ°ÙŠØ© Ø¥ÙƒÙ„ÙŠÙ†ÙŠÙƒÙŠØ©',
    specOptics: 'Ø¨ØµØ±ÙŠØ§Øª',

    // Cities
    cityRiyadh: 'Ø§Ù„Ø±ÙŠØ§Ø¶',
    cityJeddah: 'Ø¬Ø¯Ø©',
    cityDammam: 'Ø§Ù„Ø¯Ù…Ø§Ù…',
    cityMadinah: 'Ø§Ù„Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ù…Ù†ÙˆØ±Ø©',
    cityMakkah: 'Ù…ÙƒØ© Ø§Ù„Ù…ÙƒØ±Ù…Ø©',
    cityTaif: 'Ø§Ù„Ø·Ø§Ø¦Ù',
    cityTabuk: 'ØªØ¨ÙˆÙƒ',
    cityAbha: 'Ø£Ø¨Ù‡Ø§',
    cityHail: 'Ø­Ø§Ø¦Ù„',

    // Facility types
    facilityHospital: 'Ù…Ø³ØªØ´ÙÙ‰',
    facilityCenter: 'Ù…Ø±ÙƒØ² Ø·Ø¨ÙŠ',
    facilityClinics: 'Ø¹ÙŠØ§Ø¯Ø§Øª',
    facilityRehab: 'Ù…Ø±ÙƒØ² ØªØ£Ù‡ÙŠÙ„',

    // Work types
    typeFullTime: 'Ø¯ÙˆØ§Ù… ÙƒØ§Ù…Ù„',
    typePartTime: 'Ø¯ÙˆØ§Ù… Ø¬Ø²Ø¦ÙŠ',
    typeContract: 'Ø¹Ù‚Ø¯ Ù…Ø¤Ù‚Øª',

    // Contact page
    contactPageTitle: 'ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§',
    contactPageDesc: 'Ù†Ø³Ø¹Ø¯ Ø¨ØªÙˆØ§ØµÙ„ÙƒÙ… ÙˆÙ†Ø±Ø­Ø¨ Ø¨Ø§Ø³ØªÙØ³Ø§Ø±Ø§ØªÙƒÙ… ÙˆÙ…Ù‚ØªØ±Ø­Ø§ØªÙƒÙ…',
    contactFormTitle: 'ðŸ“© Ø£Ø±Ø³Ù„ Ù„Ù†Ø§ Ø±Ø³Ø§Ù„Ø©',
    contactFormDesc: 'Ø³Ù†Ù‚ÙˆÙ… Ø¨Ø§Ù„Ø±Ø¯ Ø¹Ù„ÙŠÙƒ ÙÙŠ Ø£Ù‚Ø±Ø¨ ÙˆÙ‚Øª Ù…Ù…ÙƒÙ† Ø®Ù„Ø§Ù„ Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„Ø±Ø³Ù…ÙŠØ©.',
    labelFullName: 'Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„',
    labelEmail: 'Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ',
    labelPhone: 'Ø±Ù‚Ù… Ø§Ù„Ø¬ÙˆØ§Ù„',
    labelSubject: 'Ø§Ù„Ù…ÙˆØ¶ÙˆØ¹',
    labelMessage: 'Ø§Ù„Ø±Ø³Ø§Ù„Ø©',
    placeholderName: 'Ø£Ø¯Ø®Ù„ Ø§Ø³Ù…Ùƒ',
    placeholderPhone: '05XXXXXXXX',
    selectSubject: 'Ø§Ø®ØªØ± Ø§Ù„Ù…ÙˆØ¶ÙˆØ¹',
    subjectInquiry: 'Ø§Ø³ØªÙØ³Ø§Ø± Ø¹Ø§Ù…',
    subjectTechnical: 'Ù…Ø´ÙƒÙ„Ø© ØªÙ‚Ù†ÙŠØ©',
    subjectPartnership: 'Ø·Ù„Ø¨ Ø´Ø±Ø§ÙƒØ©',
    subjectSuggestion: 'Ø§Ù‚ØªØ±Ø§Ø­ Ø£Ùˆ Ù…Ù„Ø§Ø­Ø¸Ø©',
    subjectComplaint: 'Ø´ÙƒÙˆÙ‰',
    subjectOther: 'Ø£Ø®Ø±Ù‰',
    placeholderMessage: 'Ø§ÙƒØªØ¨ Ø±Ø³Ø§Ù„ØªÙƒ Ù‡Ù†Ø§...',
    sendMessage: 'ðŸ“¨ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø±Ø³Ø§Ù„Ø©',
    infoEmail: 'Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ',
    infoPhone: 'Ø§Ù„Ù‡Ø§ØªÙ',
    infoAddress: 'Ø§Ù„Ø¹Ù†ÙˆØ§Ù†',
    infoAddressValue: 'Ø§Ù„Ø±ÙŠØ§Ø¶ØŒ Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©',
    infoAddressDetail: 'Ø·Ø±ÙŠÙ‚ Ø§Ù„Ù…Ù„Ùƒ ÙÙ‡Ø¯ØŒ Ø¨Ø±Ø¬ Ø§Ù„Ù…Ù…Ù„ÙƒØ©ØŒ Ø§Ù„Ø·Ø§Ø¨Ù‚ 15',
    infoHours: 'Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„',
    infoHoursValue: 'Ø§Ù„Ø£Ø­Ø¯ - Ø§Ù„Ø®Ù…ÙŠØ³: 8:00 Øµ - 5:00 Ù…',
    infoHoursClosed: 'Ø§Ù„Ø¬Ù…Ø¹Ø© ÙˆØ§Ù„Ø³Ø¨Øª: Ù…ØºÙ„Ù‚',
    infoPhoneHours: 'Ø§Ù„Ø£Ø­Ø¯ - Ø§Ù„Ø®Ù…ÙŠØ³: 8 Øµ - 5 Ù…',
    mapTitle: 'ðŸ“ Ù…ÙˆÙ‚Ø¹Ù†Ø§ Ø¹Ù„Ù‰ Ø§Ù„Ø®Ø±ÙŠØ·Ø©',
    mapDesc: 'Ø§Ù„Ø±ÙŠØ§Ø¶ - Ø·Ø±ÙŠÙ‚ Ø§Ù„Ù…Ù„Ùƒ ÙÙ‡Ø¯',
    mapBtn: 'ÙØªØ­ ÙÙŠ Ø®Ø±Ø§Ø¦Ø· Ø¬ÙˆØ¬Ù„',
    faqBadge: 'Ø£Ø³Ø¦Ù„Ø© Ø´Ø§Ø¦Ø¹Ø©',
    faqTitle: 'Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø£ÙƒØ«Ø± Ø´ÙŠÙˆØ¹Ø§Ù‹',
    faqDesc: 'Ø¥Ø¬Ø§Ø¨Ø§Øª Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ù…ØªÙƒØ±Ø±Ø© Ø­ÙˆÙ„ Ù…Ù†ØµØªÙ†Ø§',
    faq1Q: 'â“ ÙƒÙŠÙ ÙŠÙ…ÙƒÙ†Ù†ÙŠ Ø§Ù„ØªÙ‚Ø¯ÙŠÙ… Ø¹Ù„Ù‰ ÙˆØ¸ÙŠÙØ©ØŸ',
    faq1A: 'ÙŠÙ…ÙƒÙ†Ùƒ ØªØµÙØ­ Ø§Ù„ÙˆØ¸Ø§Ø¦Ù Ø§Ù„Ù…ØªØ§Ø­Ø© Ù…Ù† ØµÙØ­Ø© Ø§Ù„ÙˆØ¸Ø§Ø¦ÙØŒ Ø«Ù… Ø§Ù„Ø¶ØºØ· Ø¹Ù„Ù‰ "Ø¹Ø±Ø¶ Ø§Ù„ØªÙØ§ØµÙŠÙ„" ÙˆØ§Ø®ØªÙŠØ§Ø± "Ù‚Ø¯Ù‘Ù… Ø§Ù„Ø¢Ù†" Ù„Ù…Ù„Ø¡ Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„ØªÙ‚Ø¯ÙŠÙ….',
    faq2Q: 'â“ Ù‡Ù„ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ Ù…Ø¬Ø§Ù†ÙŠØŸ',
    faq2A: 'Ù†Ø¹Ù…ØŒ Ø§Ù„ØªØ³Ø¬ÙŠÙ„ ÙˆØ§Ù„ØªÙ‚Ø¯ÙŠÙ… Ø¹Ù„Ù‰ Ø§Ù„ÙˆØ¸Ø§Ø¦Ù Ù…Ø¬Ø§Ù†ÙŠ Ø¨Ø§Ù„ÙƒØ§Ù…Ù„ Ù„Ù„Ø¨Ø§Ø­Ø«ÙŠÙ† Ø¹Ù† Ø¹Ù…Ù„.',
    faq3Q: 'â“ ÙƒÙ… ÙŠØ³ØªØºØ±Ù‚ Ø§Ù„Ø±Ø¯ Ø¹Ù„Ù‰ Ø·Ù„Ø¨ÙŠØŸ',
    faq3A: 'Ø¹Ø§Ø¯Ø©Ù‹ Ù…Ø§ ÙŠØªÙ… Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø®Ù„Ø§Ù„ 3-5 Ø£ÙŠØ§Ù… Ø¹Ù…Ù„. Ø³ÙŠØªÙ… Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ Ø¹Ø¨Ø± Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ø£Ùˆ Ø§Ù„Ù‡Ø§ØªÙ.',
    faq4Q: 'â“ Ù‡Ù„ ÙŠØ¬Ø¨ Ø£Ù† Ø£Ù…ØªÙ„Ùƒ ØªØµÙ†ÙŠÙ Ù…Ù‡Ù†ÙŠØŸ',
    faq4A: 'Ù†Ø¹Ù…ØŒ Ù…Ø¹Ø¸Ù… Ø§Ù„ÙˆØ¸Ø§Ø¦Ù Ø§Ù„ØµØ­ÙŠØ© ØªØªØ·Ù„Ø¨ ØªØµÙ†ÙŠÙ Ù…Ù‡Ù†ÙŠ Ø³Ø§Ø±ÙŠ Ù…Ù† Ø§Ù„Ù‡ÙŠØ¦Ø© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ© Ù„Ù„ØªØ®ØµØµØ§Øª Ø§Ù„ØµØ­ÙŠØ©.',
    successMsgSent: 'ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø±Ø³Ø§Ù„ØªÙƒ Ø¨Ù†Ø¬Ø§Ø­!',
    successMsgDesc: 'Ø´ÙƒØ±Ø§Ù‹ Ù„ØªÙˆØ§ØµÙ„Ùƒ Ù…Ø¹Ù†Ø§. Ø³ÙŠÙ‚ÙˆÙ… ÙØ±ÙŠÙ‚Ù†Ø§ Ø¨Ø§Ù„Ø±Ø¯ Ø¹Ù„ÙŠÙƒ ÙÙŠ Ø£Ù‚Ø±Ø¨ ÙˆÙ‚Øª Ù…Ù…ÙƒÙ†.',
    backToHome: 'Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ©',
    closeBtn: 'Ø¥ØºÙ„Ø§Ù‚',

    // Apply page
    applyPageTitle: 'Ø§Ù„ØªÙ‚Ø¯ÙŠÙ… Ø¹Ù„Ù‰ ÙˆØ¸ÙŠÙØ©',
    applyPageDesc: 'Ø£ÙƒÙ…Ù„ Ø¨ÙŠØ§Ù†Ø§ØªÙƒ Ù„Ù„ØªÙ‚Ø¯ÙŠÙ… Ø¹Ù„Ù‰ Ø§Ù„ÙˆØ¸ÙŠÙØ©',
    breadcrumbApply: 'Ø§Ù„ØªÙ‚Ø¯ÙŠÙ…',
    applyFormTitle: 'ðŸ“ Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„ØªÙ‚Ø¯ÙŠÙ…',
    applyFormDesc: 'ÙŠØ±Ø¬Ù‰ Ù…Ù„Ø¡ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© Ø¨Ø¯Ù‚Ø© Ù„Ø¶Ù…Ø§Ù† Ù…Ø¹Ø§Ù„Ø¬Ø© Ø·Ù„Ø¨Ùƒ Ø¨Ø´ÙƒÙ„ ØµØ­ÙŠØ­.',
    labelFullName4: 'Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„',
    labelSpecialty: 'Ø§Ù„ØªØ®ØµØµ',
    selectSpecialty: 'Ø§Ø®ØªØ± Ø§Ù„ØªØ®ØµØµ',
    labelClassification: 'Ø±Ù‚Ù… Ø§Ù„ØªØµÙ†ÙŠÙ Ø§Ù„Ù…Ù‡Ù†ÙŠ',
    placeholderClassification: 'Ø±Ù‚Ù… Ø§Ù„ØªØµÙ†ÙŠÙ Ù…Ù† Ù‡ÙŠØ¦Ø© Ø§Ù„ØªØ®ØµØµØ§Øª',
    labelCityApply: 'Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©',
    selectCity: 'Ø§Ø®ØªØ± Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©',
    placeholderFullname: 'Ø£Ø¯Ø®Ù„ Ø§Ø³Ù…Ùƒ Ø§Ù„Ø±Ø¨Ø§Ø¹ÙŠ',
    labelExperience: 'Ø³Ù†ÙˆØ§Øª Ø§Ù„Ø®Ø¨Ø±Ø©',
    selectExperience: 'Ø§Ø®ØªØ±',
    expLess1: 'Ø£Ù‚Ù„ Ù…Ù† Ø³Ù†Ø©',
    exp1to3: '1 - 3 Ø³Ù†ÙˆØ§Øª',
    exp3to5: '3 - 5 Ø³Ù†ÙˆØ§Øª',
    exp5to10: '5 - 10 Ø³Ù†ÙˆØ§Øª',
    exp10plus: 'Ø£ÙƒØ«Ø± Ù…Ù† 10 Ø³Ù†ÙˆØ§Øª',
    labelQualification: 'Ø§Ù„Ù…Ø¤Ù‡Ù„ Ø§Ù„Ø¹Ù„Ù…ÙŠ',
    qualDiploma: 'Ø¯Ø¨Ù„ÙˆÙ…',
    qualBachelor: 'Ø¨ÙƒØ§Ù„ÙˆØ±ÙŠÙˆØ³',
    qualMaster: 'Ù…Ø§Ø¬Ø³ØªÙŠØ±',
    qualPhd: 'Ø¯ÙƒØªÙˆØ±Ø§Ù‡',
    qualBoard: 'Ø¨ÙˆØ±Ø¯ / Ø²Ù…Ø§Ù„Ø©',
    labelCV: 'Ø§Ù„Ø³ÙŠØ±Ø© Ø§Ù„Ø°Ø§ØªÙŠØ©',
    cvDragText: 'Ø§Ø³Ø­Ø¨ Ø§Ù„Ù…Ù„Ù Ù‡Ù†Ø§ Ø£Ùˆ <span>Ø§Ø¶ØºØ· Ù„Ù„Ø§Ø®ØªÙŠØ§Ø±</span>',
    cvLimit: 'PDF, DOC, DOCX - Ø­Ø¯ Ø£Ù‚ØµÙ‰ 5 Ù…ÙŠØ¬Ø§Ø¨Ø§ÙŠØª',
    labelNote: 'Ø±Ø³Ø§Ù„Ø© Ù…Ø®ØªØµØ±Ø©',
    placeholderNote: 'Ø§ÙƒØªØ¨ Ø±Ø³Ø§Ù„Ø© Ù…Ø®ØªØµØ±Ø© Ø¹Ù† Ù†ÙØ³Ùƒ ÙˆØ³Ø¨Ø¨ Ø§Ù‡ØªÙ…Ø§Ù…Ùƒ Ø¨Ø§Ù„ÙˆØ¸ÙŠÙØ© (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)...',
    submitApplication: 'ðŸ“¨ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨',
    successApply: 'ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø·Ù„Ø¨Ùƒ Ø¨Ù†Ø¬Ø§Ø­!',
    successApplyDesc: 'Ø´ÙƒØ±Ø§Ù‹ Ù„ØªÙ‚Ø¯ÙŠÙ…Ùƒ Ø¹Ø¨Ø± Rawad Health. Ø³ÙŠØªÙ… Ù…Ø±Ø§Ø¬Ø¹Ø© Ø·Ù„Ø¨Ùƒ ÙˆØ§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ ÙÙŠ Ø£Ù‚Ø±Ø¨ ÙˆÙ‚Øª Ù…Ù…ÙƒÙ†.',
    browseOtherJobs: 'ØªØµÙØ­ ÙˆØ¸Ø§Ø¦Ù Ø£Ø®Ø±Ù‰',

    // Footer specialties
    footSpecGeneral: 'Ø·Ø¨ Ø¹Ø§Ù…',
    footSpecNursing: 'ØªÙ…Ø±ÙŠØ¶',
    footSpecPharmacy: 'ØµÙŠØ¯Ù„Ø©',
    footSpecDentistry: 'Ø·Ø¨ Ø£Ø³Ù†Ø§Ù†',
    footSpecPhysio: 'Ø¹Ù„Ø§Ø¬ Ø·Ø¨ÙŠØ¹ÙŠ',

    // Job Details page
    jobDetailsBreadcrumb: 'ØªÙØ§ØµÙŠÙ„ Ø§Ù„ÙˆØ¸ÙŠÙØ©',
    jobDescLabel: 'ðŸ“‹ ÙˆØµÙ Ø§Ù„ÙˆØ¸ÙŠÙØ©',
    jobTasksLabel: 'ðŸ“Œ Ø§Ù„Ù…Ù‡Ø§Ù… ÙˆØ§Ù„Ù…Ø³Ø¤ÙˆÙ„ÙŠØ§Øª',
    jobReqLabel: 'ðŸ“ Ø§Ù„Ù…ØªØ·Ù„Ø¨Ø§Øª ÙˆØ§Ù„Ù…Ø¤Ù‡Ù„Ø§Øª',
    jobBenefitsLabel: 'ðŸŽ Ø§Ù„Ù…Ø²Ø§ÙŠØ§ ÙˆØ§Ù„Ø­ÙˆØ§ÙØ²',
    applyNowBtn: 'Ù‚Ø¯Ù‘Ù… Ø§Ù„Ø¢Ù† Ø¹Ù„Ù‰ Ù‡Ø°Ù‡ Ø§Ù„ÙˆØ¸ÙŠÙØ©',
    jobInfoTitle: 'Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ÙˆØ¸ÙŠÙØ©',
    labelSalary: 'ðŸ’° Ø§Ù„Ø±Ø§ØªØ¨',
    labelCitySidebar: 'ðŸ“ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©',
    labelWorkType: 'â° Ù†ÙˆØ¹ Ø§Ù„Ø¯ÙˆØ§Ù…',
    labelSpecSidebar: 'ðŸ©º Ø§Ù„ØªØ®ØµØµ',
    labelFacilityType: 'ðŸ¥ Ù†ÙˆØ¹ Ø§Ù„Ù…Ù†Ø´Ø£Ø©',
    labelPostDate: 'ðŸ“… ØªØ§Ø±ÙŠØ® Ø§Ù„Ù†Ø´Ø±',
    interestedTitle: 'Ù‡Ù„ Ø£Ù†Øª Ù…Ù‡ØªÙ…ØŸ',
    interestedDesc: 'Ù„Ø§ ØªÙÙˆÙ‘Øª Ù‡Ø°Ù‡ Ø§Ù„ÙØ±ØµØ© ÙˆÙ‚Ø¯Ù‘Ù… Ø·Ù„Ø¨Ùƒ Ø§Ù„Ø¢Ù†',
    applyNowShort: 'Ù‚Ø¯Ù‘Ù… Ø§Ù„Ø¢Ù†',
    shareJob: 'Ø´Ø§Ø±Ùƒ Ø§Ù„ÙˆØ¸ÙŠÙØ©',
    shareTwitter: 'ð• ØªÙˆÙŠØªØ±',
    shareLinkedin: 'in Ù„ÙŠÙ†ÙƒØ¯Ø¥Ù†',
    shareCopy: 'ðŸ“‹ Ù†Ø³Ø®',
  },
  en: {
    // Header / Nav
    langLabel: 'Ø¹Ø±Ø¨ÙŠ',
    navHome: 'Home',
    navJobs: 'Jobs',
    navContact: 'Contact Us',
    browseJobs: 'Browse Jobs',

    // Hero
    heroBadge: 'ðŸ¥ The Leading Health Platform in Saudi Arabia',
    heroTitle: 'Your Health Career <span>Starts Here</span>',
    heroDesc: 'Rawad Health connects healthcare professionals with top medical facilities across Saudi Arabia. Discover outstanding opportunities that match your specialty and ambition.',
    heroBtnJobs: 'Browse Available Jobs',
    heroBtnContact: 'Contact Us',

    // Hero stats
    statJobs: 'Jobs Available',
    statFacilities: 'Healthcare Facilities',
    statHired: 'Professionals Hired',

    // Features
    featuresBadge: 'Our Features',
    featuresTitle: 'Why Choose Rawad Health?',
    featuresDesc: 'We offer a comprehensive and exceptional healthcare recruitment experience',
    feat1Title: 'Specialized Jobs',
    feat1Desc: 'We provide jobs across all healthcare specialties from medicine and nursing to pharmacy, physiotherapy and laboratories.',
    feat2Title: 'Trusted Facilities',
    feat2Desc: 'We partner with the best hospitals, medical centers and licensed clinics throughout the Kingdom.',
    feat3Title: 'Quick Apply',
    feat3Desc: 'Apply for jobs easily and quickly through a simple and straightforward application form.',
    feat4Title: 'Instant Alerts',
    feat4Desc: 'Get instant notifications about the latest jobs matching your specialty and city.',

    // Services
    servicesBadge: 'Our Services',
    servicesTitle: 'What We Offer?',
    servicesDesc: 'A complete suite of services to support your career in the healthcare sector',
    svc1Title: 'Medical Recruitment',
    svc1Desc: 'We connect you with the best job opportunities at prestigious hospitals and medical centers across the Kingdom, in over 20 healthcare specialties.',
    svc2Title: 'Training & Development',
    svc2Desc: 'We provide specialized training programs for healthcare professionals to enhance their skills and keep up with the latest medical developments.',

    // Latest jobs
    latestJobsTitle: 'Latest Available Jobs',
    latestJobsDesc: 'Discover the latest job opportunities in the healthcare sector',
    viewAllJobs: 'View All Jobs â†’',
    learnMore: 'Learn More',

    // CTA
    ctaTitle: 'Ready for the Next Step in Your Career?',
    ctaDesc: 'Join thousands of healthcare professionals who found their ideal jobs through Rawad Health',
    ctaContact: 'Contact Us',

    // Footer
    footerAbout: 'The leading healthcare recruitment platform in Saudi Arabia. We connect healthcare talent with the best opportunities in the medical sector.',
    quickLinks: 'Quick Links',
    specialties: 'Specialties',
    contactUs: 'Contact Us',
    copyright: 'Â© 2026 Rawad Health. All rights reserved.',
    footerAddress: 'Riyadh, Saudi Arabia',

    // Jobs page
    jobsPageTitle: 'Available Jobs',
    jobsPageDesc: 'Discover exceptional job opportunities in Saudi healthcare',
    breadcrumbHome: 'Home',
    breadcrumbJobs: 'Jobs',
    filterSearch: 'Search',
    filterSearchPlaceholder: 'Search for a job...',
    filterSpecialty: 'Specialty',
    filterAllSpecialties: 'All Specialties',
    filterCity: 'City',
    filterAllCities: 'All Cities',
    filterFacility: 'Facility Type',
    filterAllFacilities: 'All Facilities',
    filterWorkType: 'Work Type',
    filterAllTypes: 'All Types',
    filterBtn: 'ðŸ” Search',
    searchResults: 'Search Results:',
    jobUnit: 'job(s)',
    noJobCta: "Didn't find the right job?",
    noJobCtaDesc: 'Contact us and we will help you find the perfect opportunity for your specialty',

    // Specialties for filters
    specGeneral: 'General Medicine',
    specDentistry: 'Dentistry',
    specNursing: 'Nursing',
    specPharmacy: 'Pharmacy',
    specPhysio: 'Physiotherapy',
    specRadiology: 'Radiology',
    specLab: 'Laboratory',
    specNutrition: 'Clinical Nutrition',
    specOptics: 'Optics',

    // Cities
    cityRiyadh: 'Riyadh',
    cityJeddah: 'Jeddah',
    cityDammam: 'Dammam',
    cityMadinah: 'Madinah',
    cityMakkah: 'Makkah',
    cityTaif: 'Taif',
    cityTabuk: 'Tabuk',
    cityAbha: 'Abha',
    cityHail: 'Hail',

    // Facility types
    facilityHospital: 'Hospital',
    facilityCenter: 'Medical Center',
    facilityClinics: 'Clinics',
    facilityRehab: 'Rehab Center',

    // Work types
    typeFullTime: 'Full-time',
    typePartTime: 'Part-time',
    typeContract: 'Contract',

    // Contact page
    contactPageTitle: 'Contact Us',
    contactPageDesc: 'We welcome your inquiries and suggestions',
    contactFormTitle: 'ðŸ“© Send Us a Message',
    contactFormDesc: 'We will respond as soon as possible during business hours.',
    labelFullName: 'Full Name',
    labelEmail: 'Email Address',
    labelPhone: 'Phone Number',
    labelSubject: 'Subject',
    labelMessage: 'Message',
    placeholderName: 'Enter your name',
    placeholderPhone: '05XXXXXXXX',
    selectSubject: 'Select Subject',
    subjectInquiry: 'General Inquiry',
    subjectTechnical: 'Technical Issue',
    subjectPartnership: 'Partnership Request',
    subjectSuggestion: 'Suggestion or Feedback',
    subjectComplaint: 'Complaint',
    subjectOther: 'Other',
    placeholderMessage: 'Write your message here...',
    sendMessage: 'ðŸ“¨ Send Message',
    infoEmail: 'Email',
    infoPhone: 'Phone',
    infoAddress: 'Address',
    infoAddressValue: 'Riyadh, Saudi Arabia',
    infoAddressDetail: 'King Fahd Road, Kingdom Tower, Floor 15',
    infoHours: 'Working Hours',
    infoHoursValue: 'Sunday - Thursday: 8:00 AM - 5:00 PM',
    infoHoursClosed: 'Friday & Saturday: Closed',
    infoPhoneHours: 'Sunday - Thursday: 8 AM - 5 PM',
    mapTitle: 'ðŸ“ Our Location on Map',
    mapDesc: 'Riyadh - King Fahd Road',
    mapBtn: 'Open in Google Maps',
    faqBadge: 'FAQ',
    faqTitle: 'Frequently Asked Questions',
    faqDesc: 'Answers to common questions about our platform',
    faq1Q: 'â“ How can I apply for a job?',
    faq1A: 'You can browse available jobs from the Jobs page, then click "View Details" and select "Apply Now" to fill out the application form.',
    faq2Q: 'â“ Is registration free?',
    faq2A: 'Yes, registration and job applications are completely free for job seekers.',
    faq3Q: 'â“ How long does it take to hear back?',
    faq3A: 'Applications are typically reviewed within 3-5 business days. You will be contacted via email or phone.',
    faq4Q: 'â“ Do I need a professional classification?',
    faq4A: 'Yes, most healthcare jobs require a valid professional classification from the Saudi Commission for Health Specialties.',
    successMsgSent: 'Your message was sent successfully!',
    successMsgDesc: 'Thank you for contacting us. Our team will respond to you as soon as possible.',
    backToHome: 'Back to Home',
    closeBtn: 'Close',

    // Apply page
    applyPageTitle: 'Apply for a Job',
    applyPageDesc: 'Complete your details to apply for the position',
    breadcrumbApply: 'Apply',
    applyFormTitle: 'ðŸ“ Application Form',
    applyFormDesc: 'Please fill in all required fields accurately to ensure your application is processed correctly.',
    labelFullName4: 'Full Name',
    labelSpecialty: 'Specialty',
    selectSpecialty: 'Select Specialty',
    labelClassification: 'Professional Classification No.',
    placeholderClassification: 'Classification number from SCFHS',
    labelCityApply: 'City',
    selectCity: 'Select City',
    placeholderFullname: 'Enter your full name',
    labelExperience: 'Years of Experience',
    selectExperience: 'Select',
    expLess1: 'Less than 1 year',
    exp1to3: '1 - 3 years',
    exp3to5: '3 - 5 years',
    exp5to10: '5 - 10 years',
    exp10plus: 'More than 10 years',
    labelQualification: 'Qualification',
    qualDiploma: 'Diploma',
    qualBachelor: 'Bachelor\'s',
    qualMaster: 'Master\'s',
    qualPhd: 'PhD',
    qualBoard: 'Board / Fellowship',
    labelCV: 'Resume / CV',
    cvDragText: 'Drag file here or <span>click to browse</span>',
    cvLimit: 'PDF, DOC, DOCX - Max 5 MB',
    labelNote: 'Short Message',
    placeholderNote: 'Write a brief message about yourself and why you are interested in this position (optional)...',
    submitApplication: 'ðŸ“¨ Submit Application',
    successApply: 'Your application was submitted successfully!',
    successApplyDesc: 'Thank you for applying through Rawad Health. Your application will be reviewed and we will contact you soon.',
    browseOtherJobs: 'Browse Other Jobs',

    // Footer specialties
    footSpecGeneral: 'General Medicine',
    footSpecNursing: 'Nursing',
    footSpecPharmacy: 'Pharmacy',
    footSpecDentistry: 'Dentistry',
    footSpecPhysio: 'Physiotherapy',

    // Job Details page
    jobDetailsBreadcrumb: 'Job Details',
    jobDescLabel: 'ðŸ“‹ Job Description',
    jobTasksLabel: 'ðŸ“Œ Tasks & Responsibilities',
    jobReqLabel: 'ðŸ“ Requirements & Qualifications',
    jobBenefitsLabel: 'ðŸŽ Benefits & Incentives',
    applyNowBtn: 'Apply Now for This Job',
    jobInfoTitle: 'Job Information',
    labelSalary: 'ðŸ’° Salary',
    labelCitySidebar: 'ðŸ“ City',
    labelWorkType: 'â° Work Type',
    labelSpecSidebar: 'ðŸ©º Specialty',
    labelFacilityType: 'ðŸ¥ Facility Type',
    labelPostDate: 'ðŸ“… Posted',
    interestedTitle: 'Interested?',
    interestedDesc: "Don't miss this opportunity - apply now",
    applyNowShort: 'Apply Now',
    shareJob: 'Share Job',
    shareTwitter: 'ð• Twitter',
    shareLinkedin: 'in LinkedIn',
    shareCopy: 'ðŸ“‹ Copy',
  }
};

let currentLang = localStorage.getItem('rawad-lang') || 'ar';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('rawad-lang', lang);

  // Update dir and lang on <html>
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  // Translate all elements with data-i18n
  const dict = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Translate placeholders with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Update page title
  const titleMap = {
    'index.html': lang === 'ar' ? 'Rawad Health | Ù…Ù†ØµØ© Ø§Ù„ØªÙˆØ¸ÙŠÙ Ø§Ù„ØµØ­ÙŠ' : 'Rawad Health | Healthcare Recruitment',
    'jobs.html':  lang === 'ar' ? 'Ø§Ù„ÙˆØ¸Ø§Ø¦Ù | Rawad Health' : 'Jobs | Rawad Health',
    'contact.html': lang === 'ar' ? 'ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ | Rawad Health' : 'Contact Us | Rawad Health',
    'apply.html': lang === 'ar' ? 'Ø§Ù„ØªÙ‚Ø¯ÙŠÙ… | Rawad Health' : 'Apply | Rawad Health',
    'job-details.html': lang === 'ar' ? 'ØªÙØ§ØµÙŠÙ„ Ø§Ù„ÙˆØ¸ÙŠÙØ© | Rawad Health' : 'Job Details | Rawad Health',
  };
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (titleMap[page]) document.title = titleMap[page];

  // Re-render dynamic content based on current page
  if (page === 'index.html' || page === '') {
    renderFeaturedJobs();
    animateCounters();
  } else if (page === 'jobs.html') {
    applyFilters();
  } else if (page === 'job-details.html') {
    initJobDetailsPage();
  } else if (page === 'apply.html') {
    // Update apply page title from URL param (job title is passed as ?job=...)
    const params = new URLSearchParams(window.location.search);
    const jobTitle = params.get('job');
    if (jobTitle) {
      const titleEl = document.getElementById('apply-job-title');
      if (titleEl) {
        const prefix = lang === 'en' ? 'Applying for: ' : 'التقديم على: ';
        titleEl.textContent = prefix + decodeURIComponent(jobTitle);
      }
    }
  }
}

function toggleLanguage() {
  setLanguage(currentLang === 'ar' ? 'en' : 'ar');
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Bind language toggle button(s)
  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.addEventListener('click', toggleLanguage);
  }

  // Apply saved language (if not default Arabic)
  if (currentLang !== 'ar') {
    setLanguage(currentLang);
  }
});
