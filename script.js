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
        const displayName = userData.orgName || userData.name || user.displayName || 'المستخدم';
        localStorage.setItem('rawad_current_user', JSON.stringify(Object.assign({}, userData, { uid: user.uid })));
        // Desktop
        if (authButtons)    authButtons.style.display    = 'none';
        if (userMenu)       userMenu.style.display        = 'flex';
        if (userGreeting)   userGreeting.textContent      = 'مرحباً، ' + displayName;
        // Mobile drawer
        if (mobileAuthBtns) mobileAuthBtns.style.display  = 'none';
        if (mobileUserMenu) mobileUserMenu.style.display   = 'flex';
        if (mobileGreeting) mobileGreeting.textContent     = 'مرحباً، ' + displayName;
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
  var hamburger = document.querySelector('.hamburger');
  var navLinks  = document.querySelector('.nav-links');
  var overlay   = document.getElementById('navOverlay');
  var header    = document.querySelector('.header');

  function openMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      if (navLinks.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when user taps a link or button inside the drawer
    navLinks.addEventListener('click', function(e) {
      if (e.target.closest('a') || e.target.closest('button')) {
        closeMenu();
      }
    });

    // Close when tapping the dark overlay
    if (overlay) {
      overlay.addEventListener('click', function() {
        closeMenu();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Sticky header shadow on scroll
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Highlight current page link
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    var href = link.getAttribute('href');
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
    if (titleEl) titleEl.textContent = `التقديم على: ${decodeURIComponent(jobTitle)}`;
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
    display.textContent = `✅ ${input.files[0].name}`;
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
    const msg = currentLang === 'en' ? 'Please fill in all required fields' : 'يرجى ملء جميع الحقول المطلوبة';
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
        const msg = currentLang === 'en' ? 'Please fill in all required fields' : 'يرجى ملء جميع الحقول المطلوبة';
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
    navHome: 'الرئيسية',
    navJobs: 'الوظائف',
    navContact: 'تواصل معنا',
    browseJobs: 'تصفح الوظائف',

    // Hero
    heroBadge: '🏥 المنصة الصحية الأولى في المملكة',
    heroTitle: 'وظيفتك الصحية <span>تبدأ من هنا</span>',
    heroDesc: 'منصة Rawad Health تربط الكفاءات الصحية بأفضل المنشآت الطبية في المملكة العربية السعودية. اكتشف فرصاً مميزة تناسب تخصصك وطموحك المهني.',
    heroBtnJobs: 'تصفح الوظائف المتاحة',
    heroBtnContact: 'تواصل معنا',

    // Hero stats
    statJobs: 'وظيفة متاحة',
    statFacilities: 'منشأة صحية',
    statHired: 'تم توظيفهم',

    // Features
    featuresBadge: 'مميزاتنا',
    featuresTitle: 'لماذا تختار Rawad Health؟',
    featuresDesc: 'نقدم لك تجربة توظيف صحي متكاملة ومميزة',
    feat1Title: 'وظائف متخصصة',
    feat1Desc: 'نوفر وظائف في جميع التخصصات الصحية من الطب والتمريض إلى الصيدلة والعلاج الطبيعي والمختبرات.',
    feat2Title: 'منشآت موثوقة',
    feat2Desc: 'نتعاون مع أفضل المستشفيات والمراكز الطبية والعيادات المرخصة في جميع أنحاء المملكة.',
    feat3Title: 'تقديم سريع',
    feat3Desc: 'قدّم على الوظائف بسهولة وسرعة من خلال نموذج تقديم بسيط ومباشر بدون تعقيد.',
    feat4Title: 'تنبيهات فورية',
    feat4Desc: 'احصل على إشعارات فورية بأحدث الوظائف التي تناسب تخصصك ومدينتك.',

    // Services
    servicesBadge: 'خدماتنا',
    servicesTitle: 'ماذا نقدم لك؟',
    servicesDesc: 'نوفر لك مجموعة متكاملة من الخدمات لدعم مسيرتك المهنية في القطاع الصحي',
    svc1Title: 'التوظيف الطبي',
    svc1Desc: 'نربطك بأفضل الفرص الوظيفية في المستشفيات والمراكز الطبية المرموقة في جميع أنحاء المملكة، في أكثر من 20 تخصصاً صحياً.',
    svc2Title: 'التدريب والتطوير',
    svc2Desc: 'نوفر برامج تدريبية متخصصة للكوادر الصحية لتعزيز مهاراتهم، ومواكبة أحدث المستجدات الطبية وتطوير أدائهم المهني.',

    // Latest jobs
    latestJobsTitle: 'أحدث الوظائف المتاحة',
    latestJobsDesc: 'اكتشف أحدث الفرص الوظيفية في القطاع الصحي',
    viewAllJobs: 'عرض جميع الوظائف →',
    learnMore: 'اعرف أكثر',

    // CTA
    ctaTitle: 'جاهز للخطوة القادمة في مسيرتك المهنية؟',
    ctaDesc: 'انضم إلى آلاف المهنيين الصحيين الذين وجدوا وظائفهم المثالية عبر Rawad Health',
    ctaContact: 'تواصل معنا',

    // Footer
    footerAbout: 'منصة التوظيف الصحي الرائدة في المملكة العربية السعودية. نربط الكفاءات الصحية بأفضل الفرص الوظيفية في القطاع الصحي.',
    quickLinks: 'روابط سريعة',
    specialties: 'التخصصات',
    contactUs: 'تواصل معنا',
    copyright: '© 2026 Rawad Health. جميع الحقوق محفوظة.',
    footerAddress: 'الرياض، المملكة العربية السعودية',

    // Jobs page
    jobsPageTitle: 'الوظائف المتاحة',
    jobsPageDesc: 'اكتشف فرصاً وظيفية مميزة في القطاع الصحي بالمملكة',
    breadcrumbHome: 'الرئيسية',
    breadcrumbJobs: 'الوظائف',
    filterSearch: 'بحث',
    filterSearchPlaceholder: 'ابحث عن وظيفة...',
    filterSpecialty: 'التخصص',
    filterAllSpecialties: 'جميع التخصصات',
    filterCity: 'المدينة',
    filterAllCities: 'جميع المدن',
    filterFacility: 'نوع المنشأة',
    filterAllFacilities: 'جميع المنشآت',
    filterWorkType: 'نوع الدوام',
    filterAllTypes: 'جميع الأنواع',
    filterBtn: '🔍 بحث',
    searchResults: 'نتائج البحث:',
    jobUnit: 'وظيفة',
    noJobCta: 'لم تجد الوظيفة المناسبة؟',
    noJobCtaDesc: 'تواصل معنا وسنساعدك في إيجاد الفرصة المثالية التي تناسب تخصصك',

    // Specialties for filters
    specGeneral: 'طب عام',
    specDentistry: 'طب أسنان',
    specNursing: 'تمريض',
    specPharmacy: 'صيدلة',
    specPhysio: 'علاج طبيعي',
    specRadiology: 'أشعة',
    specLab: 'مختبرات',
    specNutrition: 'تغذية إكلينيكية',
    specOptics: 'بصريات',

    // Cities
    cityRiyadh: 'الرياض',
    cityJeddah: 'جدة',
    cityDammam: 'الدمام',
    cityMadinah: 'المدينة المنورة',
    cityMakkah: 'مكة المكرمة',
    cityTaif: 'الطائف',
    cityTabuk: 'تبوك',
    cityAbha: 'أبها',
    cityHail: 'حائل',

    // Facility types
    facilityHospital: 'مستشفى',
    facilityCenter: 'مركز طبي',
    facilityClinics: 'عيادات',
    facilityRehab: 'مركز تأهيل',

    // Work types
    typeFullTime: 'دوام كامل',
    typePartTime: 'دوام جزئي',
    typeContract: 'عقد مؤقت',

    // Contact page
    contactPageTitle: 'تواصل معنا',
    contactPageDesc: 'نسعد بتواصلكم ونرحب باستفساراتكم ومقترحاتكم',
    contactFormTitle: '📩 أرسل لنا رسالة',
    contactFormDesc: 'سنقوم بالرد عليك في أقرب وقت ممكن خلال ساعات العمل الرسمية.',
    labelFullName: 'الاسم الكامل',
    labelEmail: 'البريد الإلكتروني',
    labelPhone: 'رقم الجوال',
    labelSubject: 'الموضوع',
    labelMessage: 'الرسالة',
    placeholderName: 'أدخل اسمك',
    placeholderPhone: '05XXXXXXXX',
    selectSubject: 'اختر الموضوع',
    subjectInquiry: 'استفسار عام',
    subjectTechnical: 'مشكلة تقنية',
    subjectPartnership: 'طلب شراكة',
    subjectSuggestion: 'اقتراح أو ملاحظة',
    subjectComplaint: 'شكوى',
    subjectOther: 'أخرى',
    placeholderMessage: 'اكتب رسالتك هنا...',
    sendMessage: '📨 إرسال الرسالة',
    infoEmail: 'البريد الإلكتروني',
    infoPhone: 'الهاتف',
    infoAddress: 'العنوان',
    infoAddressValue: 'الرياض، المملكة العربية السعودية',
    infoAddressDetail: 'طريق الملك فهد، برج المملكة، الطابق 15',
    infoHours: 'ساعات العمل',
    infoHoursValue: 'الأحد - الخميس: 8:00 ص - 5:00 م',
    infoHoursClosed: 'الجمعة والسبت: مغلق',
    infoPhoneHours: 'الأحد - الخميس: 8 ص - 5 م',
    mapTitle: '📍 موقعنا على الخريطة',
    mapDesc: 'الرياض - طريق الملك فهد',
    mapBtn: 'فتح في خرائط جوجل',
    faqBadge: 'أسئلة شائعة',
    faqTitle: 'الأسئلة الأكثر شيوعاً',
    faqDesc: 'إجابات على الأسئلة المتكررة حول منصتنا',
    faq1Q: '❓ كيف يمكنني التقديم على وظيفة؟',
    faq1A: 'يمكنك تصفح الوظائف المتاحة من صفحة الوظائف، ثم الضغط على "عرض التفاصيل" واختيار "قدّم الآن" لملء نموذج التقديم.',
    faq2Q: '❓ هل التسجيل مجاني؟',
    faq2A: 'نعم، التسجيل والتقديم على الوظائف مجاني بالكامل للباحثين عن عمل.',
    faq3Q: '❓ كم يستغرق الرد على طلبي؟',
    faq3A: 'عادةً ما يتم مراجعة الطلبات خلال 3-5 أيام عمل. سيتم التواصل معك عبر البريد الإلكتروني أو الهاتف.',
    faq4Q: '❓ هل يجب أن أمتلك تصنيف مهني؟',
    faq4A: 'نعم، معظم الوظائف الصحية تتطلب تصنيف مهني ساري من الهيئة السعودية للتخصصات الصحية.',
    successMsgSent: 'تم إرسال رسالتك بنجاح!',
    successMsgDesc: 'شكراً لتواصلك معنا. سيقوم فريقنا بالرد عليك في أقرب وقت ممكن.',
    backToHome: 'العودة للرئيسية',
    closeBtn: 'إغلاق',

    // Apply page
    applyPageTitle: 'التقديم على وظيفة',
    applyPageDesc: 'أكمل بياناتك للتقديم على الوظيفة',
    breadcrumbApply: 'التقديم',
    applyFormTitle: '📝 نموذج التقديم',
    applyFormDesc: 'يرجى ملء جميع الحقول المطلوبة بدقة لضمان معالجة طلبك بشكل صحيح.',
    labelFullName4: 'الاسم الكامل',
    labelSpecialty: 'التخصص',
    selectSpecialty: 'اختر التخصص',
    labelClassification: 'رقم التصنيف المهني',
    placeholderClassification: 'رقم التصنيف من هيئة التخصصات',
    labelCityApply: 'المدينة',
    selectCity: 'اختر المدينة',
    placeholderFullname: 'أدخل اسمك الرباعي',
    labelExperience: 'سنوات الخبرة',
    selectExperience: 'اختر',
    expLess1: 'أقل من سنة',
    exp1to3: '1 - 3 سنوات',
    exp3to5: '3 - 5 سنوات',
    exp5to10: '5 - 10 سنوات',
    exp10plus: 'أكثر من 10 سنوات',
    labelQualification: 'المؤهل العلمي',
    qualDiploma: 'دبلوم',
    qualBachelor: 'بكالوريوس',
    qualMaster: 'ماجستير',
    qualPhd: 'دكتوراه',
    qualBoard: 'بورد / زمالة',
    labelCV: 'السيرة الذاتية',
    cvDragText: 'اسحب الملف هنا أو <span>اضغط للاختيار</span>',
    cvLimit: 'PDF, DOC, DOCX - حد أقصى 5 ميجابايت',
    labelNote: 'رسالة مختصرة',
    placeholderNote: 'اكتب رسالة مختصرة عن نفسك وسبب اهتمامك بالوظيفة (اختياري)...',
    submitApplication: '📨 إرسال الطلب',
    successApply: 'تم إرسال طلبك بنجاح!',
    successApplyDesc: 'شكراً لتقديمك عبر Rawad Health. سيتم مراجعة طلبك والتواصل معك في أقرب وقت ممكن.',
    browseOtherJobs: 'تصفح وظائف أخرى',

    // Footer specialties
    footSpecGeneral: 'طب عام',
    footSpecNursing: 'تمريض',
    footSpecPharmacy: 'صيدلة',
    footSpecDentistry: 'طب أسنان',
    footSpecPhysio: 'علاج طبيعي',

    // Job Details page
    jobDetailsBreadcrumb: 'تفاصيل الوظيفة',
    jobDescLabel: '📋 وصف الوظيفة',
    jobTasksLabel: '📌 المهام والمسؤوليات',
    jobReqLabel: '📝 المتطلبات والمؤهلات',
    jobBenefitsLabel: '🎁 المزايا والحوافز',
    applyNowBtn: 'قدّم الآن على هذه الوظيفة',
    jobInfoTitle: 'معلومات الوظيفة',
    labelSalary: '💰 الراتب',
    labelCitySidebar: '📍 المدينة',
    labelWorkType: '⏰ نوع الدوام',
    labelSpecSidebar: '🩺 التخصص',
    labelFacilityType: '🏥 نوع المنشأة',
    labelPostDate: '📅 تاريخ النشر',
    interestedTitle: 'هل أنت مهتم؟',
    interestedDesc: 'لا تفوّت هذه الفرصة وقدّم طلبك الآن',
    applyNowShort: 'قدّم الآن',
    shareJob: 'شارك الوظيفة',
    shareTwitter: '𝕏 تويتر',
    shareLinkedin: 'in لينكدإن',
    shareCopy: '📋 نسخ',

    // Hero float cards
    heroFloatHired: 'موظف تم توظيفه',
    heroFloatSpec: 'تخصصاً صحياً',

    // Why Us section
    whyUsBadge: 'من نحن',
    whyUsTitle: 'شريكك الموثوق في التوظيف الصحي',
    whyUsDesc: 'Rawad Health هي منصة سعودية متخصصة في التوظيف الصحي، تهدف إلى سد الفجوة بين الكوادر الصحية المؤهلة والمنشآت الطبية المتميزة في المملكة.',
    whyUs1Title: 'فرص حقيقية وموثوقة',
    whyUs1Desc: 'جميع الوظائف المعروضة من منشآت صحية مرخصة ومعتمدة.',
    whyUs2Title: 'دعم مهني متكامل',
    whyUs2Desc: 'نساعدك في تطوير سيرتك الذاتية والتحضير للمقابلات.',
    whyUs3Title: 'تغطية شاملة',
    whyUs3Desc: 'نغطي جميع مناطق ومدن المملكة العربية السعودية.',
    whyUs4Title: 'شراكات استراتيجية',
    whyUs4Desc: 'شراكات مع أكثر من 150 منشأة صحية في المملكة.',
    statSpecialties: 'تخصص صحي',
    featuredBadge: 'فرص مميزة',

    // Service card badges
    svc1Badge: '⚕ توظيف',
    svc2Badge: '🚀 تطوير',

    // New services section
    newSvcTitle: 'تخصصات التوظيف الصحي',
    newSvcDesc: 'نوفر حلول توظيف متكاملة لكافة الكوادر الصحية في مختلف التخصصات',
    newSvc1Title: 'توظيف الأطباء',
    newSvc1Desc: 'ترشيح أطباء مؤهلين في مختلف التخصصات.',
    newSvc2Title: 'توظيف التمريض',
    newSvc2Desc: 'توفير ممرضين قانونيين ومساعدين.',
    newSvc3Title: 'توظيف الفنيين',
    newSvc3Desc: 'مختبر – أشعة – صيدلة – علاج طبيعي.',
    newSvc4Title: 'التوظيف الإداري الصحي',
    newSvc4Desc: 'سجلات – تأمين – إدارة جودة – موارد بشرية.',

    // Platform goals
    goalsBadge: 'رؤيتنا',
    goalsTitle: 'أهداف المنصة',
    goalsDesc: 'نسعى إلى تحقيق منظومة توظيف صحي شاملة ومتكاملة',
    goal1: 'نشر الوظائف الصحية',
    goal2: 'استقبال طلبات الممارسين الصحيين',
    goal3: 'تمكين المستشفيات والعيادات من طلب موظفين',
    goal4: 'إدارة عملية التوظيف الصحي بشكل احترافي',

    // Target audience
    audienceBadge: 'من نخدم',
    audienceTitle: 'الجمهور المستهدف',
    audienceDesc: 'نخدم جميع قطاعات المنظومة الصحية في المملكة العربية السعودية',
    audHospitals: 'المستشفيات',
    audClinics: 'العيادات',
    audCenters: 'المراكز الطبية',
    audLabs: 'المختبرات',
    audPharmacies: 'الصيدليات',
    audStaff: 'الكوادر الطبية (أطباء – تمريض – فنيين – إداريين صحيين)',
    audModalBtn: 'تصفح الوظائف المتاحة',

    // Auth buttons
    authLogin: 'تسجيل الدخول',
    authRegister: 'إنشاء حساب',
    authLogout: 'تسجيل الخروج',

    // Login page
    loginTitle: 'تسجيل الدخول',
    loginSubtitle: 'أهلاً بك في منصة Rawad Health',
    labelPassword: 'كلمة المرور',
    loginBtn: 'دخول',
    loginNoAccount: 'ليس لديك حساب؟',
    loginCreateNew: 'إنشاء حساب جديد',

    // Register page
    registerTitle: 'إنشاء حساب',
    registerSubtitle: 'انضم إلى منصة Rawad Health',
    typeJobSeekerLabel: 'باحث عن عمل',
    typeAdminLabel: 'مسؤول / مؤسسة صحية',
    labelFullNameRegister: 'الاسم الكامل',
    labelOrgName: 'اسم المؤسسة',
    labelPasswordRegister: 'كلمة المرور',
    regPhoneLabel: 'رقم الجوال',
    registerBtn: 'إنشاء الحساب',
    registerHasAccount: 'لديك حساب بالفعل؟',
  },
  en: {
    // Header / Nav
    langLabel: 'عربي',
    navHome: 'Home',
    navJobs: 'Jobs',
    navContact: 'Contact Us',
    browseJobs: 'Browse Jobs',

    // Hero
    heroBadge: '🏥 The Leading Health Platform in Saudi Arabia',
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
    viewAllJobs: 'View All Jobs →',
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
    copyright: '© 2026 Rawad Health. All rights reserved.',
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
    filterBtn: '🔍 Search',
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
    contactFormTitle: '📩 Send Us a Message',
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
    sendMessage: '📨 Send Message',
    infoEmail: 'Email',
    infoPhone: 'Phone',
    infoAddress: 'Address',
    infoAddressValue: 'Riyadh, Saudi Arabia',
    infoAddressDetail: 'King Fahd Road, Kingdom Tower, Floor 15',
    infoHours: 'Working Hours',
    infoHoursValue: 'Sunday - Thursday: 8:00 AM - 5:00 PM',
    infoHoursClosed: 'Friday & Saturday: Closed',
    infoPhoneHours: 'Sunday - Thursday: 8 AM - 5 PM',
    mapTitle: '📍 Our Location on Map',
    mapDesc: 'Riyadh - King Fahd Road',
    mapBtn: 'Open in Google Maps',
    faqBadge: 'FAQ',
    faqTitle: 'Frequently Asked Questions',
    faqDesc: 'Answers to common questions about our platform',
    faq1Q: '❓ How can I apply for a job?',
    faq1A: 'You can browse available jobs from the Jobs page, then click "View Details" and select "Apply Now" to fill out the application form.',
    faq2Q: '❓ Is registration free?',
    faq2A: 'Yes, registration and job applications are completely free for job seekers.',
    faq3Q: '❓ How long does it take to hear back?',
    faq3A: 'Applications are typically reviewed within 3-5 business days. You will be contacted via email or phone.',
    faq4Q: '❓ Do I need a professional classification?',
    faq4A: 'Yes, most healthcare jobs require a valid professional classification from the Saudi Commission for Health Specialties.',
    successMsgSent: 'Your message was sent successfully!',
    successMsgDesc: 'Thank you for contacting us. Our team will respond to you as soon as possible.',
    backToHome: 'Back to Home',
    closeBtn: 'Close',

    // Apply page
    applyPageTitle: 'Apply for a Job',
    applyPageDesc: 'Complete your details to apply for the position',
    breadcrumbApply: 'Apply',
    applyFormTitle: '📝 Application Form',
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
    submitApplication: '📨 Submit Application',
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
    jobDescLabel: '📋 Job Description',
    jobTasksLabel: '📌 Tasks & Responsibilities',
    jobReqLabel: '📝 Requirements & Qualifications',
    jobBenefitsLabel: '🎁 Benefits & Incentives',
    applyNowBtn: 'Apply Now for This Job',
    jobInfoTitle: 'Job Information',
    labelSalary: '💰 Salary',
    labelCitySidebar: '📍 City',
    labelWorkType: '⏰ Work Type',
    labelSpecSidebar: '🩺 Specialty',
    labelFacilityType: '🏥 Facility Type',
    labelPostDate: '📅 Posted',
    interestedTitle: 'Interested?',
    interestedDesc: "Don't miss this opportunity - apply now",
    applyNowShort: 'Apply Now',
    shareJob: 'Share Job',
    shareTwitter: '𝕏 Twitter',
    shareLinkedin: 'in LinkedIn',
    shareCopy: '📋 Copy',

    // Hero float cards
    heroFloatHired: 'Professionals Hired',
    heroFloatSpec: 'Health Specialties',

    // Why Us section
    whyUsBadge: 'About Us',
    whyUsTitle: 'Your Trusted Healthcare Recruitment Partner',
    whyUsDesc: 'Rawad Health is a Saudi platform specializing in healthcare recruitment, bridging the gap between qualified medical professionals and distinguished medical facilities in the Kingdom.',
    whyUs1Title: 'Real & Verified Opportunities',
    whyUs1Desc: 'All posted jobs are from licensed and accredited healthcare facilities.',
    whyUs2Title: 'Comprehensive Career Support',
    whyUs2Desc: 'We help you develop your CV and prepare for interviews.',
    whyUs3Title: 'Full Coverage',
    whyUs3Desc: 'We cover all regions and cities of Saudi Arabia.',
    whyUs4Title: 'Strategic Partnerships',
    whyUs4Desc: 'Partnerships with over 150 healthcare facilities in the Kingdom.',
    statSpecialties: 'Health Specialties',
    featuredBadge: 'Featured Opportunities',

    // Service card badges
    svc1Badge: '⚕ Recruitment',
    svc2Badge: '🚀 Development',

    // New services section
    newSvcTitle: 'Healthcare Recruitment Specialties',
    newSvcDesc: 'We provide comprehensive recruitment solutions for all healthcare professionals across various specialties',
    newSvc1Title: 'Physician Recruitment',
    newSvc1Desc: 'Qualifying doctors in various specialties.',
    newSvc2Title: 'Nursing Recruitment',
    newSvc2Desc: 'Providing licensed nurses and assistants.',
    newSvc3Title: 'Technician Recruitment',
    newSvc3Desc: 'Lab – Radiology – Pharmacy – Physiotherapy.',
    newSvc4Title: 'Healthcare Admin Recruitment',
    newSvc4Desc: 'Records – Insurance – Quality Management – HR.',

    // Platform goals
    goalsBadge: 'Our Vision',
    goalsTitle: 'Platform Goals',
    goalsDesc: 'We strive to achieve a comprehensive and integrated healthcare recruitment system',
    goal1: 'Publishing healthcare jobs',
    goal2: 'Receiving applications from healthcare practitioners',
    goal3: 'Enabling hospitals and clinics to request staff',
    goal4: 'Managing the healthcare recruitment process professionally',

    // Target audience
    audienceBadge: 'Who We Serve',
    audienceTitle: 'Target Audience',
    audienceDesc: 'We serve all sectors of the healthcare system in Saudi Arabia',
    audHospitals: 'Hospitals',
    audClinics: 'Clinics',
    audCenters: 'Medical Centers',
    audLabs: 'Laboratories',
    audPharmacies: 'Pharmacies',
    audStaff: 'Medical Staff (Doctors – Nursing – Technicians – Health Admin)',
    audModalBtn: 'Browse Available Jobs',

    // Auth buttons
    authLogin: 'Login',
    authRegister: 'Register',
    authLogout: 'Logout',

    // Login page
    loginTitle: 'Login',
    loginSubtitle: 'Welcome to Rawad Health Platform',
    labelPassword: 'Password',
    loginBtn: 'Sign In',
    loginNoAccount: "Don't have an account?",
    loginCreateNew: 'Create New Account',

    // Register page
    registerTitle: 'Create Account',
    registerSubtitle: 'Join Rawad Health Platform',
    typeJobSeekerLabel: 'Job Seeker',
    typeAdminLabel: 'Admin / Healthcare Organization',
    labelFullNameRegister: 'Full Name',
    labelOrgName: 'Organization Name',
    labelPasswordRegister: 'Password',
    regPhoneLabel: 'Phone Number',
    registerBtn: 'Create Account',
    registerHasAccount: 'Already have an account?',
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
    'index.html': lang === 'ar' ? 'Rawad Health | منصة التوظيف الصحي' : 'Rawad Health | Healthcare Recruitment',
    'jobs.html':  lang === 'ar' ? 'الوظائف | Rawad Health' : 'Jobs | Rawad Health',
    'contact.html': lang === 'ar' ? 'تواصل معنا | Rawad Health' : 'Contact Us | Rawad Health',
    'apply.html': lang === 'ar' ? 'التقديم | Rawad Health' : 'Apply | Rawad Health',
    'job-details.html': lang === 'ar' ? 'تفاصيل الوظيفة | Rawad Health' : 'Job Details | Rawad Health',
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
  // Apply saved language (if not default Arabic)
  if (currentLang !== 'ar') {
    setLanguage(currentLang);
  }
});
