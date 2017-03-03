const postcss = require('postcss');
const fs = require('fs');
const wrench = require('wrench')

const separator = '/';
const prefix = '.api-designer-console';
const rootOriginDir = './node_modules/api-console/dist';
const stylesOriginDir = rootOriginDir + '/styles';
const cssFileName = '/api-console-light-theme.css';
const cssPath = stylesOriginDir + cssFileName;

const rootDestinationDir = './.tmp';
const stylesDestinationDir = rootDestinationDir + '/styles';
const cssDestinationPath = stylesDestinationDir + cssFileName

const excludedSelectors = [
    /(%)/,
    /(CodeMirror-lint-mark)/,
    /(CodeMirror-lint-tooltip)/,
    /(CodeMirror-lint-message-error)/,
    /(CodeMirror-lint-message-warning)/,
    /(CodeMirror-tag-error)/,
    /(CodeMirror-tag-warning)/,
    /(CodeMirror-message)/,
    /(CodeMirror-hint)/
]

const matchSelector = selector => regex => {
    const match = selector.match(regex);
    return match && match.length;
}

const processor = postcss(function(css) {
    css.walkRules(function(rule) {
        rule.selectors = rule.selectors.map(function(selector) {
            // Prevents excluded selectors to be modified
            if(excludedSelectors.find(matchSelector(selector))) return selector;

            const selectorRoot = selector.match(/^\s*(html\s*body|html|body)(.*)/)
            if (selectorRoot) {
                return selectorRoot[1] + ' ' + prefix + ' ' + selectorRoot[2] ;
            } else {
                return prefix + ' ' + selector;
            }
        });
    });
});

const addPrefix = function (path, destinationPath) {
    const content = fs.readFileSync(path, 'utf8');
    const newContent = processor.process(content);
    fs.writeFileSync(destinationPath, newContent);
};


if (!fs.existsSync(rootDestinationDir)) {
  fs.mkdirSync(rootDestinationDir);
}

if (!fs.existsSync(stylesDestinationDir)) {
    fs.mkdirSync(stylesDestinationDir);
}

if (fs.existsSync(cssDestinationPath)) {
    fs.unlinkSync(cssDestinationPath);
}

addPrefix(cssPath, cssDestinationPath);



// Copy the fonts to this dir

const relativeFontsDir = '/fonts'
const originFontsDir = rootOriginDir + relativeFontsDir
const destinationFontsDir = rootDestinationDir + relativeFontsDir

wrench.copyDirSyncRecursive(originFontsDir, destinationFontsDir, {
    forceDelete: true,
    excludeHiddenUnix: true,
    preserveFiles: false
});

const fontsWithNameErrors = [
    { original: 'Lato-Hairline-Italic.woff2', newName: 'Lato-HairlineItalic.woff2'},
    { original: 'Lato-Hairline-Italic2.woff2', newName: 'Lato-HairlineItalic2.woff2'}
]

fontsWithNameErrors
    .forEach((def) => {
        const originalPath = destinationFontsDir + separator + def.original;
        if (fs.existsSync(originalPath)) {
            const newPath = destinationFontsDir + separator + def.newName;
            fs.renameSync(originalPath, newPath)
        }
    })


console.log('Console CSS prefixed')
