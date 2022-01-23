// Get Comapny Name
const companyName = document.getElementById("compName").innerText;
const fiscal = 4;
// Create SVG Chart
let svg = d3.select('.chart-container').append('svg');
// Setup
// Set Width/Height
const width = window.innerWidth * 0.95, height = window.innerHeight * 0.95;
 svg.attr("width", width).attr("height", height);
/// Clear Canvas
svg.selectAll("*").remove();
/// Set Margin
  const
  hPix = height/5,
  margin = { top: hPix / 2, bottom: hPix * 1.5, left: width / 10, right: hPix};
/// Scale data
  //x
  const x = d3.scaleBand()
  .domain(data.map(d => d.year))
  .range([margin.left, width / 2])
  .padding(0.3);
  // y
  const y = d3.scaleLinear()
  .range([ height-margin.bottom, margin.top ])
  // Declare Variables
  const barWidth = Math.min(50, Math.max(0, x.bandwidth()));
  const formatDecimal = d3.format(",.3f");
  const formatPercent = d3.format(".0%");
  const color = d3.scaleOrdinal()
  .range(['#323231','#DCDDDD','#464646','#5A5B5B','#6E6F6F', '#323231']);
  // Draw x-axis
  const xAxis = d3.axisBottom(x);
// Assign datapoints to color
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year" && key !== "Country" && key !== "Industry"; }));
  console.log(data)
  // Create new Datapoints 
  data.forEach(function(d) {
    var y0 = 0;
    d.stores = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.stores[d.stores.length-1].y1;
    d.titles = d.stores.name;
  });
  y.domain([0, d3.max(data, d => d.total)]);

  /// MAIN CHART
  // create BARS container Main Chart
  const bars = svg.selectAll(".year")
  .data(data)
  .enter().append("g")
  .attr("id", (d, i) => `column${i}`)
  .attr("transform", d => "translate(" + x(d.year) + ",0)");

// Main Chart y-axis TEXT 
svg.append("g")
.classed("yAxis", true)
.selectAll("text")
.data(data[0].stores)
.enter().append("text")
  .attr("y", d => y((d.y0 + d.y1) / 2))
  .attr("x", margin.left)
  .text(d => width > 800 ? d.name : "")
  
// Main Chart BARS
bars.selectAll("rect")
.data(d => d.stores)
.enter().append("rect")
  .attr("width", barWidth)
  .attr("y", d => y(d.y1))
  .attr("height", d => y(d.y0) - y(d.y1))
  .attr("fill", d => color(d.name))
  .attr("id", (d, i) => `${d.name}${i}`)
  .attr("title", d => formatDecimal(d.y1 - d.y0))
  .attr("date", d => d.name);  

// Main Chart Bar TEXT
bars.selectAll("text")
.data( d => d.stores)
.enter().append("text")
.attr("y", d => y((d.y0 + d.y1) / 2) + 1)
.attr("x", barWidth/2)
.attr("id", (d, i) => `text${i}${d.name}`)
.text(d => (d.y1 - d.y0) > 0.4 ? (d.y1 - d.y0).toFixed(1) : "")
.classed("bar-text", true)

// Main Chart TOTAL TEXT
bars.append("text")
.attr("class", "bar-text")
.attr("x", barWidth/2)
.attr("y", d => y(d.total)-10)
.text( d => (d.total).toFixed(1))
.style("fill", "black");

