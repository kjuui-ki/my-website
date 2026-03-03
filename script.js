/* ========================================
   Rawad Health - JavaScript
   ======================================== */

// ===== Jobs Data =====
const jobsData = [
  {
    id: 1,
    title: "طبيب أسنان عام",
    company: "مستشفى الملك فهد التخصصي",
    companyLogo: "🏥",
    specialty: "طب-اسنان",
    city: "الرياض",
    facilityType: "مستشفى",
    jobType: "دوام-كامل",
    salary: "25,000 - 35,000 ر.س",
    date: "منذ 3 أيام",
    description: "نبحث عن طبيب أسنان عام ذو خبرة للانضمام إلى فريقنا الطبي المتميز في مستشفى الملك فهد التخصصي بالرياض.",
    tasks: [
      "إجراء الفحوصات السريرية للمرضى وتشخيص الحالات",
      "تنفيذ إجراءات علاج الأسنان المختلفة",
      "وضع خطط علاجية شاملة للمرضى",
      "متابعة حالات المرضى بعد العلاج",
      "المشاركة في برامج التثقيف الصحي"
    ],
    requirements: [
      "بكالوريوس طب وجراحة الفم والأسنان",
      "تصنيف مهني ساري من الهيئة السعودية للتخصصات الصحية",
      "خبرة لا تقل عن 3 سنوات",
      "إجادة اللغة العربية والإنجليزية",
      "مهارات تواصل ممتازة"
    ],
    benefits: [
      "راتب تنافسي مع بدلات",
      "تأمين طبي شامل",
      "إجازة سنوية مدفوعة",
      "فرص تدريب وتطوير مهني",
      "بيئة عمل احترافية"
    ]
  },
  {
    id: 2,
    title: "ممرض/ة عناية مركزة",
    company: "مجموعة سليمان الحبيب الطبية",
    companyLogo: "🏥",
    specialty: "تمريض",
    city: "جدة",
    facilityType: "مستشفى",
    jobType: "دوام-كامل",
    salary: "15,000 - 22,000 ر.س",
    date: "منذ يومين",
    description: "مطلوب ممرض/ة متخصص/ة في العناية المركزة للعمل في مجموعة سليمان الحبيب الطبية بجدة.",
    tasks: [
      "تقديم الرعاية التمريضية المتقدمة لمرضى العناية المركزة",
      "مراقبة العلامات الحيوية للمرضى بشكل مستمر",
      "إدارة الأجهزة الطبية المتخصصة",
      "التنسيق مع الفريق الطبي لتنفيذ خطط العلاج",
      "توثيق الحالات الطبية بدقة"
    ],
    requirements: [
      "بكالوريوس تمريض من جامعة معتمدة",
      "تصنيف مهني ساري المفعول",
      "خبرة 2 سنة في العناية المركزة",
      "شهادة BLS و ACLS سارية",
      "القدرة على العمل بنظام الورديات"
    ],
    benefits: [
      "راتب مجزي مع بدل سكن",
      "تأمين صحي للموظف والعائلة",
      "بدل نقل",
      "مكافآت أداء سنوية",
      "تدريب مستمر"
    ]
  },
  {
    id: 3,
    title: "صيدلي إكلينيكي",
    company: "مستشفى المملكة",
    companyLogo: "💊",
    specialty: "صيدلة",
    city: "الرياض",
    facilityType: "مستشفى",
    jobType: "دوام-كامل",
    salary: "18,000 - 28,000 ر.س",
    date: "منذ 5 أيام",
    description: "فرصة مميزة لصيدلي إكلينيكي للعمل في أحد أكبر المستشفيات بالرياض.",
    tasks: [
      "مراجعة الوصفات الطبية والتحقق من سلامتها",
      "تقديم الاستشارات الدوائية للفريق الطبي والمرضى",
      "المشاركة في الجولات الطبية",
      "متابعة التفاعلات الدوائية والأعراض الجانبية",
      "المساهمة في وضع بروتوكولات العلاج الدوائي"
    ],
    requirements: [
      "بكالوريوس صيدلة أو دكتور صيدلة (PharmD)",
      "تصنيف مهني من هيئة التخصصات الصحية",
      "خبرة 3 سنوات في الصيدلة الإكلينيكية",
      "معرفة بأنظمة إدارة الصيدليات",
      "مهارات تحليلية قوية"
    ],
    benefits: [
      "حزمة رواتب تنافسية",
      "تأمين طبي شامل",
      "بدل سكن ونقل",
      "إجازات سخية",
      "فرص للتطوير المهني والأبحاث"
    ]
  },
  {
    id: 4,
    title: "أخصائي علاج طبيعي",
    company: "مركز التأهيل المتقدم",
    companyLogo: "🦴",
    specialty: "علاج-طبيعي",
    city: "الدمام",
    facilityType: "مركز-تأهيل",
    jobType: "دوام-كامل",
    salary: "14,000 - 20,000 ر.س",
    date: "منذ أسبوع",
    description: "نبحث عن أخصائي علاج طبيعي متميز للانضمام لمركز التأهيل المتقدم بالدمام.",
    tasks: [
      "تقييم حالات المرضى ووضع خطط علاجية فردية",
      "تنفيذ برامج العلاج الطبيعي المتنوعة",
      "استخدام الأجهزة والتقنيات العلاجية الحديثة",
      "تثقيف المرضى والعائلات حول التمارين المنزلية",
      "توثيق تقدم المرضى وتعديل الخطط العلاجية"
    ],
    requirements: [
      "بكالوريوس علاج طبيعي",
      "تصنيف مهني ساري",
      "خبرة سنتين على الأقل",
      "إلمام بتقنيات العلاج الطبيعي الحديثة",
      "القدرة على العمل ضمن فريق متعدد التخصصات"
    ],
    benefits: [
      "راتب تنافسي",
      "تأمين صحي",
      "بيئة عمل محفزة",
      "دورات تدريبية متخصصة",
      "إجازة سنوية 30 يوم"
    ]
  },
  {
    id: 5,
    title: "أخصائي أشعة",
    company: "مستشفى الحمادي",
    companyLogo: "🔬",
    specialty: "اشعة",
    city: "جدة",
    facilityType: "مستشفى",
    jobType: "دوام-جزئي",
    salary: "12,000 - 18,000 ر.س",
    date: "منذ 4 أيام",
    description: "مطلوب أخصائي أشعة للعمل بدوام جزئي في مستشفى الحمادي بجدة.",
    tasks: [
      "إجراء الفحوصات الإشعاعية المختلفة",
      "تشغيل وصيانة أجهزة الأشعة",
      "التأكد من جودة الصور الإشعاعية",
      "الالتزام بمعايير السلامة الإشعاعية",
      "التعاون مع أطباء الأشعة في إعداد التقارير"
    ],
    requirements: [
      "بكالوريوس في تقنية الأشعة",
      "تصنيف مهني ساري",
      "خبرة لا تقل عن سنة",
      "معرفة بأجهزة الأشعة الحديثة",
      "الالتزام بمعايير الجودة والسلامة"
    ],
    benefits: [
      "راتب مناسب للدوام الجزئي",
      "تأمين طبي",
      "مرونة في الجدول",
      "بيئة عمل متطورة",
      "فرص تدريب"
    ]
  },
  {
    id: 6,
    title: "طبيب طوارئ",
    company: "مستشفى الأمير سلطان",
    companyLogo: "🚑",
    specialty: "طب-عام",
    city: "المدينة",
    facilityType: "مستشفى",
    jobType: "دوام-كامل",
    salary: "30,000 - 45,000 ر.س",
    date: "منذ يوم",
    description: "فرصة عمل مميزة لطبيب طوارئ ذو خبرة في مستشفى الأمير سلطان بالمدينة المنورة.",
    tasks: [
      "استقبال وتقييم حالات الطوارئ",
      "اتخاذ القرارات الطبية السريعة والحاسمة",
      "إجراء عمليات الإنعاش والتدخلات الطارئة",
      "الإشراف على فريق الطوارئ",
      "التنسيق مع الأقسام الأخرى لتحويل المرضى"
    ],
    requirements: [
      "بكالوريوس الطب والجراحة",
      "شهادة البورد أو الزمالة في طب الطوارئ",
      "تصنيف مهني ساري",
      "خبرة 5 سنوات في طب الطوارئ",
      "شهادات ATLS و ACLS سارية"
    ],
    benefits: [
      "راتب تنافسي جداً",
      "بدل خطورة",
      "تأمين طبي VIP",
      "سكن مؤثث",
      "تذاكر سفر سنوية"
    ]
  }
];

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

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
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

  const featured = jobsData.slice(0, 3);
  grid.innerHTML = featured.map(job => `
    <div class="job-card fade-in">
      <div class="job-card-header">
        <div class="job-company-logo">${job.companyLogo}</div>
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
        <span class="job-date">${job.date}</span>
        <a href="job-details.html?id=${job.id}" class="job-apply-link">عرض التفاصيل ←</a>
      </div>
    </div>
  `).join('');

  // Re-init animations for new elements
  initScrollAnimations();
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count], .stat-card-number[data-count]');
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
      counter.textContent = Math.floor(current).toLocaleString('ar-SA') + suffix;
    }, 30);
  });
}

