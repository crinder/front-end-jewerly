
import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Message = ({ type = 'info', title, message, onClose, duration = 5000 }) => {

    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev - (100 / (duration / 10));
                return next > 0 ? next : 0; 
            });
        }, 10);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [duration, onClose]);

    const variants = {
        success: { container: 'bg-emerald-50/90 border-emerald-200 text-emerald-800', icon: <CheckCircle className="text-emerald-500" size={20} />, accent: 'bg-emerald-500' },
        error: { container: 'bg-rose-50/90 border-rose-200 text-rose-800', icon: <AlertCircle className="text-rose-500" size={20} />, accent: 'bg-rose-500' },
        warning: { container: 'bg-amber-50/90 border-amber-200 text-amber-800', icon: <AlertTriangle className="text-amber-500" size={20} />, accent: 'bg-amber-500' },
        info: { container: 'bg-blue-50/90 border-blue-200 text-blue-800', icon: <Info className="text-blue-500" size={20} />, accent: 'bg-blue-500' }
    };

    const style = variants[type] || variants.info;

    return (
        <div className={`relative overflow-hidden flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-sm shadow-lg transition-all duration-300 sm:max-w-md w-full animate-in fade-in slide-in-from-top-4 ${style.container}`}>

            {/* Acento Lateral */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.accent}`} />

            {/* BARRA DE PROGRESO (La que da el feedback visual de los 5s) */}
            <div
                className={`absolute bottom-0 left-0 h-1 ${style.accent} opacity-30 transition-all ease-linear`}
                style={{ width: `${progress}%` }}
            />

            <div className="flex-shrink-0 mt-0.5">{style.icon}</div>

            <div className="flex-1 flex flex-col gap-1">
                {title && <h4 className="font-bold text-sm sm:text-base leading-tight">{title}</h4>}
                <p className="text-sm opacity-90 leading-relaxed">{message}</p>
            </div>

            {onClose && (
                <button onClick={onClose} className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors">
                    <X size={18} className="opacity-50 hover:opacity-100" />
                </button>
            )}
        </div>
    );
};

export default Message;