export interface ILeisureStrategy {
  type: string;
  create(data: any): Promise<any>;
}