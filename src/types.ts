export interface Poem {
  id: number;
  text: string;
  author?: string;
}

export interface UserConfig {
  [token: string]: string;
}
