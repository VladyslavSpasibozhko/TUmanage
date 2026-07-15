import request, { Options } from "./request";

export interface IHttpInterceptor<T = unknown> {
  process: (props: T) => Promise<void>;
}

export interface IHttpConfig {
  baseUrl?: string;
  headers?: HeadersInit;
}

export interface IHttpInterceptors {
  request: IHttpInterceptor<IHttpRequest> | null;
  response: IHttpInterceptor | null;
}

interface IHttpInit {
  interceptors?: IHttpInterceptors;
  config: IHttpConfig;
}

export interface IHttpRequest extends Options {
  path: string;
  method: string;
  body?: BodyInit | null;
}

export interface IHttp {
  request: <T>(props: IHttpRequest) => ReturnType<typeof request<T>>;
}

function buildUrl(baseUrl: string | undefined, path: string): string {
  if (!baseUrl) return path;
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export function createClient({ interceptors, config }: IHttpInit): IHttp {
  const processReq = (props: IHttpRequest) => {
    if (!interceptors || !interceptors.request) {
      return Promise.resolve();
    }
    return interceptors.request.process(props);
  };

  const processRes = <T>(props: T) => {
    if (!interceptors || !interceptors.response) {
      return Promise.resolve();
    }
    return interceptors.response.process(props);
  };

  return {
    async request<T>(props: IHttpRequest) {
      await processReq(props);

      const { path, headers, ...rest } = props;
      const response = await request<T>(buildUrl(config.baseUrl, path), {
        ...rest,
        headers: { ...config.headers, ...headers },
      });

      await processRes(response);

      return response;
    },
  };
}
