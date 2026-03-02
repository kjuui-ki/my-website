const express = require('express');
const router  = express.Router();
const Job     = require('../models/Job');

// ───── GET /api/jobs — جلب جميع الوظائف (مع فلاتر اختيارية) ─────
router.get('/', async (req, res) => {
  try {
    const { specialty, city, facilityType, jobType, search } = req.query;
    const filter = {};

    if (specialty)    filter.specialty    = specialty;
    if (city)         filter.city         = city;
    if (facilityType) filter.facilityType = facilityType;
    if (jobType)      filter.jobType      = jobType;
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { company:     { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ في جلب الوظائف', details: err.message });
  }
});

// ───── GET /api/jobs/:id — جلب وظيفة واحدة ─────
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'الوظيفة غير موجودة' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ', details: err.message });
  }
});

// ───── POST /api/jobs — إضافة وظيفة جديدة ─────
router.post('/', async (req, res) => {
  try {
    const {
      title, company, companyLogo, specialty, city,
      facilityType, jobType, salary, description,
      tasks, requirements, benefits
    } = req.body;

    // Server-side validation
    const errors = [];
    if (!title || !title.trim())        errors.push('عنوان الوظيفة مطلوب');
    if (!company || !company.trim())    errors.push('اسم الشركة مطلوب');
    if (!specialty || !specialty.trim()) errors.push('التخصص مطلوب');
    if (!city || !city.trim())          errors.push('المدينة مطلوبة');
    if (!facilityType || !facilityType.trim()) errors.push('نوع المنشأة مطلوب');
    if (!jobType || !jobType.trim())    errors.push('نوع الدوام مطلوب');
    if (!salary || !salary.trim())      errors.push('الراتب مطلوب');
    if (!description || !description.trim()) errors.push('وصف الوظيفة مطلوب');

    if (errors.length) return res.status(400).json({ error: 'بيانات غير مكتملة', details: errors });

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      companyLogo: companyLogo || '🏥',
      specialty: specialty.trim(),
      city: city.trim(),
      facilityType: facilityType.trim(),
      jobType: jobType.trim(),
      salary: salary.trim(),
      description: description.trim(),
      tasks:        Array.isArray(tasks) ? tasks : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      benefits:     Array.isArray(benefits) ? benefits : [],
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ في إنشاء الوظيفة', details: err.message });
  }
});

// ───── DELETE /api/jobs/:id — حذف وظيفة ─────
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'الوظيفة غير موجودة' });
    res.json({ message: 'تم حذف الوظيفة بنجاح' });
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ في حذف الوظيفة', details: err.message });
  }
});

module.exports = router;
