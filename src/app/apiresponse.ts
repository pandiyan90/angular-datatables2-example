export class ApiResponse {
  total: number;
  result: any;

  constructor(
    total: number,
    result: any
  ) {
    this.total = total;
    this.result = result;
  }
}
