
const companyName = document.getElementById("compName").innerText;

const svg = d3.select("#svg-container").append("svg");  
const force = d3.forceSimulation();

d3.csv("data.csv").then(function(data) {

const w = window.innerWidth * 0.95, h = window.innerHeight * 0.95;
svg.attr("width", w).attr("height", h);

svg.selectAll("*").remove();

  const width = d3.select('svg').attr('width'),
  height = d3.select('svg').attr('height');

const companyName = document.getElementById("compName").innerText;
const hPix = height / 5;
const barAbsPos = width * 0.7;
const barRelPos = width * 0.9;
const fontSize = window.innerHeight/150;
const margin = {top: height/20, right: hPix, bottom: height / 6, left: fontSize* 25};

  var chart = svg.append("g")
    .attr("class", "chart");
  
    var x = d3.scaleLinear().domain([0, d3.max(data, d => d.year1)]).range([0, width / 7]);
    var y = d3.scaleBand().range([margin.top, height - margin.bottom]).domain(data.map(function(d) { return d.title; })).padding(0.4);

const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.year1)])
    .rangeRound([0, width/7])

console.log([0, d3.min(data, d => d.year1)])

var yScale = 
d3.scaleBand()
    .domain(d3.range(data.length))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.4)

const totalLinePos = yScale(data.length - 1) + y.bandwidth() + 17;
const totalsPos = totalLinePos + y.bandwidth()/2;
const formatDecimal = d3.format(",.3f");
const formatPercent = d3.format(".0%");


// Y-AXIS TEXT
    chart
         .append("g")
         .selectAll("text")
         .data(data)
         .join("text")
         .text((d) => d.title)
           .attr("x", 15)
           .attr("y", (d, i) => yScale(i) + y.bandwidth() / 2)
           .attr("id", "yAxis")

// YEAR 1 BARS
    chart
    .append("g")
    .selectAll(".bar")
    .data(data)
    .enter().append("rect")
          .attr("x", margin.left)
          .attr("height", y.bandwidth())
          .attr("y", (d, i) => yScale(i))
          .attr("width", function(d) { return x(d.year1); })
          .attr("class", "rect")
          .attr("title", d => formatDecimal(d.year1))
          .attr("date", d => d.title)
          .attr("transform", `translate(0, -3)`)
          .attr("fill", "white")
          .attr("stroke", "black");

// YEAR 1 TEXT BACKGROUND

chart
  .append("g")
  .selectAll("rect")
  .data(data)
  .join("rect")
          .attr("fill", "white")
          .attr("x", d => x(d.year2) + margin.left)
          .attr("y", (d, i) => yScale(i) + y.bandwidth() * 0.2)
          .attr("width", 20)
          .attr("height", y.bandwidth());

// YEAR 1 TEXT    
    chart
      .append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .text((d) => Math.round(d.year2))
        .attr("x", d => x(d.year2) + margin.left + 3)
        .attr("y", (d, i) => yScale(i) + y.bandwidth() / 2 + 3)
        .style("alignment-baseline", "central");


//YEAR 2 BARS - BLACK BARS
    chart
        .append("g")
        .selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "rect")
          .attr("x", margin.left)
          .attr("height", y.bandwidth())
          .attr("y", (d, i) => yScale(i))
          .attr("width", d => x(d.year2))
          .attr("fill", "black")
          .attr("transform", `translate(0, +3)`)
          .attr("title", d => formatDecimal(d.year2))
          .attr("date", d => d.title)


const delta_rel = [];
const delta_abs = [];


 for (all of data) {
    delta_abs.push(all.year2 - all.year1);
    delta_rel.push((all.year2 / all.year1 - 1) * 100);
  }

let total = 0;
let totalEst = 0;

for (let i = 0; i < data.length; i++) {
    total += parseInt(data[i].year2);
    totalEst += parseInt(data[i].year1); 
}

//BAR ABS AXIS
    chart
        .append("line")
          .attr("x1", barAbsPos + 1.5)
          .attr("y1", margin.top)
          .attr("x2", `${barAbsPos + 1.5}px`)
          .attr("y2", totalsPos + y.bandwidth() * 2.5)
          .attr("class", "yAbsRel");

          
    chart
        .append("line")
          .attr("x1", barAbsPos - 1.5)
          .attr("y1", margin.top)
          .attr("x2", `${barAbsPos - 1.5}px`)
          .attr("y2", totalsPos + y.bandwidth() * 2.5)
          .attr("class", "yAbsRel");
          

