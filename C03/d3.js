const data = [

	{month: '2017.02', thisYear: 211.432, lastYear: 354.542, PY: 320.452},
	{month: '2017.03', thisYear: 217.585, lastYear: 413.548, PY: 220.22},
	{month: '2017.04', thisYear: 215.965, lastYear: 375.754, PY: 250.001},
	{month: '2017.05', thisYear: 326.432, lastYear: 249.542, PY: 200.65215621},
	{month: '2017.06', thisYear: 224.585, lastYear: 287.548, PY: 205.56},
	{month: '2017.07', thisYear: 182.965, lastYear: 250.754, PY: 300.65},
	{month: '2017.08', thisYear: 172.432, lastYear: 293.542, PY: 230.12},
	{month: '2017.09', thisYear: 288.585, lastYear: 216.548, PY: 320.321},
	{month: '2017.10', thisYear: 176.965, lastYear: 213.754, PY: 210.87},
	{month: '2017.11', thisYear: 296.432, lastYear: 227.542, PY: 305.6987},
	{month: '2017.12', thisYear: 215.585, lastYear: 392.548, PY: 200.44},
	{month: '2017.01', thisYear: 450.965, lastYear: 348.754, PY: 360.3256}
	
	];
	
// User Control
const fiscalMonth = 3; //1 = February, 12 = January(year next)
const thisYear= 2018, lastYear = 2017;

/// SETUP
const force = d3.forceSimulation();
const chart = d3.select('.chart-container').append('svg');

