export interface PaginationRequest {
  _end: string | number;
  _start: string | number;

  [key: string]: string | number;
}
