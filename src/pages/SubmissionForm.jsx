import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Briefcase,
  CheckCircle2,
  CreditCard,
  FileUp,
  Link2,
  ListChecks,
  Plus,
  Send,
  User,
} from 'lucide-react';
import FormSection from '../components/FormSection';
import TaskBlock from '../components/TaskBlock';
import { getPaymentInfo, submitForm } from '../services/api';

const emptyTask = () => ({
  title: '',
  githubLink: '',
  liveDemoLink: '',
  linkedinPostLink: '',
  description: '',
  status: 'Completed',
});

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Graduate'];

 const DOMAINS = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Java Development',
  'Python Development',
  'MERN Stack Development',
  'Web Development',
  'Mobile App Development',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Deep Learning',
  'Cyber Security',
  'Ethical Hacking',
  'Cloud Computing',
  'AWS Cloud',
  'Microsoft Azure',
  'Google Cloud Platform (GCP)',
  'DevOps',
  'UI/UX Design',
  'Software Testing',
  'Automation Testing',
  'Database Administration',
  'SQL Development',
  'Blockchain Development',
  'Game Development',
  'Computer Vision',
  'Natural Language Processing (NLP)',
  'Data Engineering',
  'Big Data Engineering',
  'Internet of Things (IoT)',
  'Robotics',
  'Embedded Systems',
  'System Design',
  'Technical Support',
  'IT Operations',
  'c language Development',
  'C++ Development',
  'Go Development',
  'Ruby Development',
  'PHP Development',
];

