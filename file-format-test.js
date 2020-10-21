const sharp = require('sharp');
const path = process.env.TIFF_FILE;
const fs = require('fs');

async function go() {
    const buffer = fs.readFileSync(path);
    const jpgBuffer = await sharp(buffer)
        .toFormat('jpg')
        .toBuffer();
    console.log('writing');
    fs.writeFileSync('test.jpg', jpgBuffer)
}

go().then(() => console.log('done')).catch((err) => console.log('error', error))