export interface Stat {
  keyword: string;
  searchVolume: number;
  author: string;
  link: string;
  image: string;
}

export interface Question {
  options: Stat[];
  answer: number;
}
