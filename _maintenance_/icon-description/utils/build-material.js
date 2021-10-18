const fs = require('fs');
const fetch = require('node-fetch');

// everything works fine on the BLUI side, which uses GitHub's API.
// But Material Design's meta json file has CORS restrictions on it, therefore we have to
// download it on build.
async function main() {
    fetch('https://fonts.google.com/metadata/icons')
        .then((response) => response.text())
        .then((text) => {
            const data = text.replace(")]}'\n", '');
            const iconSet = {};
            JSON.parse(data).icons.forEach((icon) => {
                iconSet[icon.name] = icon.tags;
            });
            fs.writeFileSync('./build/matMeta.js', 'const matIconSet = ' + JSON.stringify(iconSet));
        });
}

main();
