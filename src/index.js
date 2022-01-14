let FileSaver = require('file-saver');

let cleanArray = []
let gbifGenus = d3.tsv("NHMR_occurrence.txt", function (d) {
    return [d.gbifID, d.genus];
});

console.log(FileSaver)