export default function SubmissionForm() {
  const [payment, setPayment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    branch: '',
    year: '',
    internshipDomain: '',
    companyName: '',
    duration: '',
    linkedinProfile: '',
    githubProfile: '',
    portfolioLink: '',
  });

  const [tasks, setTasks] = useState([emptyTask()]);
  const [resume, setResume] = useState(null);
  const [taskScreenshots, setTaskScreenshots] = useState([]);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  useEffect(() => {
    getPaymentInfo()
      .then((res) => setPayment(res.data.data))
      .catch(() => toast.error('Could not load payment info'));
  }, []);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleTaskChange = (index, task) => {
    setTasks((t) => t.map((item, i) => (i === index ? task : item)));
  };

  const addTask = () => setTasks((t) => [...t, emptyTask()]);
  const removeTask = (index) => setTasks((t) => t.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error('Please upload your resume (PDF)');
    if (!paymentScreenshot) return toast.error('Please upload payment screenshot');

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('tasks', JSON.stringify(tasks));
    fd.append('resume', resume);
    fd.append('paymentScreenshot', paymentScreenshot);
    taskScreenshots.forEach((f) => fd.append('taskScreenshots', f));

    setSubmitting(true);
    try {
      const res = await submitForm(fd);
      setSuccess(res.data);
      toast.success('Submission successful!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg py-16 text-center"
      >
        <div className="card">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Submission Received!</h1>
          <p className="mb-6 text-slate-600">
            Thank you, <strong>{success.data?.fullName}</strong>. Your internship details have been
            submitted successfully.
          </p>
          <div className="rounded-xl bg-brand-50 px-6 py-4">
            <p className="text-sm text-slate-600">Your Submission ID</p>
            <p className="text-2xl font-bold tracking-wide text-brand-700">{success.submissionId}</p>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Save this ID for your records. You cannot edit your submission after submitting.
          </p>
        </div>
      </motion.div>
    );
  }

  const qrSrc = payment?.phonepeQrUrl?.startsWith('http')
    ? payment.phonepeQrUrl
    : payment?.phonepeQrUrl
      ? `${import.meta.env.VITE_API_URL || ''}${payment.phonepeQrUrl}`
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection
        title="Personal Details"
        description="Tell us about yourself"
        icon={User}
        delay={0}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Full Name *</label>
            <input
              className="input-field"
              value={form.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              className="input-field"
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Phone Number *</label>
            <input
              className="input-field"
              type="tel"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">College Name *</label>
            <input
              className="input-field"
              value={form.collegeName}
              onChange={(e) => setField('collegeName', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Branch *</label>
            <input
              className="input-field"
              value={form.branch}
              onChange={(e) => setField('branch', e.target.value)}
              placeholder="e.g. CSE"
              required
            />
          </div>
          <div>
            <label className="label">Year *</label>
            <select
              className="input-field"
              value={form.year}
              onChange={(e) => setField('year', e.target.value)}
              required
            >
              <option value="">Select year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Internship Details"
        description="Information about your internship"
        icon={Briefcase}
        delay={0.05}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Internship Domain *</label>
            <select
              className="input-field"
              value={form.internshipDomain}
              onChange={(e) => setField('internshipDomain', e.target.value)}
              required
            >
              <option value="">Select domain</option>
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Company Name *</label>
            <input
              className="input-field"
              value={form.companyName}
              onChange={(e) => setField('companyName', e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Internship Duration *</label>
            <input
              className="input-field"
              value={form.duration}
              onChange={(e) => setField('duration', e.target.value)}
              placeholder="e.g. 1 month, 3 months"
              required
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Task Submissions"
        description="Add all internship tasks you completed"
        icon={ListChecks}
        delay={0.1}
      >
        <div className="space-y-4">
          {tasks.map((task, i) => (
            <TaskBlock
              key={i}
              task={task}
              index={i}
              onChange={handleTaskChange}
              onRemove={removeTask}
              canRemove={tasks.length > 1}
            />
          ))}
          <button type="button" onClick={addTask} className="btn-secondary w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Another Task
          </button>
        </div>
      </FormSection>

      <FormSection
        title="Social & Profile Links"
        description="Optional but recommended"
        icon={Link2}
        delay={0.15}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">LinkedIn Profile</label>
            <input
              className="input-field"
              type="url"
              value={form.linkedinProfile}
              onChange={(e) => setField('linkedinProfile', e.target.value)}
            />
          </div>
          <div>
            <label className="label">GitHub Profile</label>
            <input
              className="input-field"
              type="url"
              value={form.githubProfile}
              onChange={(e) => setField('githubProfile', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Portfolio Link</label>
            <input
              className="input-field"
              type="url"
              value={form.portfolioLink}
              onChange={(e) => setField('portfolioLink', e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="File Uploads"
        description="PDF, JPG, PNG, JPEG — max 5MB each"
        icon={FileUp}
        delay={0.2}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Resume (PDF) *</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="input-field file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-brand-700"
              onChange={(e) => setResume(e.target.files[0] || null)}
              required
            />
          </div>
          <div>
            <label className="label">Payment Screenshot *</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="input-field file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-brand-700"
              onChange={(e) => setPaymentScreenshot(e.target.files[0] || null)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Task Screenshots (multiple allowed)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              multiple
              className="input-field file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-brand-700"
              onChange={(e) => setTaskScreenshots(Array.from(e.target.files || []))}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Payment"
        description="Complete payment before submitting"
        icon={CreditCard}
        delay={0.25}
      >
        {payment && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Owner Name</p>
              <p className="text-lg font-semibold">{payment.ownerName}</p>
              <p className="mt-4 text-sm text-slate-500">UPI ID</p>
              <p className="font-mono text-lg font-semibold text-brand-700">{payment.upiId}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{payment.instructions}</p>
            </div>
            {qrSrc && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 p-4">
                <p className="mb-3 text-sm font-medium text-slate-600">PhonePe QR Code</p>
                
                <img
                  src="/payment-qr.jpeg"
                  alt="PhonePe QR"
                  className="max-h-56 rounded-lg border border-slate-200 object-contain"
                />
              </div>
            )}
          </div>
        )}
      </FormSection>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end pb-8"
      >
        <button type="submit" disabled={submitting} className="btn-primary min-w-[200px]">
          {submitting ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Application
            </>
          )}
        </button>
      </motion.div>
    </form>
  );
}
