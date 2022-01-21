// Get Company Name
const companyName = document.getElementById("compName").innerText;
// Append Chart to HTML
const svg = d3.select("#chart-container").append("svg");
//const force = d3.forceSimulation();
// Clear SVG canvas
svg.selectAll("*").remove();
// Set Responsive Width & Height Outer Margins
const width = window.innerWidth * 0.95, height = window.innerHeight * 0.90;
svg.attr("width", width).attr("height", height);
// Set Margins
const margin = {top: height/20, right: width/20, bottom: height/20, left: width/20};
const widthIn = width-margin.right-margin.left,
      heightIn = height-margin.top-margin.bottom;
// Horizontal Bars distance
const padding = 0.4;
// Format Numbers to Display
const formatDecimal = d3.format(",.3f");
const formatPercent = d3.format(".0%");

//Get Data
d3.csv("data.csv").then(function(data) {
// Set Chart Positions
const charWidth = height / 150; // wid
const PLposition = margin.left + charWidth * 30;// 30 is the number of characters of the longest title (- Profit to other interests)
const ACposition = PLposition + widthIn * 0.20 + widthIn * 0.05; // 
const barAbsPos = ACposition + widthIn * 0.25 + widthIn * 0.10;
const barRelPos = width - margin.right - + widthIn * 0.10;

// Draw Waterfall Chart
const drawWaterfall = (data) => {
// Scale Data
  const y = d3.scaleBand()
  y.domain(data.map(d => d.title))
  .rangeRound([margin.top, height - margin.bottom])
  .padding(padding);

  const x = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.end_year1)])
  .range([0, widthIn*0.20]);

  // Create Chart Container SVG group
  const chart = svg.append("g").attr("class", "chart")
  const yAxis = chart.append('g').attr('id', 'y-axis')
// Y-Axis TEXT
  yAxis
  .append("g").attr('id', 'y-axis-text')
  .selectAll("text")
  .data(data)
  .join("text")
    .text(d => d.title)
    .attr("x", 0)
    .attr("y", (d, i) => y(d.title) + y.bandwidth() / (1 + padding))
      .attr("id", (d, i) => `title${i}`)
      .attr("alignment-baseline", "baseline");

// Draw Y-Axes 
  const Ys = yAxis.append('g').attr('id', 'y-axes')
  function drawYAxis(position, id){
    Ys
    .append("line")
      .attr("x1", `${position}px`).attr("y1", margin.top)
      .attr("x2", `${position}px`).attr("y2", height - margin.bottom)
      .attr('class', 'y-axis');
  }
  drawYAxis(PLposition); drawYAxis(ACposition); drawYAxis(barAbsPos); drawYAxis(barRelPos);

  const bar = chart.append('g').attr('id', 'bars').selectAll('.bar')
    .data(data)
    .enter().append('g')
    .attr('id', d => `${d.title}`)
    .attr('class', d => `bar ${ d.class }`)
    .attr('transform', d => `translate(0, ${y(d.title)-1})`);

