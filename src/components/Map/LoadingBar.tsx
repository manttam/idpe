export function LoadingBar({ isLoading }: { isLoading: boolean }) {
  return (
    <div
      className={`absolute top-0 left-0 h-[3px] bg-sky-400 z-[1001] transition-[width] duration-300
        ${isLoading ? 'w-[70%] animate-pulse' : 'w-0'}`}
    />
  )
}
