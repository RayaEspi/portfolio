export interface PortfolioItem {
  title: string;
  image: string;
  downloadUrl: string;
}

export interface PortfolioSection {
  id: string;
  title: string;
  description: string;
  items: PortfolioItem[];
}
