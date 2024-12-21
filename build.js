const fs = require('fs');
const path = require('path');

const filesToCopy = ['main.js', '.env', 'config.json'];

filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(__dirname, 'dist', file);

    try {
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`Copied ${file} to dist directory.`);
        } else {
            console.error(`File ${file} does not exist.`);
        }
    } catch (error) {
        console.error(`Error copying ${file}: ${error.message}`);
    }
});

