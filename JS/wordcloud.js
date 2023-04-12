const wordcloud_svg = d3.select("#wordcloud_div").append("svg")
//.style('background','radial-gradient(circle, rgba(2,0,36,1) 8%, rgba(41,78,209,1) 31%, rgba(3,7,8,1) 82%)');
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

wordcloud_plotter(wordcloud_height,wordcloud_width,wordcloud_svg,["Industry","Frequency","Country"],csv_var,filter_condition,font_scale,font_family)
function wordcloud_plotter(cloud_height,cloud_width,cloud_svg,csv_path,csv_var,filter_condition,font_scale,font_family){
    d3.csv(csv_path, function(error, data) {
      if (error) throw error;
    
      const words = data.map(function(d) {
        if (d[csv_var[2]]===filter_condition){
          return { text: d[csv_var[0]], size: +d[csv_var[1]] };
        }
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
/*
d3.csv("mydata.csv", function(error, data) {
  if (error) throw error;

  const words = data.map(function(d) {
    return { text: d.word, size: +d.size };
  });

  const layout = d3.layout.cloud()
      .size([500, 500])
      .words(words)
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .fontSize(function(d) { return d.size; })
      .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select("#word-cloud").append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return d3.schemeCategory10[i % 10]; })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }
});



/*
const words = [
  { text: "Lorem", size: 40 },
  { text: "ipsum", size: 30 },
  { text: "dolor", size: 20 },
  { text: "sit", size: 10 },
  { text: "amet", size: 40 },
  { text: "consectetur", size: 30 },
  { text: "adipiscing", size: 20 },
  { text: "elit", size: 10 }
];

const layout = d3.layout.cloud()
    .size([500, 500])
    .words(dataset)
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return (d.frequency*10); })
    .on("end", draw);

layout.start();

function draw(words) {
  d3.select("#wordcloud_div").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return d3.schemeCategory10[i % 10]; })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
}*/