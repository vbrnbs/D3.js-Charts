// Append Chart to HTML
const svg = d3.select("#chart-container").append("svg");  

// Get Data
d3.csv("data.csv").then(function(data) {
  
// Clear SVG Canvas
  svg.selectAll("*").remove();
// Set Inner Width & Height
  const width = window.innerWidth * 0.95, height = window.innerHeight * 0.95;
  svg.attr("width", width).attr("height", height);

// Initialize Variables
  const companyName = document.getElementById("compName").innerText,
  hPix = height / 5,
  barAbsPos = width * 0.7,
  barRelPos = width * 0.9,
  fontSize = window.innerHeight/150,
  margin = {top: height/20, right: hPix, bottom: height / 6, left: fontSize* 25},
  delta_rel = data.map((datum) => (datum.year2 / datum.year1 - 1) * 100),
  delta_abs = data.map((datum) => datum.year2 - datum.year1),
  total = d3.sum(data, d => d.year2),
  totalEst = d3.sum(data, d => d.year1),
  totalAbs = total - totalEst,
  totalRel = (total / totalEst - 1) * 100;


// Format Data
  const formatDecimal = d3.format(",.3f");
  const formatPercent = d3.format(".0%");

// Scale Data
  // x
  const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.year1)])
      .range([0, width / 7]);
  // y
  const y = d3.scaleBand()
      .domain(d3.range(data.length+1))
      .rangeRound([margin.top, height - margin.bottom])
      .padding(0.4)

// Totol Bars Position
  const totalLinePos = y(data.length) + y.bandwidth()/2;
  const totalsPos = totalLinePos + y.bandwidth()/2;

// Draw CHART
  const chart = svg.append("g").attr("class", "chart");

// Y-AXES
  // Y-Axis TEXT
  chart
  .append("g")
  .attr('id', 'y-axis')
  .selectAll("text")
  .data(data)
  .join("text")
  .text((d) => d.title)
    .attr("x", 15)
    .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
    .style("alignment-baseline", "central");
  // Variance BAR AXIS
  const yAxis = chart.append('g').attr('id', 'variance-y-axis');
  // Axis "Blueprint"
  function drawYaxis(position) {
    yAxis
    .append("line")
      .attr("class", 'y-axis' )
      .attr("x1", position + 1.5)
      .attr("y1", margin.top)
      .attr("x2", position + 1.5)
      .attr("y2", totalsPos + y.bandwidth() * 2.5);   
  }
  // Draw Axes
  drawYaxis(margin.left - 1.5)
  drawYaxis(barAbsPos); drawYaxis(barAbsPos - 3);
  drawYaxis(barRelPos); drawYaxis(barRelPos - 3);

// Create 'BAR' Container
  const bar = chart.append('g').attr('id', 'bars').selectAll('.bar')
      .data(data)
      .enter().append('g')
      .attr('id', d => `${d.title}`);

// AC PL BARS "Blueprint"
function drawBars(type, year) {
  bar
  .append("rect")
    .attr('class', `${type}-bar tooltip`)
    .attr("x", margin.left)
    .attr("height", y.bandwidth())
    .attr("y", (d, i) => y(i))
    .attr("width", d => x(eval(`d.year${year}`)))
    .attr("title", d => formatDecimal(eval(`d.year${year}`)))
    .attr("date", d => d.title)
    .attr("fill", () => type == 'AC' ? 'black' : 'white');
}
// Draw BARS
drawBars('PL', 1); drawBars('AC', 2);

// Year 1 TEXT BACKGROUND
  const txt = bar.append('g').attr('class', 'AC-text');
  txt
  .append('rect')
    .attr("x", d => x(d.year2) + margin.left)
    .attr("y", (d, i) => y(i) + y.bandwidth() * 0.2)
    .attr("width", 20)
    .attr("height", y.bandwidth());

  // Year 1 TEXT    
  txt
  .append('text')
  .text((d) => Math.round(d.year2))
    .attr("x", d => x(d.year2) + margin.left + 3)
    .attr("y", (d, i) => y(i) + y.bandwidth() / 2 + 3)
    .style("alignment-baseline", "central");

