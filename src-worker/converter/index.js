import converter from "oas-raml-converter";

const stringify = (data) => {
  if (!data) return ''
  if (typeof data === 'string') return data
  const result = JSON.stringify(data, null, 2);
  return result === '{}' ? '' : result;
}

export default (text, from, to, options) => {
  return new Promise((resolve, reject) => {
    const fromFormat = converter.Formats[from];
    const toFormat = converter.Formats[to];

    new converter.Converter(fromFormat, toFormat).convertData(text, options)
      .then(result => { resolve(stringify(result)) })
      .catch(error => { reject(error) })
  })
}
