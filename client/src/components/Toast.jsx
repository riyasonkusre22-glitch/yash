import { CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Toast() {
  const { toast } = useToast();
  if (!toast.visible) return null;
  return (
    <div className="toast">
      <CheckCircle size={20} color="#34d399" />
      <span>{toast.message}</span>
    </div>
  );
}
