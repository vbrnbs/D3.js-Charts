
const companyName = document.getElementById("compName").innerText;

///////////////////////////////////////////////// SETUP ///////////////////////////////////////
const force = d3.forceSimulation();
// Create SVG Chart
let svg = d3.select('.chart-container').append('svg');
// On Load
const update = function(data) {
  // Set Width/Height
  const w = window.innerWidth * 0.95, h = window.innerHeight * 0.95;
  svg.attr("width", w).attr("height", h);
  const width = d3.select('svg').attr('width'),
  height = d3.select('svg').attr('height');
  // Clear Canvas
  svg.selectAll("*").remove();
  // Set Margin
  const
  fontSize = 12,
  hPix = height/5,
  margin = { top: hPix / 2, bottom: hPix * 1.5, left: width / 10, right: hPix};
  // Scale
  const x = d3.scaleBand()
  .domain(d3.range(Data.length))
  .range([margin.left, width / 2])
  .padding(0.3);

  const xScale = d3.scaleBand()
  .domain(d3.range(Data.length))
  .range([margin.left, width/2])
  .padding(0.3);

  const y = d3.scaleLinear()
  .domain([0, 10])
  .range([ height-margin.bottom, margin.top ]);
  let barWidth = Math.min(50, Math.max(0, x.bandwidth()));
  const color = d3.scaleOrdinal()
  .range(['#323231','#DCDDDD','#464646','#5A5B5B','#6E6F6F']);

  const xAxis = d3.axisBottom(x);

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year" && key !== "Country" && key !== "Industry" && key !== "FiscalYear"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.stores = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.stores[d.stores.length - 1].y1;// NOT TO INCLUDE 'INDUSTRY' AND 'COUNTRY' 
    d.titles = [] 
    for (let i = 0; i < d.stores.length; i++) {
      d.titles.push(d.stores[i].name)
    };// NOT TO INCLUDE 'INDUSTRY' AND 'COUNTRY' 
  });

  x.domain(data.map( d => d.year));
  y.domain([0, d3.max(data, d => d.total)]);

  svg.append("g")
  .attr("class", "x_axis")
  .attr("transform", `translate(${-x.bandwidth() / 2 + barWidth / 2} , ${height - margin.bottom})`)
  .call((xAxis)
    .tickSize(0)
    .tickPadding(6));

  const year = svg.selectAll(".year")
  .data(data)
  .enter().append("g")
  .attr("id", (d, i) => `column${i}`)
  .attr("transform", d => "translate(" + x(d.year) + ",0)");


////////////////////////// TOOLTIP ///////////////////////////

const formatDecimal = d3.format(",.3f");
const formatPercent = d3.format(".0%");

$(document).ready(function(){
  tippy('[title]', {   
    arrow: true,
    placement: 'top',
    delay: 5, 
    followCursor: false,
    allowHTML: true,
    theme: 'custom',
    ignoreAttributes: true,
    content(reference) {
      const title = reference.getAttribute('title');
      const date = reference.getAttribute('date');
      let fill = reference.getAttribute('fill');
      return `<style>
      .tippy-tooltip.custom-theme{
        box-shadow: 1px 1px 1px 1px ${fill};
        border: 1px solid ${fill};
      }
      .tippy-tooltip.custom-theme .tippy-arrow {

        transform: translateY(2px);
        border-top-color: ${fill};
        border-bottom-color: ${fill};
      }
      </style>

      <p style="color: grey;">${date}</p> 
      <p><span style="font-size: 18px;color: ${fill};"> ● </span>${companyName}: <strong>${title}</strong></p>`
    }, }); });

//////////////////// MAIN CHART ////////////////////////

// Y-AXIS TEXT
svg.append("g")
.selectAll("text")
.data(data[0].stores)
.enter().append("text")
.attr("y", d => y((d.y0 + d.y1) / 2))
.attr("x", margin.left)
.text(d => width > 800 ? d.name : "")
.classed("yAxis", true)

