


export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    next: string | null;
    prev: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
  };
}



export interface Brand {
  name: string;
  slug: string;
  logo: string;
  show_on_website: boolean;
}

export type PaginatedBrands = PaginatedResponse<Brand>;