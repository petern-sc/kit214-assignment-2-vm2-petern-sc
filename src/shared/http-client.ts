export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  async query<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "QUERY",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const baseUrl = this.baseUrl.replace(/\/+$/, "");
    const resourcePath = path.replace(/^\/+/, "");
    const response = await fetch(`${baseUrl}/${resourcePath}`, init);

    if (!response.ok) {
      throw new Error(`HTTP request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  }
}
