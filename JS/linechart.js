
const linechart_margin = {top: 50, right: 60, bottom: 30, left: 80},
    linechart_width = window.innerWidth -20 - linechart_margin.left - linechart_margin.right,
    linechart_height = window.innerHeight -120  - linechart_margin.top - linechart_margin.bottom;


    // append the svg object to the body of the page
    const line_chart_svg = d3.select("#linechart_div")
    .append("svg")
    .attr("width", linechart_width + linechart_margin.left + linechart_margin.right)
    .attr("height", linechart_height + linechart_margin.top + linechart_margin.bottom)
    .attr("id","line_chart")
    .append("g")
    .attr("transform",
        `translate(${linechart_margin.left}, ${linechart_margin.top})`);
    
createLineChart(selected_country,linechart_width,linechart_height,line_chart_svg,git_path+"Dataset/Processed_files/Time_distributed/total_cases.csv");
function createLineChart(parameter,chart_width,chart_height,chart_svg,csv_path){
    chart_svg.selectAll("text").remove();
    chart_svg.selectAll("g").remove();

    chart_svg.append("svg")
        .attr("width", chart_width + linechart_margin.left + linechart_margin.right)
        .attr("height", chart_height + linechart_margin.top + linechart_margin.bottom)
        .attr("id","line_chart")
        .append("g")
        .attr("transform",
            `translate(${linechart_margin.left}, ${linechart_margin.top})`);

    const data_parameter= parameter || "";
    //Read the data
    d3.csv(csv_path,

    // When reading the csv, I must format variables:
    function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), data_parameter : d[parameter]}
    }).then(

    // Now I can use this dataset:
    function(data) {

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([ 0, chart_width ]);
    xAxis = chart_svg.append("g")
    .attr("transform", `translate(0, ${chart_height})`)
    .call(d3.axisBottom(x));

    // Add X axis label
    chart_svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", chart_width)
    .attr("y", chart_height - 6)
    .text("Date and Time");

    // Add county title 
    chart_svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", chart_width/2)
    //.attr("y", linechart_)
    .text("Total Cases of "+selected_country).style("font-family","montserrat,sans-serif");

    chart_svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", chart_width-(chart_width/20))
        .attr("y", 160)
        .text("The following Line Chart displays the growth of the overall total cases reported of corona virus in "+selected_country+" throughout years of spread.")
        .style("font-family","montserrat,sans-serif").style("opacity",0.3).style("font-size", "23px")
        .transition().duration(15000).style("transform", "scale(0.001, 0.001)");

    chart_svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", chart_width-(chart_width/20))
        .attr("y", 210)
        .text("We can veiw data for other countries by selecting other countries from the map.")
        .style("font-family","montserrat,sans-serif").style("opacity",0.3).style("font-size", "23px")
        .transition().duration(15000).style("transform", "scale(0.001, 0.001)");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.data_parameter; })])
    .range([ chart_height, 0 ]);
    yAxis = chart_svg.append("g")
    .call(d3.axisLeft(y));
    // Add Y axis label
    chart_svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("x", 115)
    .attr("dy", ".75em")
    //.attr("transform", "rotate(-90)")
    .text("Total population")

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = chart_svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", chart_width )
        .attr("height", chart_height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    const line_chart_brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [chart_width,chart_height] ] )  // initialise the brush area: start at 0,0 and finishes at chart_width,chart_height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    const line = chart_svg.append('g')
    .attr("clip-path", "url(#clip)")

    // Add the line
    line.append("path")
    .datum(data)
    .attr("class", "line")  // I add the class line to be able to modify this line later on.
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.data_parameter) })
        ).style("transform", "scale(0.001, 0.001)")
        .transition()
        .duration(2000)
        .style("transform", null).text(selected_country)

    // Add the brushing
    line
    .append("g")
        .attr("class", "brush")
        .call(line_chart_brush);

    // A function that set idleTimeOut to null
    let idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart(event,d) {

    // What are the selected boundaries?
    extent = event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
    }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        line.select(".brush").call(line_chart_brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and line position
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
    line
        .select('.line')
        .transition()
        .duration(1000)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.data_parameter) })
        )
    }

    // If user double click, reinitialize the chart
    chart_svg.on("dblclick",function(){
    x.domain(d3.extent(data, function(d) { return d.date; }))
    xAxis.transition().call(d3.axisBottom(x))
    line
        .select('.line')
        .transition()
        .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.data_parameter) })
    )
    });

    })
}