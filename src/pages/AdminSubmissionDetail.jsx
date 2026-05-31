import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { fileUrl, getSubmission, updateSubmissionStatus } from '../services/api';

const statusOptions = ['Pending', 'Approved', 'Rejected'];

export default function AdminSubmissionDetail() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getSubmission(id)
      .then((res) => setSubmission(res.data.data))
      .catch(() => toast.error('Failed to load submission'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (reviewStatus) => {
    setUpdating(true);
    try {
      const res = await updateSubmissionStatus(id, reviewStatus);
      setSubmission(res.data.data);
      toast.success(`Marked as ${reviewStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!submission) {
    return <p className="text-center text-slate-500">Submission not found</p>;
  }

  const LinkRow = ({ label, url }) =>
    url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-brand-600 hover:underline"
      >
        {label} <ExternalLink className="h-3.5 w-3.5" />
      </a>
    ) : (
      <span className="text-slate-400">—</span>
    );

  const FileCard = ({ file, label }) => {
    const url = fileUrl(file);
    if (!url) return null;
    const isImage = file.mimetype?.startsWith('image/');
    return (
      <div className="rounded-xl border border-slate-200 p-4">
        <p className="mb-2 text-sm font-medium text-slate-700">{label}</p>
        <p className="mb-3 truncate text-xs text-slate-500">{file.originalName}</p>
        {isImage && (
          <img src={url} alt={label} className="mb-3 max-h-48 rounded-lg border object-contain" />
        )}
        <a href={url} download className="btn-secondary text-sm">
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-sm text-brand-600">{submission.submissionId}</p>
            <h1 className="text-2xl font-bold text-slate-900">{submission.fullName}</h1>
            <p className="text-slate-500">{submission.email} · {submission.phone}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                type="button"
                disabled={updating || submission.reviewStatus === s}
                onClick={() => handleStatusChange(s)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  submission.reviewStatus === s
                    ? 'bg-brand-600 text-white'
                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="section-title">Personal & Internship</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">College</dt>
              <dd className="text-right font-medium">{submission.collegeName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Branch / Year</dt>
              <dd className="text-right font-medium">
                {submission.branch} · {submission.year}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Domain</dt>
              <dd className="text-right font-medium">{submission.internshipDomain}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Company</dt>
              <dd className="text-right font-medium">{submission.companyName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Duration</dt>
              <dd className="text-right font-medium">{submission.duration}</dd>
            </div>
          </dl>
          <h3 className="mt-6 mb-2 font-semibold">Profiles</h3>
          <div className="space-y-1 text-sm">
            <p>
              LinkedIn: <LinkRow label="Open" url={submission.linkedinProfile} />
            </p>
            <p>
              GitHub: <LinkRow label="Open" url={submission.githubProfile} />
            </p>
            <p>
              Portfolio: <LinkRow label="Open" url={submission.portfolioLink} />
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Uploaded Files
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FileCard file={submission.resume} label="Resume" />
            <FileCard file={submission.paymentScreenshot} label="Payment Screenshot" />
            {submission.taskScreenshots?.map((f, i) => (
              <FileCard key={i} file={f} label={`Screenshot ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Tasks ({submission.tasks?.length || 0})
        </h2>
        <div className="mt-4 space-y-4">
          {submission.tasks?.map((task, i) => (
            <div key={task._id || i} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{task.title}</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium">
                  {task.status}
                </span>
              </div>
              {task.description && (
                <p className="mb-3 text-sm text-slate-600">{task.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                {task.githubLink && (
                  <a
                    href={task.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {task.liveDemoLink && (
                  <a
                    href={task.liveDemoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    Live Demo
                  </a>
                )}
                {task.linkedinPostLink && (
                  <a
                    href={task.linkedinPostLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    LinkedIn Post
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
