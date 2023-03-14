function createD3Plot( id, xx, yy, ww, hh )
{
    // Set Dimensions
    const xSize  = ww;
    const ySize  = hh;
    const margin = 30; // axis
    const xMax   = xSize - margin*2;
    const yMax   = ySize - margin*2;

    // Create Random Points
    const numPoints = 100;
    const data      = [];
    const roff      = (Math.random()+1.0)*6;
    for (let i = 0; i < numPoints; i++) 
    {
       data.push( {x: i/100, y: Math.sin( roff + Math.random()*0.1 + 6.2 * i/100 )*(Math.random()+1.0) }  );
    }

    // Get the 'limits' of the data - the full extent (mins and max)
    // so the plotted data fits perfectly 
    const xExtent = d3.extent( data, d=>{ return d.x } );
    const yExtent = d3.extent( data, d=>{ return d.y } );

    // width:600px;height:600px;border:1px solid blue;position:absolute;left:20px; top:20px;

    // Append SVG Object to the Page
    const svg = d3.select('body')
              .append('div')
              .attr('id', "" + id)
              .style('width',  ww+'px')
              .style('height', hh+'px')
              .style('left',   xx+'px')
              .style('top',    yy+'px')
              .style('position', 'absolute')
              .style('border', '1px dashed gray')
              .append("svg")
              .attr('width',  xSize  )
              .attr('height', ySize  )
              .append("g")
              .attr("transform","translate(" + margin + "," + margin + ")");

    // X Axis
    const x = d3.scaleLinear()
                .domain([ xExtent[0], xExtent[1] ])
                .range([0, xMax]);

    // bottom
    svg.append("g")
       .attr("transform", "translate(0," + yMax + ")")
       .call(d3.axisBottom(x))
       .attr('color', 'green'); // make bottom axis green

    // top
    svg.append("g")
       .call(d3.axisTop(x));

    // Y Axis
    const y = d3.scaleLinear()
                .domain([ yExtent[0], yExtent[1] ])
                .range([ yMax, 0]);

    // left y axis
    svg.append("g")
       .call(d3.axisLeft(y));

    // right y axis
    svg.append("g")
       .attr("transform", `translate(${yMax},0)`)
       .call(d3.axisRight(y));


    // Add the line
    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 1.5)
       .attr("d", d3.line()
                .x(function(d) { return x(d.x)  })
                .y(function(d) { return y(d.y)  })
       );

}

/*createD3Plot( 'contA', 30,   30,   300, 300 );
createD3Plot( 'contB', 340,  30,   300, 300 );
createD3Plot( 'contC', 30,   340,  300, 300 );*/

// ---------------------------------------------


resizeElement( document.getElementById('contA') );
dragElement(   document.getElementById('contA') );

resizeElement( document.getElementById('contB') );
dragElement(   document.getElementById('contB') );

resizeElement( document.getElementById('contC') );
dragElement(   document.getElementById('contC') );


// dynamically add plots using a button (extra testing)
function addplot() {
    let randomid = 'plot' + Math.random()*10000;
    createD3Plot( randomid, Math.random()*300,   Math.random()*300,   200, 200 );

    resizeElement( document.getElementById(randomid) );
    dragElement(   document.getElementById(randomid) );
}

// ---------------------------------------------

var g_mouselock = false;

function resizeElement(elmnt) {
  var element            = elmnt;
  var resizer            = document.createElement('div');
  var baseSize           = { w: parseFloat(element.style.width ),
                             h: parseFloat(element.style.height) };
  resizer.className      = 'resizer';
  resizer.style.position = 'absolute';
  resizer.style.right    = '-1px';
  resizer.style.bottom   = '-1px';
  resizer.style.cursor   = 'se-resize';
  resizer.style['color'] = '#fef';
  resizer.style['z-index'] = 33;
  resizer.contentEditable = "false";
  resizer.setAttribute("contenteditable", "false");
  element.appendChild(resizer);
  resizer.addEventListener('mousedown', initResize, false);


  function initResize(e) {
      if ( g_mouselock ) return;
      g_mouselock = true;

      e = e || window.event;
      e.preventDefault();

      window.addEventListener('mousemove', startResize, false);
      window.addEventListener('mouseup',   stopResize,  false);
  }

  function startResize(e) {
      e = e || window.event;
      e.preventDefault();
  
      element.style.width  = (e.clientX - element.getBoundingClientRect().left) + 'px';
      element.style.height = (e.clientY - element.getBoundingClientRect().top)  + 'px';

      doResize();
  }

  function stopResize(e) {
      window.removeEventListener('mousemove', startResize, false);
      window.removeEventListener('mouseup',   stopResize,  false);
      g_mouselock = false;

      doResize();
  }

  function doResize(){
      let esize = {left:   parseFloat(element.style.left),
                   top:    parseFloat(element.style.top),
                   width:  parseFloat(element.style.width),
                   height: parseFloat(element.style.height) };

      let w = ( esize.width  /baseSize.w ) * 100;
      let h = ( esize.height /baseSize.h ) * 100;

      element.children[0].style.transform = `translate(-50%,-50%) scale(${w}%,${h}%) translate(50%,50%)`;
  }
}// end resizeElement




function dragElement(elmnt) {
  var eelement = elmnt;
  var pos1     = 0;
  var pos2     = 0;
  var pos3     = 0;
  var pos4     = 0;
  var baseSize           = { w: parseFloat(eelement.style.width ),
                             h: parseFloat(eelement.style.height) };
  eelement.style.cursor = 'move';
  eelement.addEventListener('mousedown', dragMouseDown, false);

  function dragMouseDown(e) {  
    if ( g_mouselock ) return;
    g_mouselock = true;

    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();

    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    window.addEventListener('mouseup', closeDragElement, false);
    window.addEventListener('mousemove', elementDrag, false);
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    eelement.style.top  = (eelement.offsetTop  - pos2) + "px";
    eelement.style.left = (eelement.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    g_mouselock = false;
    // stop moving when mouse button is released:
    window.removeEventListener('mouseup',   closeDragElement, false);
    window.removeEventListener('mousemove', elementDrag,      false);
    g_mouselock = 0;
  

  let esize = {left:   parseFloat(eelement.style.left),
               top:    parseFloat(eelement.style.top),
               width:  parseFloat(eelement.style.width),
               height: parseFloat(eelement.style.height) };

  let x = ( esize.left );
  let y = ( esize.top  );
  let w = ( esize.width  /baseSize.w ) * 100;
  let h = ( esize.height /baseSize.h ) * 100;

  eelement.children[0].style.transform = `translate(-50%,-50%) scale(${w}%,${h}%) translate(50%,50%)`;

  eelement.style.left = x + 'px';
  eelement.style.top  = y + 'px';

  }
}// end dragElement(..)






console.log('ready..');