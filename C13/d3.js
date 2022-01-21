// User Control
const fiscal = 10; //1 = February, 12 = January(year next)
const startYear = 2006;

// Format Data
const formatDecimal = d3.format(",.3f");
const formatPercent = d3.format(".0%");

// GET DATA
d3.csv("data.csv").then(function(datapoints) {

	// SETUP
	const width = window.innerWidth* 0.23, 
	height = window.innerHeight* 0.21,
	companyName = document.getElementById("compName").innerText,
	container = d3.select("#svg-container"),
	margin = { top: height/3, bottom: height/6, left: width/17, right: width/17 },
	years = 12,
	fontSize = 12;

	//SCALING DATA
	const x = d3.scaleBand()
			.domain(d3.range(years))
			.range([margin.left, width- margin.right])
			.padding(0.25);

	const y = d3.scaleLinear()
			.domain([0,400])
			.range([0, height - margin.top]);
	// Nest data by location
	var nested = d3.nest()
			.key( d => d.city)
			.rollup( v => v.map(function (d) { delete d.city; return  d.values; }))
			.entries(datapoints);

	console.log(nested)

	// CREATE SVGs
	container
	.selectAll('svg')
	.data(nested)
	.enter()
	.append('svg')
	// Add class of frist letter 
			.each(function (d) {
				var svg = d3.select(this);
				svg.attr("class", (d, i) =>`svg${d.key.slice(0,3)}`)
			.attr("width", width)    
			.attr("height", height);

	// Add Delta Absolute and Relative Values to dataset
	nested.forEach(function (d) {
		d.abs = [];
		d.rel = [];
		for ( let i = 0; i < d.value.length; i++) {
			let absoluteValues = d.value[i] - d.value[i-1]
			let relativeValues = (d.value[i] / d.value[i-1] - 1) * 100; 
			d.abs.push(absoluteValues)
			d.rel.push(relativeValues)
		} 		
	});
	/// Location Header Text
	svg
	.append('text')
		.attr('class', 'location-header')
		.text(d.key);

	//X-Axis
	svg
	.append("line")
	.attr('class', 'x-axis')
		.attr("x1",  margin.left * 0.90)
		.attr("x2", width - margin.right)
		.attr("y1", height - margin.bottom)
		.attr("y2", height - margin.bottom);

	/// X - Axis TEXT
	// 2006
	const xAxisText = svg.append('g').attr('id', 'x-axis-text')
	.append("text")
	.text((d, i) => d.value[0] > 0 && d.value[1] > 0 ? `${startYear}` : "")
		.attr("class", "x-axisText")
		.attr("x", (d, i) => x(0) + margin.left / 2)
		.attr("y", height - margin.bottom + fontSize);

	//2012
	xAxisText
	.append("text")
	.text((d, i) => d.value[5] > 0 && d.value[6] > 0 && d.value[7] > 0 ? `${startYear + 6}` : "")
		.attr("class", "x-axisText")
		.attr("x", (d, i) => x(6) + margin.left / 2)//+ width/2 - margin.right)
		.attr("y", height - margin.bottom + fontSize);
						
	xAxisText
	.append("text")
	.text((d, i) => d.value[10] > 0 && d.value[11] > 0 ? `${startYear + 11}` : "")
		.attr("class", "x-axisText")
		.attr("x", (d, i) => x(11) + margin.left / 2)
		.attr("y", height - margin.bottom + fontSize);

	const locationValues = d.value;
	////// BAR-CHART 
	svg
	.append("g")
	.attr('class', 'bar-chart')
	.selectAll("rect")
	.data(locationValues)
	.join("rect")
		.attr("title", d => formatDecimal(d))
		.attr("date", (d, i) => i + startYear)
		.attr("x", (d, i) => x(i) )
		.attr("y", (d, i) => height - margin.bottom - Math.max(0, y(d)))
		.attr("height", d => Math.abs(y(d)))
		.attr("width", x.bandwidth())
		.attr("stroke", "black")
		.attr("stroke-width", "0.5px")
		.attr("fill", (d, i) => i < fiscal ? "black" : "white");

	// values array, min & max values /  location
	const array = [];
	for (let i = 0; i < locationValues.length; i++) {
		array.push(parseInt(locationValues[i]));
	}
	const min = d3.min(array)
	const max = d3.max(array)

	// Location bar TEXT
	svg
	.append("g")
	.selectAll("text")
	.data(locationValues)
	.join("text")
	.text(d => parseInt(d))
		.attr("class", d => d < 0 ? "negative bar-text" : "positive bar-text")
		.attr("id", d => `value${parseInt(d)}`)
		.attr("x", (d, i) => x(i) + x.bandwidth()/2)//+ innerWidth)
		.attr("y", (d, i) => height - margin.bottom - Math.max(0, y(d)))
		.attr("fill", (d, i) => d >= max ? "black" : "transparent"		 // highest number
		&& d <= min ? "black" : "transparent"  							 // lowest number
		&& i < fiscal && i > fiscal - 2 ? "black" : "transparent" 		 // the bar before fiscal
		&& i < 1 ? "black" : "transparent"								 // the first bar
		&& i > array.length - 2 ? "black" : "transparent"				 // the last bar
		);

	// Fiscal Line
	let fiscPos = x(fiscal)
	let prev = fiscPos - (x(fiscal-1) + x.bandwidth())
	svg
	.append("line")
		.attr("class", "fiscal")
		.attr("x1", fiscPos - prev / 2 )
		.attr("x2", fiscPos - prev / 2  )
		.attr("y1", height - margin.bottom / 2)
		.attr("y2", height - margin.bottom * 2);

	// Avarage Location 'Ø 25 locations' background
	d3.select(".svgØ").style("background-color", "rgba(125,125,125,0.10)")
	});

	// TOOLTIP
	window.onload = function tooltip(){
		tippy('rect', {   
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
				return `<p style="color: grey;">${date}</p> 
				<p><span style="font-size: 18px;color: ${fill};"> ● </span>${companyName}:  <strong>${title}</strong></p>`
			},
		});
	};
	});

	// Readjust winodw on resize 
	d3.select(window).on("resize", () => location.reload());