// AC,PL Difference 
// Difference LINE
const diffs = svg.append('g').attr('id', 'differnece-bars')
function drawDifLine(Xposition, Yposition) {
  diffs.append("line")
  .attr("x1", Xposition)
  .attr("x2", width / 2)
  .attr("y1", y(Yposition))
  .attr("y2", y(Yposition))
  .attr("class", "diffLine");
}
drawDifLine(x(data[fiscal].year), data[4].Software);
drawDifLine(x(data[fiscal-1].year), data[3].Software);
drawDifLine(x(data[fiscal-1].year), data[3].total);
drawDifLine(x(data[fiscal].year), data[4].total);
// Difference BARS
function drawDifBar(y1, y2) {
  diffs
  .append("line")
    .attr("x1", width/2)
    .attr("x2", width/2)
    .attr("y1", y1)
    .attr("y2", y2)
    .attr("stroke", d => data[4].Software - data[3].Software > 0 ? "#85AD39" : "#E73835")
    .attr("stroke-width", "3px");
} 
drawDifBar(y(data[4].Software), y(data[3].Software));
drawDifBar(y(data[4].total), y(data[3].total));
// Difference VALUES
function writeDifText (d1, d2) {
  diffs
  .append("text")
  .classed("diffText", true)
  .attr("x", width/2 + 5)
  .attr("y", y(d1) + (y(d2) - y(d1)) / 2 + 2)
  .style("alignment-baseline", "hanging")
  .text( d => (data[4].total - data[3].total) < 0 ? 
    `${(d1 - d2).toFixed(1)}` :
    `+${(d1 - d2).toFixed(1)}`);
  
  diffs
  .append("text")
  .attr("x", width/2 + 5)
  .attr("y", y(d1) + (y(d2) - y(d1)) / 2 - 2)
  .style("alignment-baseline", "baseline")
  .text( d => (data[4].total - data[3].total) < 0 ? 
    `${((d1 / d2 - 1) * 100).toFixed(1)}%` :
    `+${((d1 / d2 - 1) * 100).toFixed(1)}%`);
}
writeDifText(data[4].Software, data[3].Software);
writeDifText(data[4].total, data[3].total);

// FISCAL-LINE
const fiscalCol = d3.select(`#column${fiscal}`)
const fisColPos = x(data[fiscal-1].year) + barWidth + (x(data[fiscal].year) - (x(data[fiscal-1].year)+barWidth)) / 2 ;

fiscalCol.attr("stroke", "black");
fiscalCol.select("#Software0").attr("fill", "white");
fisLine = d3.select(`#column${fiscal-1}`).attr('transform');
fiscalCol.select("#text0Software").style("fill", "black");
d3.selectAll(`#text1Support`).style("fill", "black");
// Draw FISCAL LINE
const fisc = svg.append('g').attr('id', 'fiscal')
fisc
.data(data)
.append("line")
  .attr('id', 'fiscal-line')
  .attr('x1', fisColPos)
  .attr('x2', fisColPos)
  .attr("y1", height - margin.bottom - 30)
  .attr("y2", height - margin.bottom + 40)
.attr("stroke", "black");
// Append FISCAL TEXT
function xText(string, bar) {
  fisc
  .append("text")
  .text(string)
  .attr("dy", "2.6em")
  .attr("text-anchor", "middle")
  .attr("x", barWidth/2)
  .attr("y", height - margin.bottom)
  .attr('transform', d3.select(`#column${fiscal-bar}`).attr('transform'))
}
xText('AC', 0);
xText('PL', 1);

// Details Columns
// Select Dataset DETAILS COL
const industryData = [data[fiscal-1].Industry];
const countryData = [data[fiscal-1].Country];
// Set Position DETAILS
const industryDatapos = width -  x.bandwidth() * 5;
const countryDatapos = width - x.bandwidth() * 2; //By Country
// Assign Color to Each Datapoint
const indKeys = d3.keys(industryData[0]);
const countKeys = d3.keys(countryData[0]);
// map Data by Categories
function mapData(datum, key) {
  datum.map(d => {
    var y0 = 0;
    color.domain(key);
    // Stack Values
    d.stores = color.domain().map(function(name, i) { return {name: name, y0: y0, y1: y0 += +d[name], color: color.range()[i]} });
    // Get Total by gettiing the last value of the Stack Array
    d.total = d.stores[d.stores.length - 1].y1;
    // Get Industry Names
    d.titles = d.stores[d.stores.length - 1].name;
  });
}
mapData(industryData, indKeys);
mapData(countryData, countKeys);

