import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface WarningDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'warning' | 'danger';
}

const WarningDialog = ({
  isOpen,
  title,
  message,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'warning',
}: WarningDialogProps) => {
  const gradientClass = variant === 'danger' 
    ? 'from-red-500 to-rose-600' 
    : 'from-yellow-500 to-orange-500';
  
  const borderColor = variant === 'danger' ? '#ef4444' : 'hsl(var(--quiz-brand))';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative bg-background rounded-3xl shadow-2xl overflow-hidden max-w-md w-full"
            style={{ border: `3px solid ${borderColor}` }}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className={`bg-gradient-to-r ${gradientClass} text-white p-6 text-center`}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <AlertTriangle className="w-16 h-16 mx-auto mb-2" />
              </motion.div>
              <h3 className="text-2xl font-black">{title}</h3>
            </div>

            <div className="p-6">
              <p className="text-foreground text-center mb-2 text-lg font-semibold">
                {message}
              </p>
              <p className="text-muted-foreground text-center mb-6 text-sm">
                {description}
              </p>

              <div className="flex gap-3">
                <motion.button
                  onClick={onConfirm}
                  className={`flex-1 py-3 rounded-xl font-bold bg-gradient-to-r ${gradientClass} text-white shadow-lg hover:shadow-xl transition-shadow`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {confirmLabel}
                </motion.button>
                <motion.button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cancelLabel}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WarningDialog;
