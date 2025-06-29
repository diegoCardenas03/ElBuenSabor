export class HTTPError extends Error {
  public status: number;
  public statusText: string;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HTTPError';
    this.status = status;
    this.statusText = this.getStatusText(status);
  }

  private getStatusText(status: number): string {
    const statusTexts: { [key: number]: string } = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };
    return statusTexts[status] || 'Unknown Error';
  }
}

export const createHTTPError = (status: number, message?: string): HTTPError => {
  const defaultMessages: { [key: number]: string } = {
    400: 'The request was invalid or cannot be served.',
    401: 'Authentication is required and has failed or has not yet been provided.',
    403: 'You do not have permission to access this resource.',
    404: 'The requested resource could not be found.',
    409: 'The request could not be completed due to a conflict.',
    422: 'The request was well-formed but was unable to be followed due to semantic errors.',
    500: 'An internal server error occurred.',
    502: 'Bad gateway.',
    503: 'The service is temporarily unavailable.',
  };

  const errorMessage = message || defaultMessages[status] || 'An unexpected error occurred.';
  return new HTTPError(status, errorMessage);
};