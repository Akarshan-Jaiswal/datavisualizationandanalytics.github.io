const stackedarea_margin = {top: 90, right: 200, bottom: 90, left: 80},
    stackedarea_width = window.innerWidth - stackedarea_margin.left - stackedarea_margin.right,
    stackedarea_height = window.innerHeight-120 - stackedarea_margin.top - stackedarea_margin.bottom;
const stackedarea_svg = d3.select("#stackedarea_div").append("svg")
.style('background','radial-gradient(circle, rgba(131,255,200,1) 19%, rgba(219,219,219,1) 40%, rgba(163,237,255,1) 74%)');
    stackedarea_svg.attr("width", stackedarea_width + stackedarea_margin.left + stackedarea_margin.right);
    stackedarea_svg.attr("height", stackedarea_height + stackedarea_margin.top + stackedarea_margin.bottom);
    stackedarea_svg.attr("id","stackedarea");
    stackedarea_svg.style("margin-bottom","20px");
    stackedarea_svg.append("g").attr("transform",`translate(${stackedarea_margin.left}, ${stackedarea_margin.top})`)

stackedarea_plotter(stackedarea_width,stackedarea_height,stackedarea_margin,stackedarea_svg,
    "https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW2_tests/Resources/CSV/ProcessedCSV/top_10_countries_GDP(2000-2020)ver2.csv",
    ["Year"],"Time (year)","GDP in Dollars",[0, 60000000000000])
function stackedarea_plotter(chart_width,chart_height,chart_margin,chart_svg,csv_path,csv_var,x_label,y_label,domain_scale){
    d3.csv(csv_path).then( function(data) {

        // List of groups = header of the csv files
        const keys = data.columns.slice(1)
      
        // color palette
        const color = d3.scaleOrdinal()
          .domain(keys)
          .range(d3.schemeCategory10);
      
        //stack the data?
        const stackedData = d3.stack()
          .keys(keys)
          (data)
    
        // Add X axis
        const x = d3.scaleLinear()
          .domain(d3.extent(data, function(d) { return d[csv_var[0]]; }))
          .range([ chart_margin.left, chart_width-chart_margin.right]);
        const xAxis = chart_svg.append("g")
          .attr("transform", `translate(${chart_margin.left}, ${chart_height})`)
          .call(d3.axisBottom(x).ticks(5))
      
        // Add X axis label:
        chart_svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", chart_width-chart_margin.right)
            .attr("y", chart_height+40 )
            .text(x_label).style("font-weight", 700);
      
        // Add Y axis label:
        chart_svg.append("text")
            .attr("text-anchor", "end")
            .attr("x",chart_margin.left)
            .attr("y", 0 )
            .text(y_label)
            .style("font-weight", 700)
            .attr("text-anchor", "start")
            .attr("transform", `translate(${chart_margin.left}, ${chart_margin.top})`)
      
        // Add Y axis
        const y = d3.scaleLinear()
          .domain(domain_scale)
          .range([ chart_height, chart_margin.top ]);
        chart_svg.append("g")
        .attr("transform", `translate(${chart_margin.left+80})`)
          .call(d3.axisLeft(y).ticks(5))
    
        // Add a clipPath: everything out of this area won't be drawn.
        const clip = chart_svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", chart_width-chart_margin.right-80)
            .attr("height", chart_height)
            .attr("x",0)
            .attr("y", 0).attr("transform", `translate(${chart_margin.left+80})`);
      
        // Add brushing
        const brush = d3.brushX()                 // Add the brush feature using the d3.brush function
            .extent( [ [0,0], [chart_width-chart_margin.right,chart_height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
      
        // Create the scatter variable: where both the circles and the brush take place
        const areaChart = chart_svg.append('g')
          .attr("clip-path", "url(#clip)")
      
        // Area generator
        const area = d3.area()
          .x(function(d) { return x(d.data[csv_var[0]]); })
          .y0(function(d) { return y(d[0]); })
          .y1(function(d) { return y(d[1]); })
      
        // Show the areas
        areaChart
          .selectAll("mylayers")
          .data(stackedData)
          .join("path")
            .attr("class", function(d) { return "myArea " + d.key })
            .attr("id", function(d) { return d.key; })
            .style("fill", function(d) { return color(d.key); })
            .attr("d", area)
      
        // Add the brushing
        areaChart
          .append("g")
            .attr("class", "brush")
            .call(brush);
      
        let idleTimeout
        function idled() { idleTimeout = null; }
      
        // A function that update the chart for given boundaries
        function updateChart(event,d) {
      
          extent = event.selection
      
          // If no selection, back to initial coordinate. Otherwise, update X axis domain
          if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain(d3.extent(data, function(d) { return d[csv_var[0]]; }))
          }else{
            x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
            areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
          }
      
          // Update axis and area position
          xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
          areaChart
            .selectAll("path")
            .transition().duration(1000)
            .attr("d", area)
          }
    
          // What to do when one group is hovered
          const highlight = function(event,d){
            // reduce opacity of all groups
            d3.selectAll(".myArea").style("opacity", .1)
            // expect the one that is hovered
            d3.select("."+d).style("opacity", 1)
          }
      
          // And when it is not hovered anymore
          const noHighlight = function(event,d){
            d3.selectAll(".myArea").style("opacity", 1)
          }

          const clicked= function(d){
            wordcloud_plotter(wordcloud_height,wordcloud_width,wordcloud_svg,
                "https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW2_tests/Resources/CSV/ProcessedCSV/Wordcloud_per_country.csv",
                ["Industry","Frequency","Country"],d3.select(this).attr("id"),[500, 500],"Impact");
          }
    
          // Add one dot in the legend for each name.
          const size = 20
          chart_svg.selectAll("myrect")
            .data(keys)
            .join("rect")
                .attr("id", function(d) { return d; })
                .attr("x", chart_width)
                .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", function(d){ return color(d)})
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)
                .on("click",clicked)
      
          // Add one dot in the legend for each name.
          chart_svg.selectAll("mylabels")
            .data(keys)
            .join("text")
                .attr("id", function(d) { return d; })
                .attr("x", chart_width + size*1.2)
                .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d){ return color(d)})
                .style("font-weight", 800)
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)
                .on("click",clicked)
      
      })
}