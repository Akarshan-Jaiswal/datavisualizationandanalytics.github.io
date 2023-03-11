const handleZoom = (e) => g.attr('transform', e.transform);
const zoom = d3.zoom().on('zoom', handleZoom);