/// RECT BARS
year.selectAll("rect")
.data(d => d.stores)
.enter().append("rect")
.attr("width", barWidth)
.attr("y", d => y(d.y1))
.attr("height", d => y(d.y0) - y(d.y1))
.attr("fill", d => color(d.name))
.attr("id", (d, i) => `${d.name}${i}`)
.attr("title", d => formatDecimal(d.y1 - d.y0))
.attr("date", d => d.name);  

d3.select(`#column${fiscal}`).attr("stroke", "black");
d3.select(`#column${fiscal}`).select("#Software0").attr("fill", "white");



/// BAR-TEXTS
year.selectAll("text")
.data( d => d.stores)
.enter().append("text")
.attr("y", d => y((d.y0 + d.y1) / 2) + 1)
.attr("x", barWidth/2)
.attr("id", (d, i) => `text${i}${d.name}`)
.text(d => (d.y1 - d.y0) > 0.4 ? (d.y1 - d.y0).toFixed(1) : "")
.classed("bar-text", true)

d3.select(`#column${fiscal}`).select("#text0Software").style("fill", "black");
d3.selectAll(`#text1Support`).style("fill", "black");



// TOTAL BAR TEXT
year.append("text")
.attr("class", "bar-text")
.attr("x", barWidth/2)
.attr("y", d => y(d.total)-10)
.text( d => (d.total).toFixed(1))
.style("fill", "black");

//////////// FISCAL ////////////////

// FISCAL-TEXT

svg
.append("text")
.attr("dy", "2.6em")
.text("AC")
.attr("text-anchor", "middle")
.attr("x", xScale(fiscal-1) + barWidth / 2)
.attr("y", height - margin.bottom)

svg
.append("text")
.attr("dy", "2.6em")
.text("PL")
.attr("text-anchor", "middle")
.attr("x", xScale(fiscal) + barWidth / 2)
.attr("y", height - margin.bottom);

// FISCAL-LINE

const f1 = xScale(0) + barWidth,
f2 = xScale(1),
mid = (f2-f1)/2;

svg.append("line")
.attr("x1", xScale(fiscal) - mid)
.attr("x2", xScale(fiscal) - mid)
.attr("y1", height - margin.bottom - 30)
.attr("y2", height - margin.bottom + 40)
.attr("stroke", "black");


/////////////// DIFFERENCES //////////
// SOFTWARE
svg.append("line")
.attr("x1", xScale(4))
.attr("x2", width / 2)
.attr("y1", y(Data[4].Software))
.attr("y2", y(Data[4].Software))
.attr("class", "diffLine");

svg.append("line")
.attr("x1", xScale(3))
.attr("x2", width/2)
.attr("y1", y(Data[3].Software))
.attr("y2", y(Data[3].Software))
.attr("class", "diffLine");

svg.append("line")
.attr("x1", width/2)
.attr("x2", width/2)
.attr("y1", y(Data[3].Software))
.attr("y2", y(Data[4].Software))
.attr("stroke", d => Data[4].Software - Data[3].Software > 0 ? "#85AD39" : "#E73835")
.attr("stroke-width", "3px");

svg.append("text")
.classed("diffText", true)
.attr("x", width/2 + 5)
.attr("y", y(Data[4].Software) + (y(Data[3].Software) - y(Data[4].Software)) / 2 + 1)
.style("alignment-baseline", "hanging")
.text( d => (Data[4].total - Data[3].total) < 0 ? 
  `${(Data[4].Software - Data[3].Software).toFixed(1)}` :
  `+${(Data[4].Software - Data[3].Software).toFixed(1)}`);

svg.append("text")
.attr("x", width/2 + 5)
.attr("y", y(Data[4].Software) + (y(Data[3].Software) - y(Data[4].Software)) / 2 - 1)
.style("alignment-baseline", "baseline")
.text( d => (Data[4].total - Data[3].total) < 0 ? 
  `${((Data[4].Software / Data[3].Software - 1) * 100).toFixed(1)}%` :
  `+${((Data[4].Software / Data[3].Software - 1) * 100).toFixed(1)}%`);


// YEARS IN TOTAL

svg.append("line")
.attr("x1", margin.left + 20 + x.bandwidth() * 6)
.attr("x2", width/2)
.attr("y1", y(Data[4].total))
.attr("y2", y(Data[4].total))
.attr("class", "diffLine");

