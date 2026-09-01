export default function ListResultToolbar({ total, label = 'results' }: { total: number; label?: string }) {
  return (
    <div className="result-toolbar" aria-live="polite">
      <strong>{total.toLocaleString()}</strong> {label}
    </div>
  );
}

