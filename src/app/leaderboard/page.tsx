import { redirect } from 'next/navigation'

export default async function Leaderboard() {
  // Redirect to homepage since leaderboard is now the homepage
  redirect('/')
}