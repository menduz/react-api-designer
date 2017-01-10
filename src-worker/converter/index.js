import converter from "oas-raml-converter";

const stringify = (data) => {
  if (!data) return ''
  if (typeof data === 'string') return data
  const result = JSON.stringify(data, null, 2);
  return result === '{}' ? '' : result;
}

export default (path, from, to, format) => {
  return new Promise((resolve, reject) => {
    const from = converter.Formats[from];
    const to = converter.Formats[to];

    converter.Converter(from, to).converFile(path, {format})
      .then(result => { resolve(stringify(result)) })
      .catch(error => { reject(stringify(error)) })
  })
}