// Create COUNTRY BAR CONTAINER
const countryBar = svg.selectAll(".countryBar")
.data(industryData)
.enter().append("g")
.attr("class", "by-country-bar");
// Create INDUSTRY BAR CONTAINER
const industryBar = svg.selectAll(".industryBar")
.data(countryData)
.enter().append("g")
.attr("class", "by-industry-bar");

// Draw DETAILS BARS
function drawDetailBars(bartype, pos) {
  // Details BARS
  bartype
  .selectAll("rect")
  .data( d =>  d.stores)
  .enter().append("rect")
    .attr("width", barWidth)
    .attr("x", pos)
    .attr("y", d => y(d.y1))
    .attr("height", d => y(d.y0) - y(d.y1))
    .attr("fill", d => d.color)
    .attr("title", d => formatDecimal(d.y1 - d.y0))
    .attr("date", d => [d.name]); 
  // Details TEXT
  bartype
  .selectAll("text")
  .data( d => d.stores)
  .enter().append("text")
  .text(d => (d.y1 - d.y0) > 0.5 ? (d.y1 - d.y0).toFixed(1) : "")
    .attr("y", d => y((d.y0 + d.y1) / 2))
    .attr("x", pos + barWidth/2)
    .attr("id", (d, i) => `text${i}`)
    .attr("class", "bar-text");
  // Detials TOTAL TEXT
  bartype
  .append("text")
  .text( d => (d.total).toFixed(1))
    .attr("x", pos + barWidth / 2)
    .attr("y", d => y(d.total) - 10)
    .attr("class", "bar-text")
    .style("fill", "black");
}
// Call Function Draw Details
drawDetailBars(industryBar, countryDatapos)
drawDetailBars(countryBar, industryDatapos)
d3.selectAll(`#text1`).style("fill", "black")


/// X-AXIS Details 
function xAxLine(pos, datum) {
  // 
  svg
  .append("line")
    .attr("y1", height - margin.bottom)
    .attr("y2", height - margin.bottom)
    .attr("x1", pos - barWidth/2)
    .attr("x2", pos - barWidth/2 + barWidth * 2)
    .attr("stroke", "black");

  svg
  .append("text")
    .attr("y", height - margin.bottom + 6)
    .attr("x", pos + barWidth / 2)
    .attr("alignment-baseline", "hanging")
    .attr("text-anchor","middle")
    .text(parseInt(data[0].year) + fiscal - 1);

  svg
  .append("text")
    .attr("y", height - margin.bottom)
    .attr("x", pos + barWidth/2)
    .attr('dy', '2.6em')
    .attr("text-anchor","middle")
    .text("AC");
  // 
  svg.append("g")
    .selectAll("text")
    .data(datum[0].stores)
    .enter().append("text")
    .attr("y", d => y((d.y0 + d.y1) / 2))
    .attr("x", pos - 10)
    .text(d => width > 800 ? d.name : "")
    .call(wrap, 90)
    .classed("yAxis", true)
}
  // X-Axis
  svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(${-x.bandwidth() / 2 + barWidth / 2} , ${height - margin.bottom})`)
  .call((xAxis)
    .tickSize(0)
    .tickPadding(6));
xAxLine(industryDatapos, industryData)
xAxLine(countryDatapos, countryData)

/// Header TEXT CATEGORIES
// Header TEXT CATEGORIES 'Blueprint'
function printHeaderText(xPos, string) {
  svg
  .append("text")
  .text(string)
    .attr("x", xPos)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
}
/// Header Text call function
printHeaderText(x(data[2].year),  'By Business Line');
printHeaderText(industryDatapos + barWidth / 2,  'By Industry');
printHeaderText(countryDatapos + barWidth / 2,  'By Country');

d3.select(window).on("resize", () => location.reload());

