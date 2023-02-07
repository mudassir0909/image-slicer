const fs = require('fs');
const sharp = require('sharp');

const [, , filepath, numberOfSlices, aspectRatio] = process.argv;
const [sliceWidthRatio, sliceHeightRatio] = aspectRatio.split(':').map(Number);

sharp(filepath)
  .metadata()
  .then(metadata => {
    console.log('metadata.width', metadata.width);
    let sliceWidth = Math.floor(metadata.width / numberOfSlices);
    let sliceHeight = Math.floor(sliceWidth * (sliceHeightRatio / sliceWidthRatio));
    let y = Math.floor((metadata.height - sliceHeight) / 2);

    for (let i = 0; i < numberOfSlices; i++) {
      let x = i * sliceWidth;
      sharp(filepath)
        .extract({ left: x, top: y, width: sliceWidth, height: sliceHeight })
        .toFile(`slice-${i}.png`)
        .catch(err => {
          console.error(err);
        });
    }
  })
  .catch(err => {
    console.error(err);
  });
