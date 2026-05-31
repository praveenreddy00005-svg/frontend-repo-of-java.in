import { motion } from 'framer-motion';

export default function FormSection({ title, description, icon: Icon, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card"
    >
      <div className="mb-5 flex items-start gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h2 className="section-title">{title}</h2>
          {description && <p className="section-desc !mb-0">{description}</p>}
        </div>
      </div>
      {children}
    </motion.section>
  );
}
