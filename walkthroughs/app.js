// the file paths must be relative to app.js
let files = [
    'data/flats-constructed-by-housing-and-development-board-annual.csv',
    'data/housing-and-development-board-resale-price-index-1q2009-100-quarterly.csv'
];

// jQuery ready 
$(function(){
    console.log("Hello");
    loadData(files, function(allData){
        let final = mergeData(allData);
        drawGraphs(final);
    });
})