// Chart "Blueprint" functions 
  //Bars "Blueprint"
  function drawBars(position, year, color) {
    bar
    .append('rect')
      .attr("class", d => `${d.title} year${year} tooltip`)
      .attr('x', d => x(Math.min(eval(`d.start_year${year}`) , eval(`d.end_year${year}`))))
      .attr('width', d =>  Math.abs(x(eval(`d.end_year${year}`)) - x(eval(`d.start_year${year}`))))
      .attr('height', y.bandwidth())
      .attr("fill", d => color)
      .attr("title", d =>  d.title == '- Operating expenses' ? formatDecimal(eval(`d.end_year${year}`) - eval(`d.start_year${year}`)) : formatDecimal(eval(`d.year${year}`)))
      .attr("date", d => d.title)
      .attr("transform", "translate(" + position + ",0)");;
  }
  
  // Text "Blueprint"
  function appendText( position, year) {
    bar
    .append('text')
      .attr("class", d => `${d.title} barText`)
      .attr('y', y.bandwidth() / 2 +1)
      .attr('x', d => d.class === 'total' ? position  + x(eval(`d.start_year${year}`)) : position  + x(eval(`d.end_year${year}`)))
      .text(d => d.class === 'total' ? (eval(`d.start_year${year}`) - eval(`d.end_year${year}`)) : (eval(`d.end_year${year}`) - eval(`d.start_year${year}`)));
  }
  // Connecting Bars "Blueprint"
  function connectBars(position, year) {
    bar
    .filter((d, i) => i !== data.length - 1)
    .append('line')
      .attr('class', 'connector')
      .attr('y1', 0)
      .attr('x1', d => d.class === 'total' ? x(eval(`d.start_year${year}`)) : x(eval(`d.end_year${year}`)))
      .attr('y2', (y.bandwidth() / (1 - padding)) + y.bandwidth())
      .attr('x2', d => d.class === 'total' ? x(eval(`d.start_year${year}`)) : x(eval(`d.end_year${year}`)))
      .attr("transform", `translate(${position},0)`);
  }

  function connectSumBars(position, year) {
    d3.select('#bars')
    .append("line")
      .attr('class', 'SUMconnectors')
      .attr("x1", position + x(eval(`data[6].start_year${year}`)))
      .attr("x2", position + x(eval(`data[6].start_year${year}`)))
      .attr("y1", 7 * (y.bandwidth() / (1 - padding)) + y.bandwidth())
      .attr("y2", 12 * (y.bandwidth() / (1 - padding)) + y.bandwidth());
  }
// DRAW PL,AC CHARTS
  // Draw PL Chart
  drawBars(PLposition, 1, 'white');
  appendText(PLposition, 1);
  connectBars(PLposition, 1);
  connectSumBars(PLposition, 1);

  // Draw AC Chart
  drawBars(ACposition, 2, `d.year2` > 0 ? "rgb(89, 89, 89)" : "black");
  appendText(ACposition, 2);
  connectBars(ACposition, 2);
  connectSumBars(ACposition, 2);


///Delta-Absolute CHART
  // Draw Delta-Absolute BARS
  bar
  .append('rect')
    .attr('x', d => barAbsPos + x(Math.min(d.start_year2 - d.start_year1, d.end_year2 - d.end_year1)))
    .attr('width', d => Math.abs(x(d.end_year2 - d.end_year1) - x(d.start_year2 - d.start_year1)))
    .attr('height', y.bandwidth())
    .attr("class", "tooltip")
    .attr("fill", d => d.year2 - d.year1 < 0 ? "#E73835" : "#85AD39")
    .attr("title", d => d.title == '- Operating expenses' ? formatDecimal((d.end_year2 - d.end_year1) - (d.start_year2 - d.start_year1)) : formatDecimal(d.year2 - d.year1))
    .attr("date", d => d.title);

  // Delta-Absolute TEXT
  bar
  .append('text')
    .attr('y', y.bandwidth() / 2 +1)
    .attr('x', d => {    
        if (d.class == 'total') {
          return barAbsPos + x(d.start_year2 - d.start_year1) + 5;
        } else if ((d.start_year2 - d.start_year1) - (d.end_year2 - d.end_year1) > 0 && d.class != 'total') {
          return barAbsPos + x(d.end_year2 - d.end_year1) - 5;
        } else {
          return barAbsPos + x(d.end_year2 - d.end_year1) + 5;
        }
    })
    .text(d => d.class === 'total' ? ((d.start_year2 - d.start_year1) - (d.end_year2 - d.end_year1)) : ((d.end_year2 - d.end_year1) - (d.start_year2 - d.start_year1)))
    .attr("class", "barText")
    .attr("class", d =>  (d.start_year2 - d.start_year1) - (d.end_year2 - d.end_year1) > 0 && d.class != 'total' ? "negative" : "positive");

  // Delta-Absolute Connect LINES
  bar
    .filter((d, i) => i !== data.length - 1)
    .append('line')
    .attr('class', 'connector')
    .attr('y1',  y.bandwidth())
    .attr('x1', d => d.class === 'total' ? barAbsPos + x(d.start_year2 - d.start_year1) : barAbsPos + x(d.end_year2 - d.end_year1))
    .attr('y2', (y.bandwidth() / (1 - padding)) + y.bandwidth())
    .attr('x2', d =>  d.class === 'total' ? barAbsPos + x(d.start_year2 - d.start_year1) : barAbsPos + x(d.end_year2 - d.end_year1));
  // Delta-Absolute Total LINES
  d3.select('#bars')
  .append("line")
    .attr('class', 'SUMconnectors')
    .attr("x1", barAbsPos + x(data[6].start_year2 - data[6].start_year1))
    .attr("x2", barAbsPos + x(data[11].start_year2 - data[6].start_year1))
    .attr("y1", 7 * (y.bandwidth() / (1 - padding)) + y.bandwidth())
    .attr("y2", 12 * (y.bandwidth() / (1 - padding)) + y.bandwidth());
    
