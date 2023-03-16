const choropleth_svg = d3.select("#choropleth_div").append("svg")
.style('background','radial-gradient(circle, rgba(32,123,142,1) 0%, rgba(9,33,121,1) 48%, rgba(2,0,36,1) 88%)');
    choropleth_svg.attr("width",window.innerWidth);
    choropleth_svg.attr("height",window.innerHeight-100);
    choropleth_svg.attr("id","map");
    const choropleth_width = +choropleth_svg.attr("width")
    const choropleth_height = +choropleth_svg.attr("height");

  choropleth_plotter(choropleth_width,choropleth_height,choropleth_svg,
    [1000,10000,50000,100000,250000,750000,1000000,1000000000],git_path+"Resources/GeoJsons/Extensive.geojson",
    git_path+"Dataset/Average_cases/total.csv",0,[["mouseover",function (d) {console.log(d3.select(this).attr("id"));}]],0)
  function choropleth_plotter(map_width,map_height,map_svg,scale_domain,geojson_path,csv_path,map_state,map_funtions,info_rect){
    if (info_rect===0){
      map_svg.append("g").attr("id","rect_g").attr("class", "item").append("rect")
      .attr("id","info_rect")
      .attr("x",map_width-(map_width-80))
      .attr("y",map_height/2)
      .attr("width",map_width/7)
      .attr("height",map_height/9)
      .style("fill","grey")
      .style("top",1)
      .style("opacity", 0)
    }
  // Map and projection
  const map_path = d3.geoPath();
  const map_projection = d3.geoMercator()
    .scale(180)
    .center([0,40])
    .translate([map_width / 2, map_height / 2]);
  
  // Data and color scale
  const data = new Map();
  const colorScale = d3.scaleThreshold()
        .domain(scale_domain)
        .range(d3.schemeReds[9]);
      
  //const data_csv=d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv");
  //const test_2=[data_csv];
  //console.log(test2);
  //const test=d3.group(data_csv, a=>a.location);
  //console.log(data_csv);
      // Load external data and boot
      Promise.all([d3.json(geojson_path),
      d3.csv(csv_path, function(d) {
      //d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv", function(d) {
      data.set(d.location, +d.total_cases)
      //data.set(d.location, +d.total_cases, +d.new_cases,+d.gdp_per_capita,d.population_density,d.life_expectancy)
  })]).then(function(loadData){
    //console.log(loadData[0]);
      let topo = loadData[0]
  
      let mouseOver = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .3)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
        console.log(d3.select(this).attr("id"),d3.select(this).attr("fill"))
        if(info_rect===0){
          d3.select("#info_rect").transition()
          .duration(200)
          .style("opacity", 1).style("stroke", "black");
          d3.select("#rect_g").append("text").text("Highlighted Country: ")
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/2)+25)
          .style("font-size", "20px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
          d3.select("#rect_g").append("text").text(d3.select(this).attr("id"))
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/2)+50)
          .style("font-size", "23px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
        }
    }
  
    let mouseLeave = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", 1)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "")
      if(info_rect===0){
          //d3.select("#info_rect").selectAll("g").remove();
          d3.select("#info_rect").transition()
          .duration(100)
          .style("opacity", 0)
          d3.select("#rect_g").selectAll("text").remove()
        }
    }
  
    let countryClick = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", 0);
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
      console.log(d3.select(this).attr("id"))
      selected_country=d3.select(this).attr("id");
      createLineChart(selected_country,linechart_width,linechart_height,line_chart_svg,git_path+"Dataset/Processed_files/Time_distributed/total_cases.csv");
      createScatterPlot(selected_country,selected_country,scatter_plot_width,scatter_plot_height,scatter_plot_svg,data_path,"scatter_input")
      d3.select('body').transition()
      .duration(1500)
      .style("transform", null);
      toLineChartFunction();
    }
  
    // Draw the map
    const final_map=map_svg.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(map_projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
          d.total = data.get(d.properties.name) || 0;
          return colorScale(d.total);
        })
        .attr("id", function (d) {return d.properties.name;
        })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", 1)
    if(map_state===0){
          final_map.on("mouseleave", mouseLeave )
          .on("click",countryClick)
          .on("mouseover",mouseOver)
        }else if (map_state===1){
          map_funtions.forEach(element => {
            final_map.on(element[0],element[1])
          });
        }
  })
  }