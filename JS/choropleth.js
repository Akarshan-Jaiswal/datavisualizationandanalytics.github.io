//Making Map
const choropleth_svg = d3.select("#choropleth_div").append("svg")
.style('background','radial-gradient(circle, rgba(2,0,36,1) 8%, rgba(41,78,209,1) 31%, rgba(3,7,8,1) 82%)');
    choropleth_svg.attr("width",window.innerWidth-35);
    choropleth_svg.attr("height",window.innerHeight-120);
    choropleth_svg.attr("id","globe_map");
    const choropleth_width = +choropleth_svg.attr("width")
    const choropleth_height = +choropleth_svg.attr("height");

choropleth_plotter(choropleth_width,choropleth_height,choropleth_svg,
  [1000,10000,50000,100000,250000,750000,1000000,50000000],
  "https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW1/Resources/GeoJsons/world.geojson",
  "https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/22d80dbd66f2a54936e53e4f019b3f188504c760/Dataset/Average_cases/total.csv",
  ["location","total_cases"],0,[["",""]])
  function choropleth_plotter(map_width,map_height,map_svg,scale_domain,geojson_path,csv_path,csv_var,map_state,map_funtions){
  // Map and projection
  var stop_rotation = false;
  var is_clicked =false;
  const initialScale = 250;
  const map_projection = d3.geoOrthographic()
    .scale(initialScale)
    .center([0,0])
    .rotate([0,-30])
    .translate([map_width / 2, map_height / 2]);

  let globe = map_svg.append("circle")
    .attr("fill", "#1e1e5f")
    //.attr("background-image", "radial-gradient(circle, rgba(32,123,142,1) 0%, rgba(9,33,121,1) 48%, rgba(2,0,36,1) 88%)")
    .attr("stroke", "#000")
    .attr("stroke-width", "0.2")
    .attr("cx", map_width/2)
    .attr("cy", map_height/2)
    .attr("r", initialScale)

  globe.call(d3.drag().on('drag', (event) => {
    const rotate = map_projection.rotate();
    const lambda = d3.scaleLinear()
        .domain([-map_width / 2, map_width / 2])
        .range([-180, 180]);
    const phi = d3.scaleLinear()
        .domain([-map_height / 2, map_height / 2])
        .range([90, -90]);
    const sensitivity = 100;
    const dx = event.dx * sensitivity / map_width;
    const dy = event.dy * sensitivity / map_height;
    const new_rotation = [
      lambda(dx) + rotate[0],
      phi(dy) + rotate[1]
    ];
    map_projection.rotate(new_rotation);
    path = d3.geoPath().projection(map_projection);
    map_svg.selectAll("path").attr("d", path);
}));
    
  
  // Data and color scale
  const data = new Map();
  const colorScale = d3.scaleThreshold()
        .domain(scale_domain)
        .range(d3.schemeReds[9]);

      // Load external data and boot
      Promise.all([d3.json(geojson_path),
      d3.csv(csv_path, function(d) {
      data.set(d[csv_var[0]], +d[csv_var[1]])
  })]).then(function(loadData){
      let topo = loadData[0]
  
      //Hover functions
      let mouseOver = function(d) {
      if(!is_clicked){
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
        //map_projection.scale(2.7*((initialScale*2)/5));
      }
    }
  
    let mouseLeave = function(d) {
      if(!is_clicked){
          d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", 1)
          d3.select(this)
          .transition()
          .duration(200)
          .style("stroke", "")
          //map_projection.scale(initialScale);
          globe.attr("r",initialScale);
      }
    }
  
    //Click function
    let countryClick = function(d) {
      if (!is_clicked){
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", 0);
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black")
      selected_country=d3.select(this).attr("id");
      console.log("this is the selected country:" + selected_country)
      d3.select('body').transition()
        .duration(1500)
        .style("transform", null);
      stop_rotation = true;
      is_clicked = true;
      globe.attr("r",0);
      }else{
        stop_rotation = false;
        is_clicked = false;
      }
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
        .attr("title", function (d) {return d.properties.name;
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

    //Optional rotate
  let then = Date.now();
  d3.timer(function(elapsed) {
      const now = Date.now();
      const delta = now - then;
      then = now;
      if (!stop_rotation){
        const rotate = map_projection.rotate();
        const k = 75 / map_projection.scale();
        map_projection.rotate([
            rotate[0] - delta * 0.01 * k,
            rotate[1]
        ]);
        path = d3.geoPath().projection(map_projection);
        map_svg.selectAll("path").attr("d", path);
        map_projection.scale(initialScale);
        }else{
          map_projection.scale(2.7*((initialScale*2)/5));
        }
  }, 200);
  })
  }