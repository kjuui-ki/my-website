require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');

const app  = express();
const PORT = process.env.PORT || 5000;

// ───── Ensure uploads folder exists ─────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// ───── Middleware ─────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ───── Serve static files (HTML, CSS, JS, images) ─────
app.use(express.static(path.join(__dirname, 'public')));

// ───── Serve uploaded CVs ─────
app.use('/uploads', express.static(uploadsDir));

// ───── API Routes ─────
app.use('/api/jobs',         require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));

// ───── Seed endpoint — fill DB with sample data (run once) ─────
const Job = require('./models/Job');
app.post('/api/seed', async (req, res) => {
  try {
    const count = await Job.countDocuments();
    if (count > 0) return res.json({ message: `قاعدة البيانات تحتوي بالفعل على ${count} وظائف` });

    const sampleJobs = [
      {
        title: "طبيب أسنان عام",
        company: "مستشفى الملك فهد التخصصي",
        companyLogo: "🏥",
        specialty: "طب-اسنان",
        city: "الرياض",
        facilityType: "مستشفى",
        jobType: "دوام-كامل",
        salary: "25,000 - 35,000 ر.س",
        description: "نبحث عن طبيب أسنان عام ذو خبرة للانضمام إلى فريقنا الطبي المتميز في مستشفى الملك فهد التخصصي بالرياض.",
        tasks: ["إجراء الفحوصات السريرية للمرضى وتشخيص الحالات","تنفيذ إجراءات علاج الأسنان المختلفة","وضع خطط علاجية شاملة للمرضى","متابعة حالات المرضى بعد العلاج","المشاركة في برامج التثقيف الصحي"],
        requirements: ["بكالوريوس طب وجراحة الفم والأسنان","تصنيف مهني ساري من الهيئة السعودية للتخصصات الصحية","خبرة لا تقل عن 3 سنوات","إجادة اللغة العربية والإنجليزية","مهارات تواصل ممتازة"],
        benefits: ["راتب تنافسي مع بدلات","تأمين طبي شامل","إجازة سنوية مدفوعة","فرص تدريب وتطوير مهني","بيئة عمل احترافية"]
      },
      {
        title: "ممرض/ة عناية مركزة",
        company: "مجموعة سليمان الحبيب الطبية",
        companyLogo: "🏥",
        specialty: "تمريض",
        city: "جدة",
        facilityType: "مستشفى",
        jobType: "دوام-كامل",
        salary: "15,000 - 22,000 ر.س",
        description: "مطلوب ممرض/ة متخصص/ة في العناية المركزة للعمل في مجموعة سليمان الحبيب الطبية بجدة.",
        tasks: ["تقديم الرعاية التمريضية المتقدمة لمرضى العناية المركزة","مراقبة العلامات الحيوية للمرضى بشكل مستمر","إدارة الأجهزة الطبية المتخصصة","التنسيق مع الفريق الطبي لتنفيذ خطط العلاج","توثيق الحالات الطبية بدقة"],
        requirements: ["بكالوريوس تمريض من جامعة معتمدة","تصنيف مهني ساري المفعول","خبرة 2 سنة في العناية المركزة","شهادة BLS و ACLS سارية","القدرة على العمل بنظام الورديات"],
        benefits: ["راتب مجزي مع بدل سكن","تأمين صحي للموظف والعائلة","بدل نقل","مكافآت أداء سنوية","تدريب مستمر"]
      },
      {
        title: "صيدلي إكلينيكي",
        company: "مستشفى المملكة",
        companyLogo: "💊",
        specialty: "صيدلة",
        city: "الرياض",
        facilityType: "مستشفى",
        jobType: "دوام-كامل",
        salary: "18,000 - 28,000 ر.س",
        description: "فرصة مميزة لصيدلي إكلينيكي للعمل في أحد أكبر المستشفيات بالرياض.",
        tasks: ["مراجعة الوصفات الطبية والتحقق من سلامتها","تقديم الاستشارات الدوائية للفريق الطبي والمرضى","المشاركة في الجولات الطبية","متابعة التفاعلات الدوائية والأعراض الجانبية","المساهمة في وضع بروتوكولات العلاج الدوائي"],
        requirements: ["بكالوريوس صيدلة أو دكتور صيدلة (PharmD)","تصنيف مهني من هيئة التخصصات الصحية","خبرة 3 سنوات في الصيدلة الإكلينيكية","معرفة بأنظمة إدارة الصيدليات","مهارات تحليلية قوية"],
        benefits: ["حزمة رواتب تنافسية","تأمين طبي شامل","بدل سكن ونقل","إجازات سخية","فرص للتطوير المهني والأبحاث"]
      },
      {
        title: "أخصائي علاج طبيعي",
        company: "مركز التأهيل المتقدم",
        companyLogo: "🦴",
        specialty: "علاج-طبيعي",
        city: "الدمام",
        facilityType: "مركز-تأهيل",
        jobType: "دوام-كامل",
        salary: "14,000 - 20,000 ر.س",
        description: "نبحث عن أخصائي علاج طبيعي متميز للانضمام لمركز التأهيل المتقدم بالدمام.",
        tasks: ["تقييم حالات المرضى ووضع خطط علاجية فردية","تنفيذ برامج العلاج الطبيعي المتنوعة","استخدام الأجهزة والتقنيات العلاجية الحديثة","تثقيف المرضى والعائلات حول التمارين المنزلية","توثيق تقدم المرضى وتعديل الخطط العلاجية"],
        requirements: ["بكالوريوس علاج طبيعي","تصنيف مهني ساري","خبرة سنتين على الأقل","إلمام بتقنيات العلاج الطبيعي الحديثة","القدرة على العمل ضمن فريق متعدد التخصصات"],
        benefits: ["راتب تنافسي","تأمين صحي","بيئة عمل محفزة","دورات تدريبية متخصصة","إجازة سنوية 30 يوم"]
      },
      {
        title: "أخصائي أشعة",
        company: "مستشفى الحمادي",
        companyLogo: "🔬",
        specialty: "اشعة",
        city: "جدة",
        facilityType: "مستشفى",
        jobType: "دوام-جزئي",
        salary: "12,000 - 18,000 ر.س",
        description: "مطلوب أخصائي أشعة للعمل بدوام جزئي في مستشفى الحمادي بجدة.",
        tasks: ["إجراء الفحوصات الإشعاعية المختلفة","تشغيل وصيانة أجهزة الأشعة","التأكد من جودة الصور الإشعاعية","الالتزام بمعايير السلامة الإشعاعية","التعاون مع أطباء الأشعة في إعداد التقارير"],
        requirements: ["بكالوريوس في تقنية الأشعة","تصنيف مهني ساري","خبرة لا تقل عن سنة","معرفة بأجهزة الأشعة الحديثة","الالتزام بمعايير الجودة والسلامة"],
        benefits: ["راتب مناسب للدوام الجزئي","تأمين طبي","مرونة في الجدول","بيئة عمل متطورة","فرص تدريب"]
      },
      {
        title: "طبيب طوارئ",
        company: "مستشفى الأمير سلطان",
        companyLogo: "🚑",
        specialty: "طب-عام",
        city: "المدينة",
        facilityType: "مستشفى",
        jobType: "دوام-كامل",
        salary: "30,000 - 45,000 ر.س",
        description: "فرصة عمل مميزة لطبيب طوارئ ذو خبرة في مستشفى الأمير سلطان بالمدينة المنورة.",
        tasks: ["استقبال وتقييم حالات الطوارئ","اتخاذ القرارات الطبية السريعة والحاسمة","إجراء عمليات الإنعاش والتدخلات الطارئة","الإشراف على فريق الطوارئ","التنسيق مع الأقسام الأخرى لتحويل المرضى"],
        requirements: ["بكالوريوس الطب والجراحة","شهادة البورد أو الزمالة في طب الطوارئ","تصنيف مهني ساري","خبرة 5 سنوات في طب الطوارئ","شهادات ATLS و ACLS سارية"],
        benefits: ["راتب تنافسي جداً","بدل خطورة","تأمين طبي VIP","سكن مؤثث","تذاكر سفر سنوية"]
      }
    ];

    await Job.insertMany(sampleJobs);
    res.status(201).json({ message: `تم إضافة ${sampleJobs.length} وظائف تجريبية بنجاح` });
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ', details: err.message });
  }
});

// ───── Fallback — serve index.html for unknown paths ─────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ───── Connect to MongoDB & Start Server ─────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ تم الاتصال بقاعدة البيانات MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`);
      console.log(`📂 لوحة التحكم: http://localhost:${PORT}/admin.html`);
    });
  })
  .catch(err => {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message);
    process.exit(1);
  });
