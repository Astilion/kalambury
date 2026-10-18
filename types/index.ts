export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Phrase {
  id: number;
  text: string;
  category: string;
}
