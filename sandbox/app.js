let data = [];
let files = [
    "./data/flats-constructed-by-housing-and-development-board-annual.csv",
    "./data/housing-and-development-board-resale-price-index-1q2009-100-quarterly.csv"
];
// jQuery ready
$(function(){
    loadData(files, startApp);
});

function startApp(loadedData)
{

    let promises = [
        csv({checkType:true}).fromString(loadedData[0].data),
        csv({checkType:true}).fromString(loadedData[1].data)
    ];

    axios.all(promises).then(allData=> {
        let finalData = [];
        let constructed = allData[0];
        let resale = allData[1];
  
        for (let c of constructed) {
            
            // skip all those years 
            if (parseInt(c.year) < 1990) {
                continue;
            }

            let averageResaleIndex = 0;
            for (let r of resale) {
                if (r.quarter.indexOf(c.year) != -1) {
                   averageResaleIndex += r.index
                }
            }  

            let toAdd = {
                year: moment(c.year, "YYYY").toDate(),
                constructed: c.flats_constructed,
                index:averageResaleIndex
            }
            finalData.push(toAdd);
        }
        drawGraphs(finalData);

    })

}

function drawGraphs(jsonData)
{
    data = jsonData;
    let cf = crossfilter(jsonData);
    drawResalePrice(cf);
    drawFlatsConstructed(cf);
    dc.renderAll();

}

function drawResalePrice(cf)
{
    let yearDimension = cf.dimension(d => d.year);
    let resaleIndexGroup = yearDimension.group().reduceSum(d => d.index);
  
    let minDate = yearDimension.bottom(1)[0].year;
    let maxDate = yearDimension.top(1)[0].year;
    let priceChart = new dc.LineChart("#resale-price");
    priceChart
        .width(600)
        .height(300)    
        .brushOn(false)
        .margins({top:10,left:100,bottom:50,right:10})
        .dimension(yearDimension)
        .group(resaleIndexGroup)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .xAxisLabel("Year")
        .yAxis().ticks(4);

        console.log("hi");

        priceChart.on("renderlet", (c)=> {
              c.selectAll('circle.dot').on('click.my-click-event',function(event) {
                console.log(event);
              });
        })
       

    
    
   


  
}

function drawFlatsConstructed(cf)
{
    let yearDimension =  cf.dimension(d => d.year);
    let constructedGroup = yearDimension.group().reduceSum(d => d.constructed);

    
    let minDate = yearDimension.bottom(1)[0].year;
    let maxDate = yearDimension.top(1)[0].year;

    let priceChart = new dc.LineChart("#constructed");
    priceChart.width(600)
        .height(300)
        .dimension(yearDimension)
        .group(constructedGroup)
        .margins({top:10,left:100,bottom:50,right:10})
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .xAxisLabel("Year")
        .yAxis().ticks(4)
    
    priceChart.on('filtered', function(c,d){
        console.log(c);
        console.log(d);
    })


}