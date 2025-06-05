export default function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <span className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></span>
      <span className="ml-2 text-primary">Loading...</span>
    </div>
  );
}
