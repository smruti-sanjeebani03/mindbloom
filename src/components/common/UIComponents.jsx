import React from "react";
import { motion } from "motion/react";
import { X, CheckCircle, Info, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
export const ToastContainer = () => {
  const { toasts, removeToast } = useAuth();
  return <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => <motion.div
    key={toast.id}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.9 }}
    className="pointer-events-auto bg-[#FFFBF7] border border-[#E6DCCD] shadow-xl rounded-xl p-4 flex items-start gap-3 text-[#4A3B32]"
  >
          {toast.type === "success" && <CheckCircle className="w-5 h-5 text-[#889868] shrink-0 mt-0.5" />}
          {toast.type === "info" && <Info className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />}
          {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-[#3B281C]">{toast.title}</h4>
            {toast.message && <p className="text-xs text-[#705D52] mt-0.5 line-clamp-2">{toast.message}</p>}
          </div>
          <button
    onClick={() => removeToast(toast.id)}
    className="text-[#A08370] hover:text-[#3B281C] p-1 rounded-lg transition"
  >
            <X className="w-4 h-4" />
          </button>
        </motion.div>)}
    </div>;
};
export const CozyBadge = ({ children, variant = "latte", className = "" }) => {
  const styles = {
    brown: "bg-[#5C3D2E] text-[#FFFBF7]",
    sage: "bg-[#EAEFE6] text-[#4F5D3D] border border-[#D2DEC8]",
    autumn: "bg-[#FBEBE6] text-[#B8543B] border border-[#F4CFC5]",
    latte: "bg-[#F5EFE6] text-[#705D52] border border-[#E8DDD0]",
    gold: "bg-[#FAF2E6] text-[#9E6D38] border border-[#F0DCBE]"
  };
  return <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition ${styles[variant]} ${className}`}
  >
      {children}
    </span>;
};
export const CozyModal = ({ isOpen, onClose, title, subtitle, children }) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B281C]/40 backdrop-blur-xs">
      <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 10 }}
    className="bg-[#FFFBF7] border border-[#E6DCCD] rounded-2xl shadow-2xl max-w-lg w-full p-6 relative overflow-hidden"
  >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EFE6DC]">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#3B281C]">{title}</h3>
            {subtitle && <p className="text-xs text-[#705D52] mt-0.5">{subtitle}</p>}
          </div>
          <button
    onClick={onClose}
    className="p-1.5 text-[#A08370] hover:text-[#3B281C] hover:bg-[#F5EFE6] rounded-xl transition"
  >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto pr-1">{children}</div>
      </motion.div>
    </div>;
};
export const SkeletonLoader = ({ className = "h-12 w-full" }) => <div className={`animate-pulse bg-[#F5EFE6] rounded-xl border border-[#E8DDD0] ${className}`} />;
export const EmptyState = ({ title, description, actionText, onAction, icon }) => <div className="flex flex-col items-center justify-center text-center p-8 bg-[#FFFBF7] border border-[#EFE6DC] rounded-2xl my-4">
    <div className="w-14 h-14 rounded-full bg-[#F5EFE6] text-[#8B5E3C] flex items-center justify-center mb-3">
      {icon || <Sparkles className="w-7 h-7" />}
    </div>
    <h3 className="font-serif text-lg font-bold text-[#3B281C] mb-1">{title}</h3>
    <p className="text-sm text-[#705D52] max-w-sm mb-4">{description}</p>
    {actionText && onAction && <button onClick={onAction} className="cozy-btn-primary text-sm flex items-center gap-1.5">
        {actionText}
      </button>}
  </div>;
export const Breadcrumbs = ({ items }) => <nav className="flex items-center text-xs text-[#8C7667] space-x-1.5 mb-4">
    {items.map((item, idx) => <React.Fragment key={idx}>
        {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#C4B09B]" />}
        {item.href ? <a href={item.href} className="hover:text-[#3B281C] transition font-medium">
            {item.label}
          </a> : <span className="text-[#3B281C] font-semibold">{item.label}</span>}
      </React.Fragment>)}
  </nav>;
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return <div className="flex items-center justify-center gap-2 mt-6">
      <button
    disabled={currentPage === 1}
    onClick={() => onPageChange(currentPage - 1)}
    className="px-3 py-1.5 text-xs rounded-lg border border-[#E6DCCD] bg-[#FFFBF7] text-[#5C3D2E] disabled:opacity-40 hover:bg-[#F5EFE6] transition"
  >
        Previous
      </button>
      {Array.from({ length: totalPages }).map((_, i) => {
    const p = i + 1;
    return <button
      key={p}
      onClick={() => onPageChange(p)}
      className={`w-8 h-8 text-xs rounded-lg font-medium transition ${currentPage === p ? "bg-[#5C3D2E] text-[#FFFBF7]" : "bg-[#FFFBF7] border border-[#E6DCCD] text-[#5C3D2E] hover:bg-[#F5EFE6]"}`}
    >
            {p}
          </button>;
  })}
      <button
    disabled={currentPage === totalPages}
    onClick={() => onPageChange(currentPage + 1)}
    className="px-3 py-1.5 text-xs rounded-lg border border-[#E6DCCD] bg-[#FFFBF7] text-[#5C3D2E] disabled:opacity-40 hover:bg-[#F5EFE6] transition"
  >
        Next
      </button>
    </div>;
};
