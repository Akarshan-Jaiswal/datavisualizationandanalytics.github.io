const wordcloud_svg = d3.select("#wordcloud_div").append("svg")
.style('background','radial-gradient(circle, rgba(255,255,255,1) 14%, rgba(217,242,183,1) 41%, rgba(255,255,163,1) 92%)');
    wordcloud_svg.attr("width",window.innerWidth);
    wordcloud_svg.attr("height",window.innerHeight-120);
    wordcloud_svg.attr("id","wordcloud");
    const wordcloud_width = +wordcloud_svg.attr("width")
    const wordcloud_height = +wordcloud_svg.attr("height");

const dataset = [
  { text: 'hello', frequency: 10 },
  { text: 'world', frequency: 8 },
  { text: 'foo', frequency: 6 },
  { text: 'bar', frequency: 4 },
  { text: 'baz', frequency: 2 },
];

wordcloud_plotter(wordcloud_height,wordcloud_width,wordcloud_svg,
  "https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW2_tests/Resources/CSV/ProcessedCSV/Wordcloud_per_country.csv",
  ["Industry","Frequency","Country"],"China",[500, 500],"Impact")
function wordcloud_plotter(cloud_height,cloud_width,cloud_svg,csv_path,csv_var,filter_condition,font_scale,font_family){
  cloud_svg.selectAll("g").remove();
  d3.csv(csv_path)
  .then(function(data) {
    const filteredData = data.filter(d => d[csv_var[2]] === filter_condition);
    const promises = filteredData.map(d => {
      return new Promise((resolve, reject) => {
        d[csv_var[0]] = d[csv_var[0]];
        resolve(d);
      });
    });
    return Promise.all(promises);
  }).then(function (data) {
      const words = data.map(function(d) {
        return { text: d[csv_var[0]], size: d[csv_var[1]] };
      });
    
      const layout = d3.layout.cloud()
          //.size(font_scale)
          .size([cloud_width,cloud_height])
          .words(words)
          .padding(5)
          .rotate(function() { return ~~(Math.random() * 2) * 90; })
          .fontSize(function(d) { 
            if(d.size<10)
            {
              return (d.size*10);
            }else if(d.size<20 && d.size>10)
            {
              return (d.size*7);
            }else if(d.size<50 && d.size>20)
            {
              return (d.size*5);
            }
          })
          .on("end", draw);
    
      layout.start();
    
      function draw(words) {
        cloud_svg
          .append("g")
            .attr("transform", "translate(" + cloud_width / 2 + "," + cloud_height / 2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", font_family)
            .style("fill", function(d, i) { return d3.schemeCategory10[i % 10]; })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
      }
    }).then(function (data) {
      const words = data.map(function(d) {
        return { text: d[csv_var[0]], size: font_scale(+d[csv_var[1]]) };
      });
    
      const layout = d3.layout.cloud()
          .size(font_scale)
          .words(words)
          .padding(5)
          .rotate(function() { return ~~(Math.random() * 2) * 90; })
          .fontSize(function(d) { 
            if(d.size<10)
            {
              return (d.size*20);
            }else if(d.size>50)
            {
              return (d.size*10);
            }
          })
          .on("end", draw);
    
      layout.start();
    
      function draw(words) {
        cloud_svg
          .append("g")
            .attr("transform", "translate(" + cloud_width / 2 + "," + cloud_height / 2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", font_family)
            .style("fill", function(d, i) { return d3.schemeCategory10[i % 10]; })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
      }
    });
}