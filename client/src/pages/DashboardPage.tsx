import { Link } from "react-router-dom";
import { Brain, ArrowRight, Sparkles, Trophy, Clock3, Target, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants";
import { Card, GameCard, ProgressBar } from "../components/ui";
import type { GameSummary } from "../types";

const featuredGames: GameSummary[] = [
  { game:{id:"memory-match",name:"Memory Match",description:"Train recall by matching related cards.",category:"memory",icon:"Brain",supportedDifficulties:["easy","medium","hard"]},bestScore:null,lastPlayedAt:null,completed:false },
  { game:{id:"focus-grid",name:"Focus Grid",description:"Improve attention by finding patterns quickly.",category:"attention",icon:"Target",supportedDifficulties:["easy","medium","hard"]},bestScore:null,lastPlayedAt:null,completed:false },
  { game:{id:"sequence-recall",name:"Sequence Recall",description:"Remember and reproduce short sequences.",category:"processing-speed",icon:"ListOrdered",supportedDifficulties:["easy","medium"]},bestScore:null,lastPlayedAt:null,completed:false },
];

export default function DashboardPage(){
 const {user}=useAuth();
 const firstName=user?.email?.split("@")[0] || "there";
 return <div className="space-y-8" aria-labelledby="dashboard-title">
   <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-600 p-7 text-white shadow-sm md:p-10">
     <div className="max-w-3xl">
       <div className="mb-4 flex items-center gap-2 text-blue-100"><Sparkles className="h-5 w-5"/><span className="font-medium">Your cognitive wellness space</span></div>
       <h1 id="dashboard-title" className="text-3xl font-bold tracking-tight md:text-4xl">Welcome back, {firstName}.</h1>
       <p className="mt-3 max-w-2xl text-lg leading-8 text-blue-50">Take a few minutes to exercise memory, attention, and problem-solving skills at your own pace.</p>
       <div className="mt-7 flex flex-wrap gap-3"><Link to={ROUTES.GAMES} className="inline-flex min-h-touch items-center gap-2 rounded-xl bg-white px-5 font-semibold text-brand-700 hover:bg-blue-50">Explore games <ArrowRight className="h-5 w-5"/></Link><Link to={ROUTES.PROFILE} className="inline-flex min-h-touch items-center gap-2 rounded-xl border border-white/40 px-5 font-semibold text-white hover:bg-white/10"><UserRound className="h-5 w-5"/>Complete profile</Link></div>
     </div>
   </section>
   <section aria-label="Progress overview" className="grid gap-4 sm:grid-cols-3">
    <Card><div className="flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sessions</p><p className="mt-2 text-3xl font-bold">0</p></div><div className="rounded-2xl bg-blue-50 p-3 text-brand-600"><Trophy/></div></div></Card>
    <Card><div className="flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Accuracy</p><p className="mt-2 text-3xl font-bold">—</p></div><div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600"><Target/></div></div></Card>
    <Card><div className="flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Time this week</p><p className="mt-2 text-3xl font-bold">0 min</p></div><div className="rounded-2xl bg-amber-50 p-3 text-amber-600"><Clock3/></div></div></Card>
   </section>
   <section className="space-y-4"><div className="flex items-end justify-between gap-4"><div><h2 className="text-2xl font-bold">Start a session</h2><p className="mt-1 text-slate-600">Game cards are ready for the games module to connect later.</p></div><Link to={ROUTES.GAMES} className="hidden font-semibold text-brand-700 sm:block">View all games →</Link></div><div className="grid gap-5 md:grid-cols-3">{featuredGames.map(g=><GameCard key={g.game.id} summary={g}/>)}</div></section>
   <Card><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div className="flex-1"><h2 className="text-xl font-bold">Weekly consistency</h2><p className="mt-1 text-slate-600">Your activity will appear here once real game sessions are implemented.</p><div className="mt-4"><ProgressBar value={0} label="Weekly activity"/></div></div><Link to={ROUTES.PROGRESS} className="inline-flex min-h-touch items-center justify-center rounded-xl border-2 border-slate-200 px-5 font-semibold hover:bg-slate-50">View progress</Link></div></Card>
 </div>
}
