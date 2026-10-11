export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  async getOptional<T>(path: string): Promise<T | null> {
    const response = await fetch(this.url(path), { method: "GET" });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`HTTP request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  }

  async query<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "QUERY",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(this.url(path), init);

    if (!response.ok) {
      throw new Error(`HTTP request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