/// Delta-Relative CHART
  // Delta-Relative BOX
  const rel = chart.append('g').attr('id', 'delta-relative')
  rel
  .append("g")
  .selectAll("rect")
  .data(data)
  .join("rect")
    .attr("fill", "#323233")
    .attr("x", d => (x(Math.round((d.year2 / d.year1 - 1) * 100))) < 50 ? `${x(Math.round((d.year2 / d.year1 - 1) * 100)) - x(0) + barRelPos - 5}` : `${barRelPos + 45}`)
    .attr("y", (d, i) => y(d.title) + y.bandwidth() / 2 - 4)
    .attr("width", 10).attr("height", 10);

  // Delta-Relative BARS
  rel.append("g").attr('id', 'delta-relative-bars')
  .selectAll("rect")
  .data(data)
  .join("rect")
    .attr("title", d => formatPercent(d.year2 / d.year1 - 1))
    .attr("date", d => d.title)
    .attr("class", "tooltip")
    .attr("fill", (d, i) => (d.year2 - d.year1) < 0 ? "#E73835" : "#85AD39")
    .attr("x", d => barRelPos + x(Math.min(Math.round((d.year2 / d.year1 - 1) * 100), 0)))
    .attr("y", (d, i) => y(d.title) + y.bandwidth() / 2)
    .attr("width", d => (x(Math.round((d.year2 / d.year1 - 1) * 100))) < 50 ? `${Math.abs(x(Math.round((d.year2 / d.year1 - 1) * 100)) - x(0))}` : 50)
    .attr("height", 3);

  // Delta-Relative TEXT
  // Initialize Delta-Relative Data
  const delta_rel = [];
  for (all of data) {
    delta_rel.push((all.year2 / all.year1 - 1) * 100);
  }
  y.domain(d3.range(20))
  rel
  .append("g").attr('id', 'text')
  .selectAll("text")
  .data(delta_rel)
  .join("text")
    .attr("class", "bar-text")
    .attr("class", d => d < 0 ? "negative" : "positive")
    .text((d) => (Math.round(d) < 0 ? `${Math.round(d)}%` : `+${Math.round(d)}%` ))
    .attr("x", function(d){
          if (x(d) > 0  &&  x(d) < 50) {
      return x((Math.round(d)) - x(0)) + barRelPos + 10;
          }else if (x(d) > 0 && x(d) > 50){
      return barRelPos + 60;
          }else { 
      return (x(Math.min(Math.round(d))) - x(0)) + barRelPos - 10;
          }
        })
    .attr("y", (d, i) => y(i) + y.bandwidth() / 2);

  rel
  .append("g").attr('id', 'arrows')
  .selectAll("text")
  .data(data)
  .join("text")
    .attr("class", "barText")
    .text("▶")
    .attr("x", barRelPos + 60 + charWidth * 7)
    .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
    .attr("fill", function (d, i) {
      if (x(d.year2 - d.year1) < 0 && x((d.year2 / d.year1 - 1) * 100) > 50) {
        return "#E73835"; 
      }else if (x((d.year2 / d.year1 - 1) * 100) > 50 && ((d.year2 / d.year1 - 1) * 100) > 0){
        return "#85AD39";
      }else{
        return "white"
      }});

