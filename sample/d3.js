const data = [
	{month: '02', thisYear: 60, lastYear: 10, PY: 320.452},
	{month: '03', thisYear: 50, lastYear: 20, PY: 220.22},
	{month: '04', thisYear: 40, lastYear: 30, PY: 250.001},
	{month: '05', thisYear: 30, lastYear: 40, PY: 200.65215621},
	{month: '06', thisYear: 20, lastYear: 50, PY: 205.56},
	{month: '07', thisYear: 10, lastYear: 60, PY: 300.65},
	{month: '08', thisYear: 1, lastYear: 45, PY: 230.12},
	{month: '09', thisYear: -10, lastYear: 35, PY: 320.321},
	{month: '10', thisYear: -20, lastYear: 25, PY: 210.87},
	{month: '11', thisYear: -30, lastYear: 15, PY: 305.6987},
	{month: '12', thisYear: -40, lastYear: 5, PY: 200.44},
	{month: '01', thisYear: -50, lastYear: 2, PY: 360.3256}
	];

const svg = d3.select('.chart-container').append('svg').attr('id', 'chart-container');
const width = window.innerWidth * 0.75, 
      height = window.innerHeight * 0.8;
      margin = 30;

d3.select('#chart-container').attr('width', width);
d3.select('#chart-container').attr('height', height);
      
// x-Scale Data for PL
const x = d3.scaleBand()
    .domain(data.map( d => d.month))
    .range([0, width/2 - margin * 2])
    .padding(0.4);

const y = d3.scaleLinear()
    .domain([-50, d3.max(data, d => d.lastYear)])
    .range([ height - margin, margin]);

// Create Chart Container
const chart = svg.append('g').attr('id', 'chart')
    .attr('transform', 'translate(' + margin + ',0)');

var tooltip = d3.select("body").append("div").attr('id', 'tooltip')
    // Bar Chart
    chart
    .append("g")
    .attr("id", "bar-chart")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
        .attr("x", d => x(d.month))
        .attr("y", d => y(d.lastYear))
        .attr("height", d => y(0) - y(d.lastYear))
        .attr("width", x.bandwidth())
        // .on("mouseover", function(d) {		
        //     tooltip.transition()		
        //         .duration(200)		
        //         .style("opacity", .9);		
        //     tooltip.html(d.lastYear)	
        //         .style("left", (event.pageX) + "px")		
        //         .style("top", (event.pageY) + "px");	
        //     })					
        // .on("mouseout", function(d)  {		
        //     tooltip.transition()		
        //         .duration(500)		
        //         .style("opacity", 0);	
        //     });

    
    // Negative Chart
    chart
    .append("g")
    .attr("id", "delta-absolute-chart")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
        .attr("class", "delta-absolute-chart")
        .attr("x", d => x(d.month))
        .attr("y", d => d.thisYear > 0 ? Math.abs(y(d.thisYear)) : y(0))
        .attr("height", d =>  Math.abs(y(0) - y(d.thisYear)))
        .attr("width", x.bandwidth())
        .attr('transform', 'translate(' + width/2 + ',0)');
        // .on("mouseover", function(d) {		
        //     tooltip.transition()		
        //         .duration(200)		
        //         .style("opacity", .9);		
        //     tooltip.html(d.thisYear)	
        //         .style("left", (event.pageX) + "px")		
        //         .style("top", (event.pageY) + "px");	
        //     })					
        // .on("mouseout", function(d)  {		
        //     tooltip.transition()		
        //         .duration(500)		
        //         .style("opacity", 0);	
        //     });

    const axes = chart.append('g').attr('id', 'axes');
    // Add Y-Axis
    axes.append("g")
    .call(d3.axisLeft(y));

    // Add Y-Grid
    const yAxisGrid = d3.axisRight(y).tickSize(width-margin*2).tickFormat('').ticks(10);   
    axes.append('g')
    .attr('class', 'y axis-grid')
    .call(yAxisGrid);

    tippy('rect', {
        
        delay: 100,
        arrow: true,
        arrowType: 'sharp',
        size: 'large',
        duration: 500,
        animation: 'scale',
        hideOnClick: false,
        placement: 'right',
        theme: 'light',
        allowHTML: true,
			content(reference) {
				//const title = reference.getAttribute('title');
				//const date = reference.getAttribute('date');
				//let fill = reference.getAttribute('fill');
				return `<p style="color: grey;">csá</p> 
				<p><span style="font-size: 18px;color: red;"> ● </span>:  <strong>hello</strong></p>`
            },
      });
    // Tooltip
    // tippy('.delta-absolute-chart', {
    //     content: 'tooltip',
    //     arrow: document.getElementById('tooltip'),
    //     interactive: true
    // });
    
    //     tooltip
        
    //         .style("position", "absolute")
    //         .style("visibility", "hidden")
    //         .text('tooltip');

    // d3.selectAll(".delta-absolute-chart")
            
    //         .on("mousemove", d => tooltip.style("top", (event.pageY-80)+"px").style("left",(event.pageX)+"px"))
    //         .on("mouseout", d => tooltip.style("visibility", "hidden"));
    // $(document).ready(function(){
    //     $(".delta-absolute-chart").tooltip({
    //         placement:"top"
    //     });               
    // });
    svg.style('border', '1px solid gray')
  
