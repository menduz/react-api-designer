const configurations = () => {
  return {
    comments: {lineComment: "#"},
    brackets: [["{", "}"], ["[", "]"]],
    autoClosingPairs: [{open: '"', close: '"', notIn: ["string", "comment"]}, {
      open: "'",
      close: "'",
      notIn: ["string", "comment"]
    }, {open: "{", close: "}", notIn: ["string", "comment"]}, {open: "[", close: "]", notIn: ["string", "comment"]}]
  }
}

const tokens = () => {
  return {
    tokenPostfix: ".raml",
    brackets: [{token: "delimiter.bracket", open: "{", close: "}"}, {
      token: "delimiter.square",
      open: "[",
      close: "]"
    }],
    keywords: ["true", "True", "TRUE", "false", "False", "FALSE", "null", "Null", "Null", "~"],
    numberInteger: /(?:0|[+-]?[0-9]+)/,
    numberFloat: /(?:0|[+-]?[0-9]+)(?:\.[0-9]+)?(?:e[-+][1-9][0-9]*)?/,
    numberOctal: /0o[0-7]+/,
    numberHex: /0x[0-9a-fA-F]+/,
    numberInfinity: /[+-]?\.(?:inf|Inf|INF)/,
    numberNaN: /\.(?:nan|Nan|NAN)/,
    numberDate: /\d{4}-\d\d-\d\d([Tt ]\d\d:\d\d:\d\d(\.\d+)?(( ?[+-]\d\d?(:\d\d)?)|Z)?)?/,
    escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
    tokenizer: {
      root: [{include: "@whitespace"}, {include: "@comment"}, [/%[^ ]+.*$/, "meta.directive"], [/---/, "operators.directivesEnd"], [/\.{3}/, "operators.documentEnd"], [/[-?:](?= )/, "operators"], {include: "@anchor"}, {include: "@tagHandle"}, {include: "@flowCollections"}, {include: "@blockStyle"}, [/@numberInteger(?![ \t]*\S+)/, "number"], [/@numberFloat(?![ \t]*\S+)/, "number.float"], [/@numberOctal(?![ \t]*\S+)/, "number.octal"], [/@numberHex(?![ \t]*\S+)/, "number.hex"], [/@numberInfinity(?![ \t]*\S+)/, "number.infinity"], [/@numberNaN(?![ \t]*\S+)/, "number.nan"], [/@numberDate(?![ \t]*\S+)/, "number.date"], [/(".*?"|'.*?'|.*?)([ \t]*)(:)( |$)/, ["type", "white", "operators", "white"]], {include: "@flowScalars"}, [/.+$/, {
        cases: {
          "@keywords": "keyword",
          "@default": "string"
        }
      }]],
      object: [{include: "@whitespace"}, {include: "@comment"}, [/\}/, "@brackets", "@pop"], [/,/, "delimiter.comma"], [/:(?= )/, "operators"], [/(?:".*?"|'.*?'|[^,\{\[]+?)(?=: )/, "type"], {include: "@flowCollections"}, {include: "@flowScalars"}, {include: "@tagHandle"}, {include: "@anchor"}, {include: "@flowNumber"}, [/[^\},]+/, {
        cases: {
          "@keywords": "keyword",
          "@default": "string"
        }
      }]],
      array: [{include: "@whitespace"}, {include: "@comment"}, [/\]/, "@brackets", "@pop"], [/,/, "delimiter.comma"], {include: "@flowCollections"}, {include: "@flowScalars"}, {include: "@tagHandle"}, {include: "@anchor"}, {include: "@flowNumber"}, [/[^\],]+/, {
        cases: {
          "@keywords": "keyword",
          "@default": "string"
        }
      }]],
      string: [[/[^\\"']+/, "string"], [/@escapes/, "string.escape"], [/\\./, "string.escape.invalid"], [/["']/, {
        cases: {
          "$#==$S2": {
            token: "string",
            next: "@pop"
          }, "@default": "string"
        }
      }]],
      multiString: [[/^( +).+$/, "string", "@multiStringContinued.$1"]],
      multiStringContinued: [[/^( *).+$/, {
        cases: {
          "$1==$S2": "string",
          "@default": {token: "@rematch", next: "@popall"}
        }
      }]],
      whitespace: [[/[ \t\r\n]+/, "white"]],
      comment: [[/#.*$/, "comment"]],
      flowCollections: [[/\[/, "@brackets", "@array"], [/\{/, "@brackets", "@object"]],
      flowScalars: [[/"/, "string", '@string."'], [/'/, "string", "@string.'"]],
      blockStyle: [[/[>|][0-9]*[+-]?$/, "operators", "@multiString"]],
      flowNumber: [[/@numberInteger(?=[ \t]*[,\]\}])/, "number"], [/@numberFloat(?=[ \t]*[,\]\}])/, "number.float"], [/@numberOctal(?=[ \t]*[,\]\}])/, "number.octal"], [/@numberHex(?=[ \t]*[,\]\}])/, "number.hex"], [/@numberInfinity(?=[ \t]*[,\]\}])/, "number.infinity"], [/@numberNaN(?=[ \t]*[,\]\}])/, "number.nan"], [/@numberDate(?=[ \t]*[,\]\}])/, "number.date"]],
      // eslint-disable-next-line
      tagHandle: [[/\![^ ]*/, "tag"]],
      anchor: [[/[&*][^ ]+/, "namespace"]]
    }
  }
}

export const id = 'raml'
export const extension = '.' + id
export default (monaco, provideCompletionItems) => {
  const languages = monaco.languages;
  languages.register({id, extensions: [extension]})

  const disposables = []
  disposables.push(languages.setLanguageConfiguration(id, configurations()))
  disposables.push(languages.setMonarchTokensProvider(id, tokens()))
  disposables.push(languages.registerCompletionItemProvider(id, {provideCompletionItems}))
  return disposables
}