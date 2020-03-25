
// Next step is a function
function loadData(files, nextStep) {
    // create promises
    let promises = [];
    files.forEach(f => promises.push(axios.get(f)));
    axios.all(promises).then(r => nextStep(r));
}
