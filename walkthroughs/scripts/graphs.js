function drawGraphs(data)
{
    let cf = crossfilter(data);

    // draw the resale graph
    drawResaleGraph(cf);

    // draw the constructed graph
    drawConstructedGraph(cf);

    // draws all the graphs
    dc.renderAll();

}

function drawResaleGraph(cf)
{
     // draw the number of flats constructed graph
    let yearDimension = cf.dimension(d => d.year);
    let indexGroup = yearDimension.group().reduceSum(d => d.average_index);

    let minDate = yearDimension.bottom(1)[0].year;
    let maxDate = yearDimension.top(1)[0].year;

    // as of v4.04, the correct way to do the graph is below:
    let indexGraph = new dc.LineChart("#index-graph");
    indexGraph.width(600)
        .height(300)
        .dimension(yearDimension)
        .group(indexGroup)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .xAxisLabel('Year')
        .yAxisLabel('Average Resale Index')
        .yAxis().ticks(4)
}

function drawConstructedGraph(cf)
{
    let yearDimension = cf.dimension(d => d.year);
    let constructedGroup = yearDimension.group().reduceSum(d => d.flats_constructed);

    let minDate = yearDimension.bottom(1)[0].year;
    let maxDate = yearDimension.top(1)[0].year;

    console.table(yearDimension.top(10));

    let constructedGraph = new dc.LineChart("#constructed");
    constructedGraph.width(600)
        .height(300)
        .dimension(yearDimension)
        .group(constructedGroup)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .xAxisLabel('Year')
        .yAxisLabel('Flats Constructed')
        .yAxis().ticks(4)


}