/// Delta-Absolute
  // Delta-Absolute BARS
  bar
  .append('rect')
      .attr("class", "delta-absolute-bar tooltip")
      .attr("fill", (d, i) => (d.year2 - d.year1) < 0 ? "#E73835" : "#85AD39")
      .attr("x", d => barAbsPos + x(Math.min(d.year2 - d.year1, 0)))
      .attr("y", (d, i) => y(i))
      .attr("width", d => Math.abs(x(d.year2 - d.year1) - x(0)))
      .attr("height", y.bandwidth())
      .attr("title", d => formatDecimal(d.year2 - d.year1))
      .attr("date", d => d.title);
  // Delta-Absolute TEXT
  bar
  .data(delta_abs)
  .append("text")
  .text((d) => (Math.round(d) < 0 ? Math.round(d) : `+${Math.round(d)}` ))
    .attr("class", d => d < 0 ? "delta-aboslute-text negative" : "delta-aboslute-text positive")
    .attr("x", function (d) {
       if (x(d) > 0 ){
            return `${x((Math.round(d)) - x(0)) + barAbsPos + 3}` 
      }else {   // d < 0
          return `${(x(Math.min(Math.round(d))) - x(0)) + barAbsPos - 3}`
      }})
    .attr("y", (d, i) => y(i) + y.bandwidth()/2);

/// Delta-Relative 
 // Delta-Relative BOX
  bar
  .data(data)
  .append("rect")
    .attr('class', 'delta-realtive-box')
    .attr("x", d => (x(Math.round((d.year2 / d.year1 - 1) * 100))) < 50 ? `${x(Math.round((d.year2 / d.year1 - 1) * 100)) - x(0) + barRelPos - 5}` : `${barRelPos + 45}`)
    .attr("y", (d, i) => y(i) + y.bandwidth() /2 - 6);
  // Delta-Relative BARS
  bar
  .append('rect')
      .attr("class", "delta-relative-bar tooltip")
      .attr("fill", (d, i) => (d.year2 - d.year1) < 0 ? "#E73835" : "#85AD39")
      .attr("x", d => barRelPos + x(Math.min(Math.round((d.year2 / d.year1 - 1) * 100), 0)))
      .attr("y", (d, i) => y(i) + y.bandwidth() / 2 - 3)
      .attr("width", d => (x(Math.round((d.year2 / d.year1 - 1) * 100))) < 50 ? `${Math.abs(x(Math.round((d.year2 / d.year1 - 1) * 100)) - x(0))}` : 50)
      .attr("height", 5)
      .attr("title", d => formatPercent(d.year2 / d.year1 - 1))
      .attr("date", d => d.title);
  // Delta-Relative TEXT
  bar
    .data(delta_rel)
    .append("text")
    .text((d) => (Math.round(d) < 0 ? Math.round(d) : `+${Math.round(d)}` ))
      .attr("class", d => d < 0 ? "delta-relatvie-text negative" : "delta-relatvie-text positive")
      .attr("x", function(d){
        if (x(d) > 0  &&  x(d) < 50){
              return `${x((Math.round(d)) - x(0)) + barRelPos + 6 + 3}` 
        }else if (x(d) > 0 && x(d) > 50){
              return `${barRelPos + 60}`
        }else {   // d < 0
            return `${(x(Math.min(Math.round(d))) - x(0)) + barRelPos - 6 - 3}`
        }})
      .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
      .style("alignment-baseline", "central");