//BAR REL AXIS

    chart
        .append("line")
          .attr("x1", barRelPos + 1.5)
          .attr("y1", margin.top)
          .attr("x2", barRelPos + 1.5)
          .attr("y2", totalsPos + y.bandwidth() * 2.5)
          .attr("class", "yAbsRel");

        chart
        .append("line")
          .attr("x1", barRelPos - 1.5)
          .attr("y1", margin.top)
          .attr("x2", barRelPos - 1.5)
          .attr("y2", totalsPos + y.bandwidth() * 2.5)
          .attr("class", "yAbsRel");

//////////////// DELTA-ABSOLUTE //////////////////////////////////////

  chart.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("class", "rect")
      .attr("fill", (d, i) => (d.year2 - d.year1) < 0 ? "#E73835" : "#85AD39")
      .attr("x", d => barAbsPos + xScale(Math.min(d.year2 - d.year1, 0)))
      .attr("y", (d, i) => yScale(i))
      .attr("width", d => Math.abs(xScale(d.year2 - d.year1) - xScale(0)))
      .attr("height", y.bandwidth())
      .attr("title", d => formatDecimal(d.year2 - d.year1))
      .attr("date", d => d.title)
      .on("mouseover", d => tooltiiip = '.top')
      .on("mouseout",  d => tooltiiip = '.yoo');

/// DELTA-ABS TEXT
chart
  .append("g")
  .selectAll("text")
  .data(delta_abs)
  .join("text")
  .text((d) => (Math.round(d) < 0 ? Math.round(d) : `+${Math.round(d)}` ))//(d) => Math.round(d))
    .attr("class", d => d < 0 ? "negative" : "positive")
    .attr("x", function (d) {
       if (xScale(d) > 0 ){
            return `${xScale((Math.round(d)) - xScale(0)) + barAbsPos + 3}` 
      }else {   // d < 0
          return `${(xScale(Math.min(Math.round(d))) - xScale(0)) + barAbsPos - 3}`
      }})
    .attr("y", (d, i) => yScale(i) + y.bandwidth()/2);

//////////////// DELTA-RELATIVE//////////////////////////////////////
/// DELTA RELATIVE BOX

chart
  .append("g")
  .selectAll("rect")
  .data(data)
  .join("rect")
              .attr("x", d => (xScale(Math.round((d.year2 / d.year1 - 1) * 100))) < 50 ? `${xScale(Math.round((d.year2 / d.year1 - 1) * 100)) - xScale(0) + barRelPos - 5}` : `${barRelPos + 45}`)
              .attr("y", (d, i) => yScale(i) + y.bandwidth() /2 - 6)
              .attr("width", 10)
              .attr("height", 10)
              .attr("fill", "#323233");


/// DELTA RELATIVE LINES
  
  chart.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("class", "rect")
      .attr("fill", (d, i) => (d.year2 - d.year1) < 0 ? "#E73835" : "#85AD39")
      .attr("x", d => barRelPos + xScale(Math.min(Math.round((d.year2 / d.year1 - 1) * 100), 0)))
      .attr("y", (d, i) => yScale(i) + y.bandwidth() / 2 - 3)
      .attr("width", d => (xScale(Math.round((d.year2 / d.year1 - 1) * 100))) < 50 ? `${Math.abs(xScale(Math.round((d.year2 / d.year1 - 1) * 100)) - xScale(0))}` : 50)
      .attr("height", 5)
      .attr("title", d => formatPercent(d.year2 / d.year1 - 1))
      .attr("date", d => d.title);

//// DELTA RELATIVE TEXT

chart
  .append("g")
  .selectAll("text")
  .data(delta_rel)
  .join("text")
  .text((d) => (Math.round(d) < 0 ? Math.round(d) : `+${Math.round(d)}` ))
    .attr("class", d => d < 0 ? "negative" : "positive")
    .attr("x", function(d){
       if (xScale(d) > 0  &&  xScale(d) < 50){
            return `${xScale((Math.round(d)) - xScale(0)) + barRelPos + 6 + 3}` 
      }else if (xScale(d) > 0 && xScale(d) > 50){
            return `${barRelPos + 60}`
      }else {   // d < 0
          return `${(xScale(Math.min(Math.round(d))) - xScale(0)) + barRelPos - 6 - 3}`
      }
      })
    .attr("y", (d, i) => yScale(i) + y.bandwidth() / 2)
    .style("alignment-baseline", "central");


////////////////// TOTALS ////////////////////////////
// TOTAL DELTA ABS

