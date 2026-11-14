export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly name: string;
  readonly message: string;
  readonly details ?:unknown;

  constructor(statusCode :number ,code:string , message:string ,details?:unknown ){
    super(message);
    this.name =new.target.name ;
    this.statusCode =statusCode ;
    this.code =code ;
    this.message =message ;
    this.details= details ;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
