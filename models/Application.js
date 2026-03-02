const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
  jobTitle:       { type: String, default: '' },
  fullname:       { type: String, required: [true, 'الاسم الكامل مطلوب'], trim: true },
  specialty:      { type: String, required: [true, 'التخصص مطلوب'], trim: true },
  classification: { type: String, required: [true, 'رقم التصنيف المهني مطلوب'], trim: true },
  city:           { type: String, required: [true, 'المدينة مطلوبة'], trim: true },
  phone:          { type: String, required: [true, 'رقم الجوال مطلوب'], trim: true },
  email:          { type: String, required: [true, 'البريد الإلكتروني مطلوب'], trim: true, lowercase: true },
  experience:     { type: String, default: '' },
  qualification:  { type: String, default: '' },
  message:        { type: String, default: '' },
  cvPath:         { type: String, required: [true, 'السيرة الذاتية مطلوبة'] },
  cvOriginalName: { type: String, default: '' },
  status:         { type: String, enum: ['جديد', 'مقبول', 'مرفوض'], default: 'جديد' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
