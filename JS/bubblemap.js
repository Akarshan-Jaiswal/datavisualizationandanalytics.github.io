const bubblemap_svg = d3.select("#bubblemap_div").append("svg")
.style('background','linear-gradient(0deg, rgba(166,226,241,1) 0%, rgba(193,243,255,1) 34%, rgba(249,252,237,1) 90%)');
    bubblemap_svg.attr("width",window.innerWidth-20);
    bubblemap_svg.attr("height",window.innerHeight-120);
    bubblemap_svg.attr("id","bubblemap");
    const bubblemap_width = +bubblemap_svg.attr("width")
    const bubblemap_height = +bubblemap_svg.attr("height");

    /*
bubblemap_plotter(bubblemap_width,bubblemap_height,bubblemap_svg,
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_gpsLocSurfer.csv",
    ["homecontinent","n","homelon","homelat"],[ 1, 50],[100,4000,15000]
    )*/
//https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW2_tests/Resources/CSV/ProcessedCSV/bubblemap_per_country.csv
bubblemap_plotter(bubblemap_width,bubblemap_height,bubblemap_svg,
    "https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW1/Resources/GeoJsons/world.geojson",
    "https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW2_tests/Resources/CSV/ProcessedCSV/bubblemap_per_country.csv",
    ["country","Frequency","homelon","homelat"],[ 1, 50],[1,10,19,32],"Billionare density Technology"
    )

function bubblemap_plotter(map_width,map_height,map_svg,geojson_path,csv_path,csv_var,size_range,scale_domain,map_title){
    
    // Map and projection
    const map_projection = d3.geoMercator()
    .center([30,30])                // GPS of location to zoom on
    .scale(200)                       // This is like the zoom
    .translate([ map_width/2, map_height/2 ])

    Promise.all([
    d3.json(geojson_path),
    d3.csv(csv_path)
    ]).then(function (initialize) {

    let dataGeo = initialize[0]
    let data = initialize[1]

    // Create a color scale
    const color = d3.scaleOrdinal()
    //.domain(data.map(d => d.homecontinent)) csv_var=0
    .domain(data.map(d => d[csv_var[0]]))
    .range(d3.schemeDark2);

    // Add a scale for bubble size
    //const valueExtent = d3.extent(data, d => +d.n) csv_var=1
    const valueExtent = d3.extent(data, d => +d[csv_var[1]])
    const size = d3.scaleSqrt()
    .domain(valueExtent)  // What's in the data
    .range(size_range)  // Size in pixel

    // Draw the map
    map_svg.append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .join("path")
        //.attr("fill", "#b8b8b8")
        //.attr("fill", "#9ca76b")
        .attr("fill", "#ffffff")
        .attr("d", d3.geoPath()
            .projection(map_projection)
        )
    .style("stroke", "grey")
    //.style("opacity", .3)
    .style("opacity", 1)

    // Add circles:
    map_svg
    .selectAll("myCircles")
    .data(data.sort((a,b) => +b.n - +a.n).filter((d,i) => i<1000))
    .join("circle")
    //.attr("cx", d => projection([+d.homelon, +d.homelat])[0]) d.homelon csv_var=2 d.homelat csv_var=3
    //.attr("cy", d => projection([+d.homelon, +d.homelat])[1])
    .attr("cx", d => map_projection([+d[csv_var[2]], +d[csv_var[3]]])[0])
    .attr("cy", d => map_projection([+d[csv_var[2]], +d[csv_var[3]]])[1])
    .attr("r", d => size(+d[csv_var[1]]))
    .style("fill", d => color(d[csv_var[0]]))
    .attr("stroke", d=> {if (d[csv_var[1]]>2000) {return "black"} else {return "black"}  })
    .attr("stroke-width", 1)
    .attr("fill-opacity", .5)



    // Add title and explanation
    map_svg
    .append("text")
    .attr("text-anchor", "end")
    .style("fill", "black")
    .attr("x", map_width - 10)
    .attr("y", map_height - 30)
    .attr("width", 90)
    .html(map_title)
    .style("font-size", 14)


    // --------------- //
    // ADD LEGEND //
    // --------------- //

    // Add legend: circles
    //const valuesToShow = [100,4000,15000] scale_domain
    const xCircle = 80
    const xLabel = 130
    map_svg
    .selectAll("legend")
    //.data(valuesToShow)
    .data(scale_domain)
    .join("circle")
    .attr("cx", xCircle)
    .attr("cy", d => map_height-10 - size(d))
    .attr("r", d => size(d))
    .style("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width","2px")

    // Add legend: segments
    map_svg
    .selectAll("legend")
    //.data(valuesToShow)
    .data(scale_domain)
    .join("line")
    .attr('x1', d => xCircle + size(d))
    .attr('x2', xLabel)
    .attr('y1', d => map_height-10 - size(d))
    .attr('y2', d => map_height-10 - size(d))
    .attr('stroke', 'black')
    .attr("stroke-width","2px")
    .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    map_svg
    .selectAll("legend")
    //.data(valuesToShow)
    .data(scale_domain)
    .join("text")
    .attr('x', xLabel)
    .attr('y', d => map_height-10 - size(d))
    .text(d => d)
    .style("font-size", 13)
    .attr('alignment-baseline', 'middle')
    })
}