export function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