/// Totals
// Delta-Absolute TOTAL BAR
const ttl = chart.append('g').attr('id', 'totals')
  ttl
  .append("rect")
    .attr('class', 'total-absolute-bar tooltip')
    .attr("fill", (d, i) => (totalAbs) < 0 ? "#E73835" : "#85AD39")
    .attr("x", d => barAbsPos + x(Math.min(totalAbs, 0)))
    .attr("y", totalsPos)
    .attr("width", d => Math.abs(x(totalAbs) - x(0)))
    .attr("height", y.bandwidth())
    .attr("title", formatDecimal(totalAbs))
    .attr("date", "Total Difference");
  // Delta-Absolute TEXT TOTAL
  ttl
  .append("text")
  .text(Math.round(totalAbs))
    .attr("class", d => totalAbs > 0 ? "total positive" : "total negative")
    .attr("x", d => totalAbs < 0 ? `${barAbsPos + x(totalAbs) - 3 }` : `${barAbsPos + x(totalAbs) + 3}` )
    .attr("y", totalsPos + y.bandwidth() / 2);
  // Delta-Relative BOX TOTAL
  ttl
  .append("rect")
    .attr("class", "delta-realtive-box")
    .attr("x", barRelPos + x(totalRel - 2))
    .attr("y", totalsPos + y.bandwidth() / 2 - 3);
  // Delta-Relatvie BAR TOTAL
  ttl
  .append("rect")
    .attr("class", "total-delta-relative-bar tooltip")
    .attr("fill", (d, i) => (totalRel) < 0 ? "#E73835" : "#85AD39")
    .attr("x", d => barRelPos + x(Math.min(totalRel, 0)))
    .attr("y", totalsPos + y.bandwidth() / 2)
    .attr("width", d => Math.abs(x(totalRel) - x(0)))
    .attr("height", 5)
    .attr("title", d => formatPercent(totalRel/100))
    .attr("date", "Total Difference in %");
  // Delta-Relatvie TEXT TOTAL
    ttl
    .append("text")
    .text(Math.round(totalRel))
      .attr("class", d => totalRel < 0 ? "total delta-relative-text negative" : "total delta-relative-text positive")
      .attr("x", d => totalRel < 0 ? `${barRelPos + x(totalRel) - 6 - 3 }` : `${barRelPos + x(totalRel) + 6 + 3}` )
      .attr("y", totalsPos + y.bandwidth() / 2 + 2);
  //AC TEXT TOTAL
  ttl
  .append("text")
  .text(Math.round(total))
    .attr("class", "positive total")
    .attr("x", margin.left + 10)
    .attr("y",totalsPos + y.bandwidth() / 2);
  // Y-Axis LOCATION TOTAL
    yAxis
    .append("text")
    .text("USA")
      .attr("class", "positive total")
      .attr("x", 15)
      .attr("y", totalsPos + y.bandwidth() / 2)
  
/// Horizontal Chart LINES
  for (let i = 1; i < data.length; i++){
    chart
        .append("line")
          .attr("x1", 10)
          .attr("y1", y(i) - y.bandwidth()/3)
          .attr("x2", width - 10)
          .attr("y2", y(i) - y.bandwidth()/3)
          .attr("stroke-width", "0.1px")
          .attr("stroke", "black");  
  }
  // Total LINE
  chart
  .append("line")
    .attr("x1", 10)
    .attr("y1", totalLinePos)
    .attr("x2", width - 10)
    .attr("y2", totalLinePos)
    .attr("class", "yAbsRel");

/// Chart TEXTs 'Blueprint'
  function appendChartText(string, xPos, yPos) {
    chart
    .append("text")
    .text(string)
      .attr("x", xPos)
      .attr("y", yPos);
  }
  // Append Chart TEXTs
  appendChartText('PL', x(data[0].year2) / 2 + margin.left, margin.top);
  appendChartText('AC', x(data[18].year1) / 2 + margin.left, y(data.length) + (totalLinePos - y(data.length)) / 2);
  appendChartText('△PY', barAbsPos + 5, margin.top);
  appendChartText('△PY%', barRelPos + 5, margin.top);

/////////////////////// TOOLTIP /////////////////////////////////
window.onload = (tooltip) => {
  tippy('.tooltip', {   
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
                    }, // content(refference)
          });// Tippy
};//Tooltip
});//Get Data
// Reload Page on Resize
d3.select(window).on("resize", () => location.reload());