svg.append("line")
.attr("x1", margin.left + 20 + x.bandwidth() * 4.5)
.attr("x2", width/2)
.attr("y1", y(Data[3].total))
.attr("y2", y(Data[3].total))
.attr("class", "diffLine");

svg.append("line")
.attr("x1", width/2)
.attr("x2", width/2)
.attr("y1", y(Data[3].total))
.attr("y2", y(Data[4].total))
.attr("stroke", d => Data[4].Software - Data[3].Software > 0 ? "#85AD39" : "#E73835")
.attr("stroke-width", "3px");

svg.append("text")
.attr("x", width/2 + 5)
.attr("y", y(Data[4].total) + (y(Data[3].total) - y(Data[4].total)) / 2 + 1)
.style("alignment-baseline", "hanging")
.text( d => (Data[4].total - Data[3].total) < 0 ? 
  `${(Data[4].total - Data[3].total).toFixed(1)}` :
  `+${(Data[4].total - Data[3].total).toFixed(1)}`);

svg.append("text")
.attr("x", width/2 + 5)
.attr("y", y(Data[4].total) + (y(Data[3].total) - y(Data[4].total)) / 2 - 1)
.style("alignment-baseline", "baseline")
.text( d => (Data[4].total - Data[3].total) < 0 ? 
  `${((Data[4].total / Data[3].total - 1) * 100).toFixed(1)}%` :
  `+${((Data[4].total / Data[3].total - 1) * 100).toFixed(1)}%`);



/////////////// COLUMN 2  /////////////////////////

const col2 = [data[fiscal-1].Industry];
const col2pos = width -  x.bandwidth() * 5;
color.domain(d3.keys(col2[0]).filter(function(key) { return key !== "year" && key !== "FiscalYear"; }));


col2.forEach(function(d) {
  var y0 = 0;
  d.stores = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
  d.total = d.stores[d.stores.length - 1].y1;
  d.titles = d.stores[d.stores.length - 1].name;
});

// COLUMN-2 Y-AXIS TEXT

svg.append("g")
.selectAll("text")
.data(col2[0].stores)
.enter().append("text")
.attr("y", d => y((d.y0 + d.y1) / 2))
.attr("x", col2pos - 10)
.text(d => width > 800 ? d.name : "")
.call(wrap, 120)
.classed("yAxis", true)

// COLUMN-2 BARS

var year1 = svg.selectAll(".year1")
.data(col2)
.enter().append("g")
.attr("class", "g");

year1.selectAll("rect")
.data(d => d.stores)
.enter().append("rect")
.attr("width", barWidth)
.attr("x", col2pos)
.attr("y", d => y(d.y1))
.attr("height", d => y(d.y0) - y(d.y1))
.attr("fill", d => color(d.name))
.attr("title", d => formatDecimal(d.y1 - d.y0))
.attr("date", d => [d.name]); 

// COLUMN-2 BARS TEXT

year1.selectAll("text")
.data( d => d.stores)
.enter().append("text")
.attr("y", d => y((d.y0 + d.y1) / 2))
.attr("x", col2pos + barWidth/2)
.attr("id", (d, i) => `text${i}`)
.text(d => (d.y1 - d.y0) > 0.5 ? (d.y1 - d.y0).toFixed(1) : "")
.attr("class", "bar-text");

d3.selectAll(`#text1`).style("fill", "black")

// COLUMN-2 TOTAL TEXT

year1.append("text")
.attr("x", col2pos + barWidth / 2)
.attr("y", d => y(d.total) - 10)
.attr("class", "bar-text")
.style("fill", "black")
.text( d => (d.total).toFixed(1));

/// X-AXIS 

year1
.append("line")
.attr("y1", height - margin.bottom)
.attr("y2", height - margin.bottom)
.attr("x1", col2pos - barWidth/2)
.attr("x2", col2pos - barWidth/2 + barWidth * 2)
.attr("stroke", "black");

year1
.append("text")
.attr("y", height - margin.bottom + 6)
.attr("x", col2pos + barWidth / 2)
.attr("alignment-baseline", "hanging")
.attr("text-anchor","middle")
.text(parseInt(data[0].year) + (fiscal-1));

