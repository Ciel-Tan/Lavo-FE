export function Spinner({ size = 32, className = "" }: { size?: number; className?: string }) {
  const px = `${size}px`;
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-white/20 border-t-white ${className}`}
      style={{ width: px, height: px }}
      aria-label="Đang tải"
      role="status"
    />
  );
}

export function LoadingOverlay({ show, text = "Đang tải dữ liệu..." }: { show: boolean; text?: string }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
        <Spinner size={28} />
        <div className="text-sm text-gray-200">{text}</div>
      </div>
    </div>
  );
}


