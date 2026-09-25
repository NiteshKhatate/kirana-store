export function ErrorState({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  return <div className="rounded-card border border-danger-700/20 bg-danger-50 p-4 text-sm text-danger-700" role="alert"><p>{message}</p>{onRetry && <button type="button" className="mt-2 font-semibold underline" onClick={onRetry}>Try again</button>}</div>;
}
