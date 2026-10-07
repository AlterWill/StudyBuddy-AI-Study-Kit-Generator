import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Welcome to the Student Dashboard
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Your activity tracking dashboard. Here you can upload activity submissions for verification.
        </p>
        
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <div className="flex-1 rounded-full bg-zinc-200 px-5 py-3 text-center sm:px-8">
            <div className="text-2xl font-bold text-zinc-900">My Activities</div>
            <div className="text-zinc-500">Track and submit activities</div>
          </div>
          <div className="flex-1 rounded-full bg-zinc-200 px-5 py-3 text-center sm:px-8">
            <div className="text-2xl font-bold text-zinc-900">Points</div>
            <div className="text-zinc-500">View earned points</div>
          </div>
        </div>
      </main>
    </div>
  )
}