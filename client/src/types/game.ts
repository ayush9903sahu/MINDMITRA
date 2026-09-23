export type Difficulty="easy"|"medium"|"hard";
export type GameCategory="memory"|"attention"|"problem-solving"|"language"|"processing-speed";
export interface GameConfig { id:string; name:string; description:string; category:GameCategory; icon:string; supportedDifficulties:Difficulty[]; }
export interface GameSummary { game:GameConfig; bestScore:number|null; lastPlayedAt:string|null; completed:boolean; }
