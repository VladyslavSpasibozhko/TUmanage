export type InterceptFn<P> = (
  props: P,
  previous: unknown,
) => Promise<{ props: P; result: unknown }>;

export interface IInterceptor<P> {
  next: IInterceptor<P> | null;
  handle: InterceptFn<P>;
}

export class Interceptor<P> implements IInterceptor<P> {
  next = null;
  handle;

  constructor(handle: InterceptFn<P>) {
    this.handle = handle;
  }
}

export class Chain {
  #first: IInterceptor<unknown> | null = null;
  #last: IInterceptor<unknown> | null = null;

  add(interceptor: IInterceptor<unknown>): this {
    if (!this.#first) {
      this.#first = interceptor as IInterceptor<unknown>;
      this.#last = interceptor as IInterceptor<unknown>;
      return this;
    }

    this.#last!.next = interceptor as unknown as IInterceptor<unknown>;
    this.#last = interceptor as unknown as IInterceptor<unknown>;

    return this;
  }

  async process<T>(props: T): Promise<{ props: T; result: unknown }> {
    async function execute(
      interceptor: IInterceptor<T> | null,
      previous: unknown,
    ) {
      if (!interceptor) {
        return { props, result: previous };
      }

      const result = await interceptor.handle(props, previous);

      if (interceptor.next) {
        return execute(interceptor.next, result);
      }

      return { props, result };
    }

    return execute(this.#first as IInterceptor<T>, null);
  }
}
