type Arrayable<T> = T | T[];

type AuthorizeParams = Record<'client_id' | 'redirect_uri', string> & {
  duration: 'permanent' | 'temporary';
  response_type: 'code';
  scope: string | string[];
  state?: string;
};

type Primitive = string | boolean | number | bigint | symbol | null | undefined;

export function getAuthorizeUrl(
  { state = '', ...rest }: AuthorizeParams,
  compact: '.compact' | '' = ''
) {
  return encodeURI(
    `https://www.reddit.com/api/v1/authorize${compact}${querify(
      {
        ...rest,
        state: JSON.stringify(state),
      },
      { array: ' ' }
    )}`
  );
}

function querify(
  params: { [s: string]: any },
  {
    array = ',',
    entry = '&',
    excluded = [undefined] as Arrayable<Primitive | object>,
    pair = '=',
    prefix = '?',
  } = {}
) {
  const exclusions = arrayed(excluded);
  const mapped = new Array<string>();

  Object.entries(params).forEach(
    ([key, value]) =>
      exclusions.includes(value) ||
      mapped.push(key + pair + joined(value, array))
  );

  return mapped.length ? prefix + mapped.join(entry) : '';
}

function arrayed<T>(input: Arrayable<T>): T[] {
  return Array.isArray(input) ? input : [input];
}

function joined(input: Arrayable<string>, separator?: string) {
  return [...new Set(arrayed(input))].join(separator);
}