/// Draw Horizontal Lines
  const hLine = chart.append('g').attr('id', 'horizontal-line')
  function drawHorizontalLine(index){
    const halfPadding = (y.bandwidth() * (1 - padding)) / 2 +2;
    hLine
    .append("line")
      .attr("x1",  - margin.left  - 2)
      .attr("x2", width - margin.right +2)
      .attr("y1", y(index) - halfPadding)
      .attr("y2", y(index) - halfPadding)
      .attr("class", "divLine");
  }
drawHorizontalLine(4); drawHorizontalLine(11); drawHorizontalLine(12); drawHorizontalLine(15); drawHorizontalLine(17); drawHorizontalLine(19);

//BAR TEXTS
const labels = chart.append('g').attr('id', 'labels');
labels
.append("text")
.text("PL")
.attr("x", ((ACposition - PLposition) / 2) + PLposition) 
.attr("y", margin.top);
labels
.append("text")
.text("AC")
.attr("x", (barAbsPos - ACposition) / 2 + ACposition)
.attr("y", margin.top);
labels
.append("text")
.text("△PY")
.attr("x", barAbsPos + 5)
.attr("y", margin.top);
labels
.append("text")
.text("△PY%")
.attr("x", barRelPos +5)
.attr("y", margin.top);

}; // drawWaterfall
/// Tooltip
$(document).ready(function(){
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
            let date = reference.getAttribute('date');
            date.charAt(0) == "=" || date.charAt(0) == "+" || date.charAt(0) == "-" ? date = date.substring(1) : "";
            let fill = reference.getAttribute('fill');
            return `<style>
                      .tippy-tooltip.custom-theme {
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
// Transform Data 
const prepData = (data) => {
  // Create Remainder Bars
  const insertRemainderAfter = (dataName, newDataName) => {
    const index = data.findIndex((datum) => {
      return datum.title === dataName;
    }); 
    // Create Remainder 'Blueprint'
    return data.splice(index + 1, 0, {
          title: newDataName,
          start_year1: `${data[index].end_year1}`,
          start_year2: `${data[index].end_year2}`,
          end_year1: `${0}`,
          end_year2: `${0}`,
          year1: `${data[index].end_year1}`, 
          year2: `${data[index].end_year2}`,
          class: 'total'
    });
  }; 
  // Transform Data by Adding 'start_year' , 'end_year' to dataset
  let cumulative = 0;
  data.map((datum) => {
    datum.start_year1 = cumulative;
    cumulative += parseInt(datum.year1);
    datum.end_year1 = cumulative;
    return datum.class = datum.year1 >= 0 ? 'positive' : 'negative';
  });
  let cumulate = 0;
  data.map((datum) => {
    datum.start_year2 = cumulate;
    cumulate += parseInt(datum.year2);
    datum.end_year2 = cumulate;
    return datum.class = datum.year2 >= 0 ? 'positive' : 'negative';
  });
  // Adding Total Data to Dataset
  data.splice(10,0, {
    title: '- Operating expenses',
    year1: `${data[5].start_year1}`, 
    year2: `${data[5].start_year2}`,
    start_year1: `${data[5].start_year1}`,
    end_year1: `${data[9].end_year1}`,
    start_year2: `${data[5].start_year2}`,
    end_year2: `${data[9].end_year2}`,
    class: 'negative'
  });
  // Adding Remainder Data to Dataset
  insertRemainderAfter('Other revenue', '= Sales revenue');
  insertRemainderAfter('- Operating expenses', '= Operating result'); 
  insertRemainderAfter('+ Financial income net', '= Result before tax');
  insertRemainderAfter('- Income tax', '= Result after tax');
  insertRemainderAfter('- Profit to other interests', '= Group result');

  console.log(data);
  return drawWaterfall(data);

};
return prepData(data);
});    
d3.select(window).on("resize", () => location.reload());