
// set the dimensions and margins of the graph
const streamgraph_margin = {top: 50, right: 30, bottom: 20, left: 10},
    streamgraph_width = window.innerWidth - streamgraph_margin.left - streamgraph_margin.right,
    streamgraph_height = window.innerHeight - streamgraph_margin.top - streamgraph_margin.bottom;

// append the svg object to the body of the page
const streamgraph_svg = d3.select("#streamgraph_div")
  .append("svg")
    .attr("width", streamgraph_width + streamgraph_margin.left + streamgraph_margin.right)
    .attr("height", streamgraph_height + streamgraph_margin.top + streamgraph_margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${streamgraph_margin.left}, ${streamgraph_margin.top})`);
//const dummy_path="https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv";
const dummy_path="https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW1_test_branch/Dataset/Processed/date_continent_total_cases_M.csv";
//createStreamGraph(streamgraph_height,streamgraph_width,streamgraph_svg,dummy_path,[1900, 1925, 1975, 2000]);
createStreamGraph(streamgraph_height,streamgraph_width,streamgraph_svg,dummy_path,[2020, 2021, 2022, 2023]);
function createStreamGraph(chart_height,chart_width,chart_svg,csv_path,tick_list){
    chart_svg.selectAll("g").remove();
    chart_svg.append("svg")
        .attr("width", streamgraph_width + streamgraph_margin.left + streamgraph_margin.right)
        .attr("height", streamgraph_height + streamgraph_margin.top + streamgraph_margin.bottom)
    .append("g")
        .attr("transform",
            `translate(${streamgraph_margin.left}, ${streamgraph_margin.top})`);
    // Parse the Data
    d3.csv(csv_path).then(function(data) {

    // List of groups = header of the csv files
    const keys = data.columns.slice(1)

    // Add X axis
    const x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, chart_width ]);
    chart_svg.append("g")
    .attr("transform", `translate(0, ${chart_height*0.8})`)
    .call(d3.axisBottom(x).tickSize(-chart_height*.7).tickValues(tick_list))
    .select(".domain").remove()
    // Customization
    chart_svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

    let max_y = 0;
    const min_y = 0;
    data.forEach((item) => 
    {
        if(item.Africa>max_y){
            console.log("Africa");
            console.log(item.Africa);
            max_y=item.Africa;
        }
        else if(item.Asia>max_y){
            console.log("Asia");
            console.log(item.Asia);
            max_y=item.Asia;
        }
        else if(item.Europe>max_y){
            console.log("Europe");
            console.log(item.Europe);
            max_y=item.Europe;
        }
        else if(item.Oceania>max_y){
            console.log("Ocenia");
            console.log(item.Oceania);
            max_y=item.Oceania;
        }
        else if(item["North America"]>max_y){
            console.log("NA");
            console.log(item["North America"]);
            max_y=item["North America"];
        }
        else if(item["South America"]>max_y){
            console.log("SA");
            console.log(item["South America"]);
            max_y=item["South America"];
        }
        }
    );


    // Add X axis label:
    chart_svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", chart_width)
        .attr("y", chart_height-30 )
        .text("Time (year)");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([-1000000, 1000000])
    //.domain([-max_y, max_y])
    .range([ chart_height, 0 ]);

    // color palette
    const color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeDark2);

    //stack the data?
    const stackedData = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys)
    (data)

    // create a tooltip
    const Tooltip = chart_svg
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("font-size", 17)

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event,d) {
    Tooltip.style("opacity", 1)
    d3.selectAll(".myArea").style("opacity", .2)
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    const mousemove = function(event,d,i) {
    grp = d.key
    Tooltip.text(grp)
    }
    const mouseleave = function(event,d) {
    Tooltip.style("opacity", 0)
    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
    }

    // Area generator
    const area = d3.area()
    .x(function(d) { return x(d.data.year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

    // Show the areas
    chart_svg
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
        .attr("class", "myArea")
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    })
}