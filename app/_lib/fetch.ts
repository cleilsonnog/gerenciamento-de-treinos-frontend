import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getBody = <T>(c: Response | Request): Promise<T> => {
  return c.json() as Promise<T>;
};

const getUrl = (contextUrl: string): string => {
  const newUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}${contextUrl}`);
  const requestUrl = new URL(`${newUrl}`);
  return requestUrl.toString();
};

const getHeaders = async (headers?: HeadersInit): Promise<HeadersInit> => {
  const _cookies = await cookies();
  return {
    ...headers,
    cookie: _cookies.toString(),
  };
};

interface BannedResponse {
  error: string;
  code: string;
  banReason: string | null;
  banExpires: string | null;
}

const isBannedResponse = (
  status: number,
  data: unknown
): data is BannedResponse => {
  return (
    status === 403 &&
    typeof data === "object" &&
    data !== null &&
    "code" in data &&
    (data as BannedResponse).code === "USER_BANNED"
  );
};

export const customFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const requestUrl = getUrl(url);
  const requestHeaders = await getHeaders(options.headers);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: "include",
  };

  const response = await fetch(requestUrl, requestInit);
  const data = await getBody<T>(response);

  if (isBannedResponse(response.status, data)) {
    const params = new URLSearchParams();
    if (data.banReason) params.set("reason", data.banReason);
    if (data.banExpires) params.set("expires", data.banExpires);
    redirect(`/banned?${params.toString()}`);
  }

  return { status: response.status, data, headers: response.headers } as T;
};