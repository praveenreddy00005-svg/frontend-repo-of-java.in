import { Trash2 } from 'lucide-react';

const TASK_STATUSES = ['Completed', 'In Progress', 'Not Started'];

export default function TaskBlock({ task, index, onChange, onRemove, canRemove }) {
  const update = (field, value) => {
    onChange(index, { ...task, [field]: value });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Task {index + 1}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Task Title *</label>
          <input
            className="input-field"
            value={task.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. E-commerce Dashboard"
            required
          />
        </div>
        <div>
          <label className="label">GitHub Repository Link</label>
          <input
            className="input-field"
            type="url"
            value={task.githubLink}
            onChange={(e) => update('githubLink', e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <label className="label">Live Demo Link</label>
          <input
            className="input-field"
            type="url"
            value={task.liveDemoLink}
            onChange={(e) => update('liveDemoLink', e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="label">LinkedIn Post Link</label>
          <input
            className="input-field"
            type="url"
            value={task.linkedinPostLink}
            onChange={(e) => update('linkedinPostLink', e.target.value)}
            placeholder="https://linkedin.com/..."
          />
        </div>
        <div>
          <label className="label">Task Status</label>
          <select
            className="input-field"
            value={task.status}
            onChange={(e) => update('status', e.target.value)}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Task Description</label>
          <textarea
            className="input-field min-h-[100px] resize-y"
            value={task.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Briefly describe what you built..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