// ===== Jobs Page =====
function initJobsPage() {
  renderJobsList(jobsData);

  // Filter handlers
  const filterBtn = document.getElementById('filter-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', applyFilters);
  }

  // Also apply on select change
  document.querySelectorAll('.filters-grid select').forEach(select => {
    select.addEventListener('change', applyFilters);
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(applyFilters, 300));
  }
}

function applyFilters() {
  const specialty = document.getElementById('filter-specialty')?.value || '';
  const city = document.getElementById('filter-city')?.value || '';
  const facilityType = document.getElementById('filter-facility')?.value || '';
  const jobType = document.getElementById('filter-type')?.value || '';
  const searchTerm = document.getElementById('search-input')?.value?.toLowerCase() || '';

  let filtered = jobsData.filter(job => {
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
      </div>
    `;
    return;
  }

  list.innerHTML = jobs.map(job => `
    <div class="job-list-card fade-in">
      <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
        <div class="job-company-logo">${job.companyLogo}</div>
        <div class="job-list-info">
          <h3>${job.title}</h3>
          <div class="company-name">${job.company}</div>
          <div class="job-list-meta">
            <span>📍 ${job.city}</span>
            <span>🏥 ${job.facilityType}</span>
            <span>⏰ ${job.jobType.replace('-', ' ')}</span>
            <span>📅 ${job.date}</span>
          </div>
        </div>
      </div>
      <div class="job-list-actions">
        <div class="job-list-salary">${job.salary}</div>
        <a href="job-details.html?id=${job.id}" class="btn btn-primary" style="padding: 8px 24px; font-size: 0.9rem;">عرض التفاصيل</a>
      </div>
    </div>
  `).join('');

  initScrollAnimations();
}

// ===== Job Details Page =====
function initJobDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const jobId = parseInt(params.get('id')) || 1;
  const job = jobsData.find(j => j.id === jobId) || jobsData[0];

  if (!job) return;

  // Fill page content
  setTextContent('job-title', job.title);
  setTextContent('job-company', job.company);
  setTextContent('job-description', job.description);
  setTextContent('job-salary-value', job.salary);
  setTextContent('job-city-value', job.city);
  setTextContent('job-type-value', job.jobType.replace('-', ' '));
  setTextContent('job-specialty-value', job.specialty.replace('-', ' '));
  setTextContent('job-facility-value', job.facilityType);
  setTextContent('job-date-value', job.date);

  // Render lists
  renderList('job-tasks-list', job.tasks);
  renderList('job-requirements-list', job.requirements);
  renderList('job-benefits-list', job.benefits);

  // Apply button link
  const applyBtn = document.getElementById('apply-btn');
  if (applyBtn) {
    applyBtn.href = `apply.html?job=${encodeURIComponent(job.title)}&id=${job.id}`;
  }

  const applySidebarBtn = document.getElementById('apply-sidebar-btn');
  if (applySidebarBtn) {
    applySidebarBtn.href = `apply.html?job=${encodeURIComponent(job.title)}&id=${job.id}`;
  }
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
    showAlert('error-alert', 'يرجى ملء جميع الحقول المطلوبة');
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
        showAlert('error-alert', 'يرجى ملء جميع الحقول المطلوبة');
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

  function update() {
    start += step;
    if (start >= target) {
      element.textContent = target.toLocaleString('ar-SA');
      return;
    }
    element.textContent = Math.floor(start).toLocaleString('ar-SA');
    requestAnimationFrame(update);
  }

  update();
}
