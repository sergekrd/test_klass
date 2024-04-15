export class CustomError extends Error {
  public status_code: number;
  public status: string;
  public json_stack: string[];
  public data: any

  constructor(status_code: number, message: any, data?: any) {
    super();
    this.status_code = status_code;
    this.status = "error";
    this.message = message;
    const stackLines = this.stack?.split('\n').map(line => line.trim());
    if (stackLines && stackLines.length > 0) {
      stackLines[0] = `Error: ${JSON.stringify(this.message)}`;
    }
    this.json_stack = stackLines;
    this.data = data;
  }
}