year1
.append("text")
.attr("y", height - margin.bottom)
.attr("x", col2pos + barWidth/2)
.attr('dy', '2.6em')
.attr("text-anchor","middle")
.text("AC");


////////////************ COLUMN 3 ***********************//////////////////

const col3 = [data[fiscal-1].Country];
const col3pos = width - x.bandwidth() * 2; //By Country

color.domain(d3.keys(col3[0]).filter(function(key) { return key !== "year"; }));

col3.forEach(function(d) {
  var y0 = 0;
  d.stores = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
  d.total = d.stores[d.stores.length - 1].y1;
  d.titles = d.stores[d.stores.length - 1].name;
});

// COLUMN-3 Y-AXIS TEXT

svg.append("g")
.selectAll("text")
.data(col3[0].stores)
.enter().append("text")
.attr("y", d => y((d.y0 + d.y1) / 2))
.attr("x", col3pos - 10)
.text(d => width > 800 ? d.name : "")
.call(wrap, 80)
.classed("yAxis", true)


// COLUMN-3 BARS

var year1 = svg.selectAll(".year1")
.data(col3)
.enter().append("g")
.attr("class", "g")

year1.selectAll("rect")
.data( d =>  d.stores)
.enter().append("rect")
.attr("width", barWidth)
.attr("x", col3pos)
.attr("y", d => y(d.y1))
.attr("height", d => y(d.y0) - y(d.y1))
.attr("fill", d => color(d.name))
.attr("title", d => formatDecimal(d.y1 - d.y0))
.attr("date", d => [d.name]); 

// COLUMN-3 BAR TEXT
year1.selectAll("text")
.data( d => d.stores)
.enter().append("text")
.attr("y", d => y((d.y0 + d.y1) / 2))
.attr("x", col3pos + barWidth / 2)
.attr("class","bar-text")
.attr("id", (d, i) => `text${i}${d.name}`)
.text(d => (d.y1 - d.y0) > 0.5 ? (d.y1 - d.y0).toFixed(1) : "");

d3.selectAll(`#text1Germany`).style("fill", "black")

//// COLUMN-3 TOTAL
year1.append("text")
.attr("class", "bar-text")
.attr("x", col3pos + barWidth / 2)
.attr("y", d => y(d.total) - 10)
.text( d => (d.total).toFixed(1))
.style("fill",'black');


// X-AXIS
year1
.append("line")
.attr("y1", height - margin.bottom)
.attr("y2", height - margin.bottom)
.attr("x1", col3pos - barWidth / 2)
.attr("x2", col3pos + barWidth * 1.5)
.attr("stroke", "black")

year1
.append("text")
.attr("y", height - margin.bottom + 6)
.attr("x", col3pos + barWidth / 2)
.attr("text-anchor","middle")
.attr("alignment-baseline", "hanging")
.text(parseInt(data[0].year) + (fiscal-1));

year1
.append("text")
.attr("y", height - margin.bottom)
.attr("x", col3pos + barWidth / 2)
.attr('dy', '2.6em')
.attr("text-anchor","middle")
.text("AC");

/////////////////////////// TEXTS ////////////////////////////////

// HEADER / TITLE TEXTS


svg
.append("text")
.text("By Business Line")
.attr("x", xScale(1))
.attr("y", margin.top - 40)

svg
.append("text")
.text("By Industry")
.attr("x", col2pos + barWidth / 2)
.attr("text-anchor","middle")
.attr("y", margin.top - 40)

svg
.append("text")
.text("By Country")
.attr("x", col3pos + barWidth / 2)
.attr("text-anchor","middle")
.attr("y", margin.top - 40)
.attr("font-size", fontSize)


function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
    words = text.text().split(/\s+/).reverse(),
    word,
    line = [],
    lineNumber = 0,
            lineHeight = 1.0, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, 
            tspan = text.text(null)
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", dy + "em");
            while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", ++lineNumber * lineHeight + dy + "em")
                .text(word);
              }}})}
}


update(Data);
d3.select(window).on("resize", () => location.reload());

