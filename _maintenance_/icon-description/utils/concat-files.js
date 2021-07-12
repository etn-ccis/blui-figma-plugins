const fs = require('fs');

fs.writeFileSync('./build/code.js', fs.readFileSync('./build/matMeta.js') + ';\n' + fs.readFileSync('./build/code.js'));
