import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Construction, Sparkles } from "lucide-react";
import { Card, DifficultySelector } from "../components/ui";
import { ROUTES } from "../constants";
import type { Difficulty } from "../types";
import { useState } from "react";

const names:Record<string,string>={"memory-match":"Memory Match","focus-grid":"Focus Grid","sequence-recall":"Sequence Recall","word-connect":"Word Connect","logic-path":"Logic Path"};
export function GameDetailPage(){const {gameId}=useParams(); const [difficulty,setDifficulty]=useState<Difficulty>("easy"); const name=names[gameId||""]||"Cognitive game";
 return <div className="mx-auto max-w-3xl space-y-6"><Link to={ROUTES.GAMES} className="inline-flex min-h-touch items-center gap-2 font-semibold text-brand-700"><ArrowLeft className="h-5 w-5"/>Back to games</Link><Card className="p-7 md:p-10"><div className="mx-auto flex max-w-xl flex-col items-center text-center"><div className="rounded-3xl bg-brand-50 p-5 text-brand-700"><Construction className="h-10 w-10"/></div><h1 className="mt-5 text-3xl font-bold">{name}</h1><p className="mt-3 text-lg leading-8 text-slate-600">The game screen is intentionally prepared as a placeholder. A future games module can replace this view without changing the routing architecture.</p><div className="mt-7 w-full text-left"><p className="mb-3 font-semibold">Choose difficulty</p><DifficultySelector value={difficulty} onChange={setDifficulty}/></div><div className="mt-7 flex items-center gap-2 rounded-xl bg-blue-50 p-4 text-left text-blue-900"><Sparkles className="h-5 w-5 shrink-0"/><p className="text-sm">Selected: <strong>{difficulty}</strong>. No gameplay or score tracking is implemented in these modules.</p></div></div></Card></div>}
