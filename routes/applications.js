const express     = require('express');
const router      = express.Router();
const multer      = require('multer');
const path        = require('path');
const Application = require('../models/Application');

// ───── Multer config — حفظ ملفات CV ─────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename:    (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم. يرجى رفع PDF أو DOC أو DOCX'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// ───── POST /api/applications — تقديم طلب جديد ─────
router.post('/', upload.single('cv'), async (req, res) => {
  try {
    const {
      jobId, jobTitle, fullname, specialty, classification,
      city, phone, email, experience, qualification, message
    } = req.body;

    // Server-side validation
    const errors = [];
    if (!fullname || !fullname.trim())        errors.push('الاسم الكامل مطلوب');
    if (!specialty || !specialty.trim())       errors.push('التخصص مطلوب');
    if (!classification || !classification.trim()) errors.push('رقم التصنيف المهني مطلوب');
    if (!city || !city.trim())                errors.push('المدينة مطلوبة');
    if (!phone || !phone.trim())              errors.push('رقم الجوال مطلوب');
    if (!email || !email.trim())              errors.push('البريد الإلكتروني مطلوب');

    // Phone validation
    if (phone && !/^05[0-9]{8}$/.test(phone.trim())) {
      errors.push('رقم الجوال غير صحيح (يجب أن يبدأ بـ 05 ويتكون من 10 أرقام)');
    }

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push('البريد الإلكتروني غير صحيح');
    }

    if (!req.file) errors.push('يرجى إرفاق السيرة الذاتية');

    if (errors.length) return res.status(400).json({ error: 'بيانات غير مكتملة', details: errors });

    const application = await Application.create({
      jobId:          jobId || null,
      jobTitle:       jobTitle || '',
      fullname:       fullname.trim(),
      specialty:      specialty.trim(),
      classification: classification.trim(),
      city:           city.trim(),
      phone:          phone.trim(),
      email:          email.trim(),
      experience:     experience || '',
      qualification:  qualification || '',
      message:        message || '',
      cvPath:         req.file.filename,
      cvOriginalName: req.file.originalname,
    });

    res.status(201).json({ message: 'تم إرسال طلبك بنجاح!', application });
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ في إرسال الطلب', details: err.message });
  }
});

// ───── GET /api/applications — جلب كل الطلبات ─────
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 }).populate('jobId', 'title company');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ في جلب الطلبات', details: err.message });
  }
});

// ───── PATCH /api/applications/:id/status — تغيير حالة الطلب ─────
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['جديد', 'مقبول', 'مرفوض'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'حالة غير صحيحة', allowed: allowedStatuses });
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!app) return res.status(404).json({ error: 'الطلب غير موجود' });

    res.json({ message: 'تم تحديث الحالة بنجاح', application: app });
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ', details: err.message });
  }
});

// ───── DELETE /api/applications/:id — حذف طلب ─────
router.delete('/:id', async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ error: 'الطلب غير موجود' });
    res.json({ message: 'تم حذف الطلب بنجاح' });
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ', details: err.message });
  }
});

module.exports = router;
