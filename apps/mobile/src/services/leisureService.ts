import api from './api';

export interface Book {
  id: string;
  title: string;
  author: string;
  imagePath: string;
  genre: string;
  releaseYear?: number;
  whereToFind?: string[];
  eduCapesLink?: string;
  pageCount?: number;
}

export interface Movie {
  id: string;
  title: string;
  director?: string;
  duration?: string;
  imagePath: string;
  genre: string;
  releaseYear?: number;
  whereToFind?: string[];
  externalLink?: string;
}

export interface Series {
  id: string;
  title: string;
  showrunner?: string;
  seasons?: number;
  episodes?: number;
  imagePath: string;
  genre: string;
  releaseYear?: number;
  whereToFind?: string[];
  externalLink?: string;
}

export interface LeisureActivity {
  id: string;
  name: string;
  description?: string;
  imagePath?: string;
  type?: string;
  frequency?: string;
}

const leisureService = {
  async getBooks(): Promise<Book[]> {
    const { data } = await api.get('/books');
    return data;
  },

  async getBook(id: string): Promise<Book> {
    const { data } = await api.get(`/books/${id}`);
    return data;
  },

  async getMovies(): Promise<Movie[]> {
    const { data } = await api.get('/movies');
    return data;
  },

  async getMovie(id: string): Promise<Movie> {
    const { data } = await api.get(`/movies/${id}`);
    return data;
  },

  async getSeries(): Promise<Series[]> {
    const { data } = await api.get('/series');
    return data;
  },

  async getSeriesById(id: string): Promise<Series> {
    const { data } = await api.get(`/series/${id}`);
    return data;
  },

  async getActivities(): Promise<LeisureActivity[]> {
    const { data } = await api.get('/leisures');
    return data;
  },

  async getActivity(id: string): Promise<LeisureActivity> {
    const { data } = await api.get(`/leisures/${id}`);
    return data;
  },
};

export default leisureService;
