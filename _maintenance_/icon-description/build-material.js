const fs = require('fs');
const fetch = require('node-fetch');

async function main() {
    fetch('https://fonts.google.com/metadata/icons')
        .then((response) => response.text())
        .then((text) => {
            const data = text.replace(")]}'\n", '');
            const iconSet = {};
            const icons = JSON.parse(data).icons.forEach((icon) => {
                iconSet[icon.name] = icon.tags;
            });
            fs.writeFileSync('./matMeta.json', JSON.stringify(iconSet));
        });
}

main();