const totalAbs = total - totalEst;

  svg
    .append("rect")
      .attr("class", "rect")
      .attr("fill", (d, i) => (totalAbs) < 0 ? "#E73835" : "#85AD39")
      .attr("x", d => barAbsPos + xScale(Math.min(totalAbs, 0)))
      .attr("y", totalsPos)
      .attr("width", d => Math.abs(xScale(totalAbs) - xScale(0)))
      .attr("height", y.bandwidth())
      .attr("title", d => totalAbs)
      .attr("date", "Total Difference");

  // TOTAL ABS TEXT
    svg
      .append("text")
      .text(totalAbs)
      .attr("class", d => totalAbs > 0 ? "total positive" : "total negative")
      .attr("x", d => totalAbs < 0 ? `${barAbsPos + xScale(totalAbs) - 3 }` : `${barAbsPos + xScale(totalAbs) + 3}` )
      .attr("y", totalsPos + y.bandwidth() / 2);


//TOTAL REL
const totalRel = parseInt((total / totalEst - 1) * 100)

svg
  .append("rect")
              .attr("fill", "#323233")
              .attr("x", barRelPos + xScale(totalRel - 2))
              .attr("y", totalsPos + y.bandwidth() / 2 - 3)
              .attr("width", 10)
              .attr("height", 10);

  svg
    .append("rect")
      .attr("class", "rect")
      .attr("fill", (d, i) => (totalRel) < 0 ? "#E73835" : "#85AD39")
      .attr("x", d => barRelPos + xScale(Math.min(totalRel, 0)))
      .attr("y", totalsPos + y.bandwidth() / 2)
      .attr("width", d => Math.abs(xScale(totalRel) - xScale(0)))
      .attr("height", 5)
      .attr("title", d => formatPercent(totalRel/100))
      .attr("date", "Total Difference in %");

// TOTAL REL TEXT 
    svg
      .append("text")
      .text(totalRel)
      .attr("class", d => totalRel < 0 ? "total negative" : "total positive")
      .attr("x", d => totalRel < 0 ? `${barRelPos + xScale(totalRel) - 6 - 3 }` : `${barRelPos + xScale(totalRel) + 6 + 3}` )
      .attr("y", totalsPos + y.bandwidth() / 2 + 2);


// LOCATION
    svg
      .append("text")
      .text("USA")
        .attr("class", "positive total")
        .attr("x", 15)
        .attr("y", totalsPos + y.bandwidth() / 2)

/// TOTAL TEXTS
    svg
      .append("text")
      .text(total)
      .attr("class", "positive total")
      .attr("x", margin.left + 10)
      .attr("y",totalsPos + y.bandwidth() / 2)



// LINES
// Y-AXIS LINE
    chart
        .append("line")
        .attr("x1", margin.left)
        .attr("y1", margin.top)
        .attr("x2", margin.left)
        .attr("y2", totalsPos + y.bandwidth() * 2.5)
        .attr("class", "yAbsRel");

// TOTAL 2015 LINE
    chart
        .append("line")
          .attr("x1", 10)
          .attr("y1", totalLinePos)
          .attr("x2", width - 10)
          .attr("y2", totalLinePos)
          .attr("class", "yAbsRel");


 for (let i = 1; i < data.length; i++){
    chart
        .append("line")
          .attr("x1", 10)
          .attr("y1", yScale(i) - y.bandwidth()/3)
          .attr("x2", width - 10)
          .attr("y2", yScale(i) - y.bandwidth()/3)
          .attr("stroke-width", "0.1px")
          .attr("stroke", "black");
    }


/////////////////////////// TEXTS ////////////////////////////////
    svg
      .append("text")
      .text("PL")
      .attr("x", x(data[1].year1) / 2 + margin.left)
      .attr("font-weight", 700)
      .attr("y", margin.top)

    svg
      .append("text")
      .text("△PL")
      .attr("font-weight", 700)
      .attr("x", barAbsPos + 5)
      .attr("y", margin.top)

    svg
      .append("text")
      .text("△PL%")
      .attr("font-weight", 700)
      .attr("x", barRelPos + 5)
      .attr("y", margin.top)

    chart
      .append("text")
      .text("AC")
      .attr("font-weight", 700)
      .style("alignment-baseline", "hanging")
      .attr("x", xScale(data[18].year1) / 2 + margin.left)
      .attr("y", yScale(data.length - 1) + y.bandwidth() + 5);

/////////////////////// TOOLTIP /////////////////////////////////
$(document).ready(function(){
  tippy('.rect', {   
                arrow: true,
                //placement: 'top',
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
                    },
          });
});

});    

d3.select(window).on("resize", () => location.reload());