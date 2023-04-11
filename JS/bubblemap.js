const bubblemap_svg = d3.select("#bubblemap_div").append("svg")
//.style('background','radial-gradient(circle, rgba(2,0,36,1) 8%, rgba(41,78,209,1) 31%, rgba(3,7,8,1) 82%)');
    bubblemap_svg.attr("width",window.innerWidth-50);
    bubblemap_svg.attr("height",window.innerHeight-120);
    bubblemap_svg.attr("id","bubblemap");
    const bubblemap_width = +choropleth_svg.attr("width")
    const bubblemap_height = +choropleth_svg.attr("height");

bubblemap_plotter(bubblemap_width,bubblemap_height,bubblemap_svg,
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_gpsLocSurfer.csv",
    ["homecontinent","n","homelon","homelat"],[ 1, 50],[100,4000,15000]
    )

function bubblemap_plotter(map_width,map_height,map_svg,geojson_path,csv_path,csv_var,size_range,scale_domain){
    // The svg
    const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    // Map and projection
    const map_projection = d3.geoMercator()
    .center([0,20])                // GPS of location to zoom on
    .scale(99)                       // This is like the zoom
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
    .range(d3.schemePaired);

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
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(map_projection)
        )
    .style("stroke", "none")
    .style("opacity", .3)

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
    .attr("stroke", d=> {if (d[csv_var[1]]>2000) {return "black"} else {return "none"}  })
    .attr("stroke-width", 1)
    .attr("fill-opacity", .4)



    // Add title and explanation
    map_svg
    .append("text")
    .attr("text-anchor", "end")
    .style("fill", "black")
    .attr("x", map_width - 10)
    .attr("y", map_height - 30)
    .attr("width", 90)
    .html("WHERE SURFERS LIVE")
    .style("font-size", 14)


    // --------------- //
    // ADD LEGEND //
    // --------------- //

    // Add legend: circles
    //const valuesToShow = [100,4000,15000] scale_domain
    const xCircle = 40
    const xLabel = 90
    map_svg
    .selectAll("legend")
    //.data(valuesToShow)
    .data(scale_domain)
    .join("circle")
    .attr("cx", xCircle)
    .attr("cy", d => map_height - size(d))
    .attr("r", d => size(d))
    .style("fill", "none")
    .attr("stroke", "black")

    // Add legend: segments
    map_svg
    .selectAll("legend")
    //.data(valuesToShow)
    .data(scale_domain)
    .join("line")
    .attr('x1', d => xCircle + size(d))
    .attr('x2', xLabel)
    .attr('y1', d => map_height - size(d))
    .attr('y2', d => map_height - size(d))
    .attr('stroke', 'black')
    .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    map_svg
    .selectAll("legend")
    //.data(valuesToShow)
    .data(scale_domain)
    .join("text")
    .attr('x', xLabel)
    .attr('y', d => map_height - size(d))
    .text(d => d)
    .style("font-size", 10)
    .attr('alignment-baseline', 'middle')
    })
}