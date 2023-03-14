const choropleth_div = document.getElementById("choropleth_div");
const div2 = document.getElementById("my_circular_bar_plot");
const div3 = document.getElementById("scatterplot");
const linechart_div = document.getElementById("linechart_div");
const div5 = document.getElementById("svg_loop");

const toggleTovirusloop = document.getElementById("virus_button");
const toggleTolinechart = document.getElementById("linechart_button");
const toggleTochoropleth = document.getElementById("choropleth_button");
const toggleTocircularbarplot = document.getElementById("circular_bar_plot_button");
const toggleToscatterplot = document.getElementById("scatter_plot");
const toggleToall = document.getElementById("show_all");

const hide = el => el.style.setProperty("display", "none");
const show = el => el.style.setProperty("display", "block");

toggleTochoropleth.addEventListener("click", () => {
    show(choropleth_div);
    hide(div2);
    hide(div3);
    hide(linechart_div);
    hide(div5);
  });
toggleTocircularbarplot.addEventListener("click", () => {
    show(div2);
    hide(choropleth_div);
    hide(div3);
    hide(linechart_div);
    hide(div5);
  });
toggleToscatterplot.addEventListener("click", () => {
    show(div3);
    hide(div2);
    hide(choropleth_div);
    hide(linechart_div);
    hide(div5);
  });
  toggleTolinechart.addEventListener("click", () => {
    show(linechart_div);
    hide(div2);
    hide(choropleth_div);
    hide(div3);
    hide(div5);
  });
  toggleTovirusloop.addEventListener("click", () => {
    show(div5);
    hide(div2);
    hide(choropleth_div);
    hide(linechart_div);
    hide(div3);
  });
toggleToall.addEventListener("click", () => {
    show(choropleth_div);
    show(div2);
    show(div3);
    show(linechart_div);
    show(div5);
  });