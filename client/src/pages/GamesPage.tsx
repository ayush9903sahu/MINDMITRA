import { useMemo, useState } from "react";
import { Search, Gamepad2 } from "lucide-react";
import { GameCard, DifficultySelector, EmptyState } from "../components/ui";
import type { Difficulty, GameSummary } from "../types";

const games:GameSummary[]=[
 {game:{id:"memory-match",name:"Memory Match",description:"Match related cards and strengthen recall.",category:"memory",icon:"Brain",supportedDifficulties:["easy","medium","hard"]},bestScore:null,lastPlayedAt:null,completed:false},
 {game:{id:"focus-grid",name:"Focus Grid",description:"Find target patterns while ignoring distractions.",category:"attention",icon:"Target",supportedDifficulties:["easy","medium","hard"]},bestScore:null,lastPlayedAt:null,completed:false},
 {game:{id:"sequence-recall",name:"Sequence Recall",description:"Remember and reproduce a sequence in order.",category:"processing-speed",icon:"ListOrdered",supportedDifficulties:["easy","medium"]},bestScore:null,lastPlayedAt:null,completed:false},
 {game:{id:"word-connect",name:"Word Connect",description:"Connect related words to support language skills.",category:"language",icon:"MessagesSquare",supportedDifficulties:["easy","medium","hard"]},bestScore:null,lastPlayedAt:null,completed:false},
 {game:{id:"logic-path",name:"Logic Path",description:"Work through small reasoning challenges.",category:"problem-solving",icon:"Route",supportedDifficulties:["easy","medium","hard"]},bestScore:null,lastPlayedAt:null,completed:false},
];

export function GamesPage(){
 const [query,setQuery]=useState(""); const [difficulty,setDifficulty]=useState<Difficulty>("easy");
 const filtered=useMemo(()=>games.filter(g=>`${g.game.name} ${g.game.description}`.toLowerCase().includes(query.toLowerCase()) && g.game.supportedDifficulties.includes(difficulty)),[query,difficulty]);
 return <div className="space-y-7" aria-labelledby="games-title"><header><div className="flex items-center gap-3"><div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><Gamepad2/></div><div><h1 id="games-title" className="text-3xl font-bold">Cognitive games</h1><p className="mt-1 text-slate-600">Choose a difficulty and explore available exercises.</p></div></div></header>
 <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-[1fr_auto]" aria-label="Game filters"><label className="relative block"><span className="sr-only">Search games</span><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"/><input className="min-h-touch w-full rounded-xl border-2 border-slate-200 bg-white pl-12 pr-4 text-base focus:border-brand-500" placeholder="Search games" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="min-w-[320px]"><DifficultySelector value={difficulty} onChange={setDifficulty}/></div></section>
 {filtered.length?<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map(g=><GameCard key={g.game.id} summary={g}/>)}</div>:<EmptyState title="No games found" description="Try a different search or difficulty."/>}
 </div>
}
