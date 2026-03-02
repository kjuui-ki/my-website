const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:        { type: String, required: [true, 'عنوان الوظيفة مطلوب'], trim: true },
  company:      { type: String, required: [true, 'اسم الشركة مطلوب'], trim: true },
  companyLogo:  { type: String, default: '🏥' },
  specialty:    { type: String, required: [true, 'التخصص مطلوب'], trim: true },
  city:         { type: String, required: [true, 'المدينة مطلوبة'], trim: true },
  facilityType: { type: String, required: [true, 'نوع المنشأة مطلوب'], trim: true },
  jobType:      { type: String, required: [true, 'نوع الدوام مطلوب'], trim: true },
  salary:       { type: String, required: [true, 'الراتب مطلوب'], trim: true },
  description:  { type: String, required: [true, 'وصف الوظيفة مطلوب'], trim: true },
  tasks:        { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  benefits:     { type: [String], default: [] },
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