// ON LOAD
	function drawChart(){
		// Clear Canvas
		chart.selectAll("*").remove();
		// Set Width & Height
		const width = d3.select('svg').attr('width') * 0.95,
		height = d3.select('svg').attr('height') * 0.8;
		// Set Margins
		const hPix = height/5,
		margin = { top: hPix, bottom: hPix/100, left: hPix/5, right: hPix/2 };
		// Header Text
		d3.select('#headerText').style('margin-left', margin.left);
	
/// SCALING DATA
		// Chart Width Without Totals
		const xEdge = width - margin.right - width / 8;
		// x-Scale Data for PL
		const x = d3.scaleBand()
		.domain(data.map( d => d.month))
		.range([margin.left, xEdge])
		.padding(0.4);
		// x-Scale Data for Variances
		const xScale = d3.scaleBand()
		.domain(d3.range(data.length))
		.range([margin.left, xEdge])
		.padding(0.4);
		// y-Scale Data for PL
		const y = d3.scaleLinear()
		.domain([0, 550])
		.range([height - margin.bottom, height - height / 2]);
		// y-Scale Data for Variances
		const yScale = d3.scaleLinear()
		.domain([0, 550])
			.range([0, (height - margin.bottom - height / 2)]);
	
/// GLOBAL VARIABLES
		//Company Data
		const companyName = document.getElementById("compName").innerText;
		// Date & Number Formating
		const shortDate = d3.timeFormat("%m/%y");
		const longDate = d3.timeFormat("%m..");
		const formatDecimal = d3.format(",.3f");
		const formatPercent = d3.format(".0%");
		const fontSize = 12;
		// DATA initializations
		const delta_abs = [];
		for (all of data) {
			delta_abs.push(all.thisYear - all.lastYear);
		}
		let barWidth = Math.min(50, Math.max(0, x.bandwidth()));
		// Shift Amount of Last Year BARS
		let lastYearPos = x.bandwidth() / 5;
		// Increase total bar width
		const totalBarWidth = barWidth * 1.3;
		// Posititon of Total Bars
		const totalPos = width - margin.right - totalBarWidth;
		// Get Total Last Year
		const totalLastYear = d3.sum(data, d => d.lastYear);
		// Get Total until Fiscal Month
		const totalThisYear = d3.sum(data.slice(0, fiscalMonth), d => d.thisYear);
		// Get Total this year Estimated
		const totalThisYearEst = d3.sum(data, d => d.thisYear);
		// Get This Year Monthly Avarage
		const monthlyAvarage = d3.sum(data, d => d.thisYear) / data.length;
		// Initialize monthly avarage path
		let lineGenerator = d3.line();
		// Monthly Avarage Path points (fill)
		let points = [
			[margin.left, y(0)],
			[margin.left, y(monthlyAvarage)],
			[xEdge, y(monthlyAvarage)],
			[totalPos-barWidth/3, y(monthlyAvarage/10)],
			[width - margin.right + 10, y(monthlyAvarage/10)],
			[width - margin.right + 10, y(0)]
		];
		// Monthly Avarage Path points (line)
		let linePoints = points.slice(1,5);
		// Calculate Absolute and Relative Data
		let totalAbs = totalThisYearEst - totalLastYear;
		let totalRel = ( totalThisYearEst / totalLastYear -1 ) * 100;
		// This year / This year Estimated Difference Values
		const thisYearDiff = parseInt(y(0) - y(totalThisYearEst - totalThisYear))
		const absAxis = hPix * 0.7;
/// DRAW CHART
/// X-AXIS
		const xAxis = chart.append("g").attr("id", "x-axis");
		// Delta Relative AXIS
		xAxis.append('line')
			.attr("x1", margin.left)
			.attr("x2", width - margin.right)
			.attr("y1", margin.top)
			.attr("y2", margin.top)
			.attr("class", "diff_axis");
		// Delta Absolute AXIS
		xAxis.append('line')
			.attr("x1", margin.left)
			.attr("x2", width - margin.right)
			.attr("y1", margin.top + absAxis)
			.attr("y2", margin.top + absAxis)
			.attr("class", "diff_axis");
		// Axis TEXT 
		xAxis
		.append("g")
		.selectAll("text")
		.data(data)
		.join("text")
			.text((d) => width > 800 ? shortDate(new Date(d.month)) : longDate(new Date(d.month)))
			.attr("text-anchor", "middle")
			.attr("x", (d, i) => xScale(i) + x.bandwidth() /2)
			.attr("y", y(0) + 15)
			.classed("x_axis", true);
		// Axis TEXT AVARAGE SIGN
		xAxis
		.append("text")
		.text("Ø")
			.attr("text-anchor", "middle")
			.attr("x", totalPos + totalBarWidth/2)
			.attr("y", y(0) + 15)
			.style("fill", "grey");
		
/// LAST-YEAR BARS
		chart.append("g").attr("id", "last-year-chart")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("class", "lastYear")
			.attr("title", d => d.lastYear)
			.attr("date", d => d.month)
			.attr("x", (d, i) => x(d.month))
			.attr("y", d => y(d.lastYear))
			.attr("height", d => y(0) - y(d.lastYear))
			.attr("width", barWidth)
			.attr("transform", "translate("+ -lastYearPos +", 0)")
			.attr("fill", "white")
			.on("mouseover", () => d3.selectAll(".thisYear").style("opacity", 0.5))
			.on("mouseout", () => d3.selectAll(".thisYear").style("opacity", 1));

/// THIS-YEAR TEXT BACKGROUND
		chart.append("g").attr("id", "this-year-text-background")
			.selectAll("rect")
			.data(data)
			.join("rect")
			.attr("x", (d, i) => x(d.month))
			.attr("y", d =>  y(d.thisYear)  - window.innerHeight*0.0205)
			.attr("width", barWidth)
			.attr("height", '2vh')
			.attr("fill", "white");

/// MONTHLY AVARAGE (FILL)
		const monAv = chart.append("g").attr("id", "monthly-avarage");
		monAv
		.append('path')
			.attr("fill", "rgb(19 126 202 / 20%)")
			.attr('d', lineGenerator(points));
	
/// THIS-YEAR BARS
		chart.append("g").attr("id", "actual-year-chart")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("title", d => d.thisYear)
			.attr("date", d => d.month)
			.attr("x", (d) => x(d.month))
			.attr("y", d => y(d.thisYear))
			.attr("height", d => y(0) - y(d.thisYear))
			.attr("width", barWidth)
			.attr("class", "thisYear")
			.attr("fill", (d, i) => i < fiscalMonth ? '#424342' : "url(#lightstripe)")
			.on("mouseover", () => d3.selectAll(".lastYear").style("opacity", 0.5))
			.on("mouseout", () => d3.selectAll(".lastYear").style("opacity", 1));
	
/// DELTA-ABSOLUTE BARS
		chart.append("g").attr("id", "delta-absolute-chart")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("class", "rect")
			.attr("title", d => formatDecimal(d.thisYear-d.lastYear))
			.attr("date", d => d.month)
			.attr("fill", function(d, i) {
				if (d.thisYear - d.lastYear < 0 && i < fiscalMonth){
					return "#E73835"
				}else if (d.thisYear - d.lastYear > 0 && i < fiscalMonth){
					return "#85AD39"
				}else if (d.thisYear - d.lastYear  < 0 && i > fiscalMonth - 1){
					return "url(#redstripe)"
				}else{
					return "url(#greenstripe)"
				}})
			.attr("x", (d, i) => x(d.month))
			.attr("y", (d, i) => margin.top + absAxis - Math.max(0, yScale(d.thisYear-d.lastYear)))
			.attr("height", (d) => Math.abs(yScale(d.thisYear-d.lastYear)))
			.attr("width", barWidth);
	
/// DELTA-RELATIVE 
		// Create a svg group for the elements (box, line)
		const deltaRel = chart.append("g").attr("id", "delta-relative-chart");
		/// Delta Relative BOX
		deltaRel
		.append("g")
		.attr("id", "delta-relative-BOX")
		.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
			.attr("x", (d, i) => x(d.month))
			.attr("y", (d, i) => margin.top - Math.max(yScale((d.thisYear / d.lastYear - 1) * 100)))
			.attr("width", 10)
			.attr("height", 10)
			.attr("fill", (d, i) => i < fiscalMonth ? "#323233" : "url(#lightstripe)")
			.attr("transform", `translate(${x.bandwidth() / 2 -4.5}, -3 )`);
	
		// Delta Relative BARS
		deltaRel
		.append("g")
		.attr("id", "delta-relative-LINE")
		.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
			.attr("x", d => x(d.month))
			.attr("y", d => margin.top - Math.max(0, yScale((d.thisYear / d.lastYear - 1) * 100)))
			.attr("height", (d) => Math.abs(yScale((d.thisYear / d.lastYear - 1) * 100)))
			.attr("width", 5)
			.attr("transform", `translate(${x.bandwidth()/2 - 2}, 0 )`)
			.attr("title", d => formatPercent((d.thisYear / d.lastYear - 1)))
			.attr("date", d => d.month)
			.attr("fill", (d) => ((d.thisYear / d.lastYear - 1) * 100) < 0 ? "#E73835" : "#85AD39");
	
/// TOTALS
		const totals = chart.append("g").attr("id", "total-bars");
		// Total Last-Year BAR
		totals
		.append("rect")
		.data(data)
			.attr("class", "lastYear")
			.attr("x", totalPos)
			.attr("y", d => y(totalLastYear / 10))
			.attr("width", totalBarWidth) 
			.attr("height", d => y(0) - y(totalLastYear / 10))
			.attr("title", d => formatDecimal(totalLastYear)) // Format tooltip data
			.attr("date", d => lastYear)
			.attr("fill", 'white')
			.attr("transform", "translate("+ -lastYearPos +", 0)")
			.on("mouseover", () => d3.selectAll(".thisYear, .thisYearEst").style("opacity", 0.5))
			.on("mouseout", () => d3.selectAll(".thisYear, .thisYearEst").style("opacity", 1));
	
		// Total This-Year-Estimated BAR
		totals
		.append("rect")
			.attr("x", totalPos)
			.attr("y", d => y(totalThisYearEst / 10))// need to scale down by 10 in order to fit in canvas 
			.attr("width", totalBarWidth)
			.attr("height", d => y(0) - y(totalThisYearEst / 10))// need to scale down by 10 in order to fit in canvas
			.attr("class", "rect thisYear tt1")
			.attr("title", d => formatDecimal(totalThisYearEst))
			.attr("date", d => thisYear)
			.attr("stroke", "black")
			.attr("fill", 'url(#lightstripe)')
			.on("mouseover", () => d3.selectAll(".lastYear").style("opacity", 0.5))
			.on("mouseout", () => d3.selectAll(".lastYear").style("opacity", 1));
	
		// Total This-Year-Actual BAR
		totals
		.append("rect")
			.attr("x", totalPos)
			.attr("y", d => y(totalThisYear / 10))
			.attr("width", totalBarWidth)
			.attr("height", d => y(0) - y(totalThisYear / 10))
			.attr("title", d => formatDecimal(totalThisYear))
			.attr("date", d => thisYear)
			.attr("fill", '#424342')
			.on("mouseover", () => d3.selectAll(".lastYear").style("opacity", 0.5))
			.on("mouseout", () => d3.selectAll(".lastYear").style("opacity", 1));
	
		// Total Delta-Absolute BAR
		totals
		.append("rect")
			.attr("x", totalPos)
			.attr("y", margin.top + absAxis - Math.max(0, yScale(totalAbs / 10)))
			.attr("height", Math.abs(yScale(totalAbs / 10)))
			.attr("width", totalBarWidth)
			.attr("title", formatDecimal(totalAbs))
			.attr("date", thisYear)
			.attr("fill", d => totalAbs < 0 ? "url(#redstripe)" : "url(#greenstripe)");
	
		// Total Delta-Relative
		// Total Delta-Relative BOX
		const totalRelative = totals.append("g").attr("id", "total-relative-bar");
		totalRelative
		.append("rect")
			.attr("class", "rect")
			.attr("fill", d => totalRel < 0 ? "url(#redstripe)" : "url(#greenstripe)")
			.attr("transform", `translate(-3, -3)`)
			.attr("x", totalPos + totalBarWidth/2)
			.attr("y", (d, i) => margin.top - Math.max(yScale(totalRel)))
			.attr("width", 10)
			.attr("height", 10);
	
		// Total Delta-Relative BAR
		totalRelative
		.append("rect")
			.attr("fill", (d,i) => d < 0 ? "#85AD39" : "#E73835")
			.attr("x", totalPos + totalBarWidth/2 -1)
			.attr("y", (d, i) => margin.top - Math.max(0, yScale(totalRel)))
			.attr("height", (d) => Math.abs(yScale(totalRel)))
			.attr("width", 5)
			.attr("title", d => formatPercent(totalRel/100))
			.attr("date", d => thisYear);
	
/// X-AXIS
		// x-Axias of PL chart
		xAxis
		.append("line")
			.attr("id", "comparison-axis")
			.attr("x1", margin.left)
			.attr("x2", width - margin.right + 10)
			.attr("y1", y(0))
			.attr("y2", y(0))
			.attr("stroke", "black");
	
/// TEXT 
		const texts = chart.append("g").attr("id", "bar-text");
		// Last-Year TEXT
		texts.append("g").attr("id", "last-year-text")
		.selectAll("text")
		.data(data)
		.join("text")
		.text((d, i) => delta_abs[i] < 30 && delta_abs[i] < -30 ? `${parseInt(d.lastYear)}` : "" )
			.attr("class", "positive")
			.attr("x", (d, i) => x(d.month) + barWidth / 2 - lastYearPos)
			.attr("y", d => y(d.lastYear));

		// This-Year TEXT
		texts.append("g").attr("id", "this-year-text")
		.selectAll("text")
		.data(data)
		.join("text")
		.text((d) => parseInt(d.thisYear))
		.attr("x", (d, i) => x(d.month) + barWidth / 2)
		.attr("y", d => y(d.thisYear))
		.attr("class", "thisYear positive")
	
		// Delta-Absolute TEXT
		texts.append("g").attr("id", "delta-absolute-text")
		.selectAll("text")
		.data(data)
		.join("text")
		.text(d => d.thisYear - d.lastYear < 0 ? Math.round(d.thisYear - d.lastYear) : `+${Math.round(d.thisYear - d.lastYear)}`)
			.attr("class", d => d.thisYear - d.lastYear < 0 ? "negative" : "positive")
			.attr("x", (d, i) => x(d.month) + barWidth/2)
			.attr("y", (d, i) => margin.top + absAxis - Math.max(yScale(d.thisYear - d.lastYear)))
	
		// Delta-Relatvie TEXT
		texts.append("g").attr("id", "delta-relative-text")
		.selectAll("text")
		.data(data)
		.join("text")
		.text((d) => (d.thisYear / d.lastYear - 1) * 100 < 0 ? Math.round((d.thisYear / d.lastYear - 1) * 100) : `+${Math.round((d.thisYear / d.lastYear - 1) * 100)}`)
			.attr("class", d => (d.thisYear / d.lastYear - 1) * 100 < 0 ? "negativeRel" : "positiveRel")
			.attr("x", (d, i) => x(d.month) + x.bandwidth()/2)
			.attr("y", (d, i) => margin.top - Math.max(yScale((d.thisYear / d.lastYear - 1) * 100)));
	
/// TOTAL TEXT
		const totalsText = texts.append("g").attr("id", "totals-text");
		// Total This Year Estimated TEXT
		totalsText
		.append("text")
		.text( d=> thisYearDiff > fontSize ? parseInt(totalThisYearEst) : "")
			.attr("x", totalPos + totalBarWidth / 2)
			.attr("y", d => y(totalThisYearEst / 10))
			.attr("class", "positive");
		//Total This Year BACKGROUND
		const tTY = totalsText.append("g").attr("id", "this-year-text-total");
		tTY.append("g").attr("id", "this-year-text-background-total")
		.append("rect")
			.attr("x", totalPos)
			.attr("y", d =>  y(totalThisYear / 10) - window.innerHeight * 0.020)
			.attr("width", totalBarWidth)
			.attr("height", "2vh")
			.style("fill", d=> thisYearDiff > fontSize ? "rgba(255,255,255,0.6)" : "transparent");
		// Total This-Year Actual TEXT
		tTY.append("g").attr("id", "this-year-text-text-total")
		.append("text")
		.text(parseInt(totalThisYear))
			.attr("x", totalPos + totalBarWidth / 2)
			.attr("y", d => y(totalThisYear/10))
			.attr("class", "positive");
		// Total Last-Year TEXT
		totalsText
		.append("text")
		.text((d) => parseInt(totalLastYear))
			.attr("x", totalPos + totalBarWidth/2 - lastYearPos)
			.attr("y", d => y(totalLastYear / 10))
			.attr("class", "positive")
		//Total Delta-Relative TEXT
		totalsText
		.append("text")
		.text((d) => parseInt(totalRel))
			.attr("x", totalPos + totalBarWidth/2)
			.attr("y", (d, i) => margin.top - Math.max(yScale(totalRel)))
			.attr("class", d => totalRel < 0 ? "negativeRel" : "positiveRel");
		//Total Delta-Absolute TEXT
		totalsText
		.append("text")
		.text((d) => parseInt(totalAbs))
			.attr("x", totalPos + totalBarWidth/2)
			//.attr("y", (d) => margin.top + absAxis - yScale(totalAbs) + 14);
			.attr("y", (d, i) => margin.top + absAxis - Math.max(yScale(totalAbs / 10)))
			.attr("class", d => totalAbs < 0 ? "negative" : "positive");
	
/// MONTHLY AVARAGE PATH (LINE)
		monAv
		.append('path')
			.attr("id", "line-path")
			.attr('d', lineGenerator(linePoints));
	
/// FISCAL-LINE ////////////////////////
		// Get Points between Bars
		const f1 = xScale(fiscalMonth-1) + barWidth,
		f = xScale(fiscalMonth);
		chart
		.append("line")
		.attr("id", "fiscal-line")
		.data(data)
			.attr("x1", f1 + (f-f1)/2)
			.attr("x2", f1 + (f-f1)/2)
			.attr("y1", margin.top/2)
			.attr("y2", height - margin.bottom + barWidth/2)
			.attr("stroke-width", "1px")
			.attr("stroke", "black");
	
/// PY TRIANGLES
		chart.append("g").attr("id", "PY-trinagles")
		.selectAll("text")
		.data(data)
		.join("text")
		.text("▶")
			.attr("class", "triangle")
			.attr("title", (d) => d.PY)
			.attr("date", "PY: ")
			.attr("fill", "grey")
			.attr("x", (d, i) => x(d.month))
			.attr("y", d => y(d.PY));
	
/// TOOLTIP 
		function tooltip(){
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
								const xValue = parseInt(reference.getAttribute('x'));
								const getClass = reference.getAttribute('class')
								let fill = reference.getAttribute('fill');
								let mid = 110;
								if (fill === 'url(#greenstripe)') {fill = "#85AD39"}
									else if (fill === 'url(#redstripe)') {fill = "#E73835"}
										else if (fill === 'url(#lightstripe)') {fill = "#424342"}
									if (xValue <= xScale(2)){ mid += mid/-2}
										else if (xValue >= width - margin.right - hPix) { mid += mid/2}
											else { mid = 110};
										reference.removeAttribute('title');
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
		},});};
		tooltip();
	}
	
resize();
d3.select(window).on("resize", resize);

function resize() {
	let w = window.innerWidth * 0.95, h = window.innerHeight * 0.95;
	chart.attr("width", w).attr("height", h);
	drawChart();
}