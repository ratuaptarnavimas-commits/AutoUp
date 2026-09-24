export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function sendError(response, error) {
  const statusCode = error.statusCode || 500;
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: statusCode === 500 ? "Internal server error" : error.message }));
}
