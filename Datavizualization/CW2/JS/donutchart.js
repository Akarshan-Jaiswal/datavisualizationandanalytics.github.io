const donutchart_margin = {top: 90, right: 200, bottom: 90, left: 80},
    donutchart_width = window.innerWidth-20 //- donutchart_margin.left - donutchart_margin.right,
    donutchart_height = window.innerHeight-120 //- donutchart_margin.top - donutchart_margin.bottom;
const donutchart_svg = d3.select("#choropleth_div").append("svg")
.style('background','none');
    donutchart_svg.attr("width", donutchart_width /*+ donutchart_margin.left + donutchart_margin.right*/);
    donutchart_svg.attr("height", donutchart_height /*+ donutchart_margin.top + donutchart_margin.bottom*/);
    donutchart_svg.attr("id","donutchart").style("pointer-events", "none");
    donutchart_svg.style("position", "absolute").style("top", donutchart_margin.top).style("left", donutchart_margin.left);
    donutchart_svg.append("g")//.attr("transform",`translate(${donutchart_width},${donutchart_height})`)

// donutchart_plotter(donutchart_width,donutchart_height,donutchart_svg,donutchart_margin,
//     "https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW2_tests/Resources/CSV/ProcessedCSV/top500.csv",
//     ["Country","Name","Total_Net_Worth"],"India",0.7)
function donutchart_plotter(chart_width,chart_height,chart_svg,chart_margin,csv_path,csv_var,filter_condition,visibility){
    chart_svg.selectAll("path").remove();
    chart_svg.selectAll("polyline").remove();
    chart_svg.selectAll("text").remove();
    const translation_height=chart_height/2;
    const translation_width=(chart_width/2)-70;
    const translation=["transform",`translate(${(translation_width)},${translation_height})`]
    const radius = Math.min(chart_width, chart_height) / 2 //- Math.min(chart_margin.top,chart_margin.right)
    //chart_svg.attr(translation[0],translation[1]);
    d3.csv(csv_path,
    function (d){
        if(d[csv_var[0]]===filter_condition){
            return d
        }
    }).then(function(data) {

    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(data.map(d => d[csv_var[1]]))
        .range(d3.schemeDark2);

    const pie = d3.pie()
        .sort(null)
        .value(d => d[csv_var[2]])

    const data_ready = pie(data)

    const arc = d3.arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius * 0.8)

    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    chart_svg
        .selectAll('allSlices')
        .data(data_ready)
        .join('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[csv_var[1]]))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", visibility).attr(translation[0],translation[1])
    chart_svg
        .selectAll('allPolylines')
        .data(data_ready)
        .join('polyline')
            .attr("stroke", "black")
            .attr(translation[0],translation[1])
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
            const posA = arc.centroid(d)
            const posB = outerArc.centroid(d)
            const posC = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
            return [posA, posB, posC]
            })
    chart_svg
        .selectAll('allLabels')
        .data(data_ready)
        .join('text')
            .text(d => d.data[csv_var[1]])
            .attr('transform', function(d) {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = (radius * 0.99 * (midangle < Math.PI ? 1 : -1))+translation_width;
                pos[1] = pos[1]+translation_height;
                return `translate(${pos})`;
            })
            .style('text-anchor', function(d) {
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            }).style("font-size", "14px").style("font-weight", 900).style("fill","#62d146")
    });
}