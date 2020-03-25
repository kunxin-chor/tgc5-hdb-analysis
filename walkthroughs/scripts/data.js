/*
All data processing and loading functions goes here
*/
function loadData(files, processData) {
    // put in all the axios.get inside an array
    let promises = [];
    for (let f of files) {
        promises.push(axios.get(f));
    }

    axios.all(promises).then(function(responses){
        let promises = [];
        // store each async call (aka. promise) into the array
        for (let r of responses) {
            promises.push(csv({checkType:true}).fromString(r.data));
        }

        // wait for all the conversion done
        axios.all(promises).then(function(allData){
            // call the processData function (which is pass via the second argument) to process the data
            processData(allData);
        })
    })
}

function mergeData(allData)
{
    // final is the "transformed" array
    let final = [];
    let constructed = allData[0];
    let resale = allData[1];

    for (let c of constructed) {

        if (c.year < 1990) {
            continue; // skip to the next iteration of the loop
        }

        let average_index = 0;
        for (let r of resale) {
            if (r.quarter.indexOf(c.year) != -1) {
                average_index += r.index
            }
        }
        average_index = average_index / 4;

        let transformedObject = {
            year: moment(c.year, "YYYY").toDate(),
            flats_constructed:c.flats_constructed,
            average_index: average_index
        };
        final.push(transformedObject);
    }
    return final;
}