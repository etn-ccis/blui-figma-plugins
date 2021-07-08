const fs = require('fs');
const fetch = require('node-fetch');

async function main() {
    fetch('https://fonts.google.com/metadata/icons')
        .then((response) => response.text())
        .then((text) => {
            const data = text.replace(")]}'\n", '');
            const iconSet = {};
            JSON.parse(data).icons.forEach((icon) => {
                iconSet[icon.name] = icon.tags;
            });
            fs.writeFileSync('./matMeta.ts', 'export const data = ' + JSON.stringify(iconSet));
        });
}

main();
