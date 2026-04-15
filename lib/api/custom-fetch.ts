const getBody = <T>(c: Response): Promise<T> => {
  return c.json() as Promise<T>;
};

const getUrl = (contextUrl: string): string => {
  const newUrl = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}${contextUrl}`
  );
  return newUrl.toString();
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

const redirectToBanned = (data: BannedResponse): void => {
  const params = new URLSearchParams();
  if (data.banReason) params.set("reason", data.banReason);
  if (data.banExpires) params.set("expires", data.banExpires);
  window.location.href = `/banned?${params.toString()}`;
};

export const customFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const requestUrl = getUrl(url);

  const requestInit: RequestInit = {
    ...options,
    credentials: "include",
  };

  const response = await fetch(requestUrl, requestInit);
  const data = await getBody<T>(response);

  if (isBannedResponse(response.status, data)) {
    redirectToBanned(data);
    throw new Error("USER_BANNED");
  }

  const result = { status: response.status, data, headers: response.headers } as T;

  if (!response.ok) {
    throw result;
  }

  return result;
};

export default customFetch;
