 const width = 600;
const height = 400;

// Create SVG element
const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width+100)
    .attr("height", height)
    .append("g");
            // Create a container for map elements

    const mapContainer = svg.append("g");

        // Load the CSV data
        d3.csv("countrycount.csv").then(function(data) {
        // Process data if needed (e.g., convert strings to numbers)
        
        // Create a color scale
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(data, d => +d.Count)]); // Adjust the domain according to your data
        
        // Load the GeoJSON data
        d3.json("custom.geo (1).json").then(function(geojson) {
        // Create a projection
        const projection = d3.geoMercator()
            .fitSize([width, height], geojson)
            .scale(70)
            .center([20,-40])
        
        // Create a path generator
        const path = d3.geoPath()
            .projection(projection);
        
        // Draw the map
        svg.selectAll("path")
            .data(geojson.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", d => {
                // Find corresponding data in the CSV
                const countryData = data.find(country => country.Country === d.properties.iso_a3);
                return countryData ? colorScale(+countryData.Count) : "gray"; // Default color if data not found
            })
            
            .on("mouseover", function(event, d) {
                        d3.select(this)
                            .transition()
                            .duration('50')
                            .style("stroke", "#3f3b3b")
                            .style('opacity', '.55');
                        d3.select("#tooltip")
                            .html("<b>Pays:</b> " + d.properties.name + "<br><b>Nombre D'athlètes:</b> " + data.find(country => country.Country === d.properties.iso_a3).Count)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 30) + "px")
                            .style("visibility", "visible");
                    })
                    .on("mouseout", function(d) {
                        d3.select(this)
                            .transition()
                            .duration('50')
                            .style('opacity', '.9');
                        d3.select("#tooltip")
                            .style("visibility", "hidden");
                    });
                     // Add zoom functionality
            const zoom = d3.zoom()
                    .scaleExtent([1, 8])
                    .on("zoom", zoomed);

                svg.call(zoom);

                function zoomed(event) {
                    svg.attr("transform", event.transform);
                }

                // Zoom buttons event handlers
d3.select("#zoom-in").on("click", function() {
    svg.transition().duration(750).call(zoom.scaleBy, 1.5);
});

d3.select("#zoom-out").on("click", function() {
    svg.transition().duration(750).call(zoom.scaleBy, 0.8);
});
            
        });
        
    
        
        // Add legend
        const legendWidth = 200;
        const legendHeight = 20;
        const legendPadding = 5;
        
        const legendScale = d3.scaleLinear()
         .domain([0, d3.max(data, d => +d.Count)])
         .range([0, legendWidth/1.9+10]);
        
        const legendAxis = d3.axisBottom(legendScale)
         .ticks(5)
         .tickSize(legendHeight);
        
        const legend = svg.append("g")
         .attr("class", "legend")
         .attr("transform", `translate(${width - legendWidth - legendPadding},${height - legendHeight - legendPadding})`);
        
        legend.append("g")
         .attr("transform", `translate(0, ${-legendHeight })`)
         .call(legendAxis);
        
        // Append gradient to legend
        const defs = svg.append("defs");
        
        const linearGradient = defs.append("linearGradient")
         .attr("id", "legendGradient")
         .attr("x1", "0%")
         .attr("y1", "0%")
         .attr("x2", "100%")
         .attr("y2", "0%");
        
        linearGradient.selectAll("stop")
         .data(colorScale.range())
         .enter().append("stop")
         .attr("offset", (d, i) => i / (colorScale.range().length -1))
         .attr("stop-color", d => d);
        
        legend.append("rect")
         .attr("x", 0)
         .attr("y", -legendHeight )
         .attr("width", legendWidth /1.74)
         .attr("height", legendHeight /1.7)
         .style("fill", "url(#legendGradient)");
        
        legend.append("text")
         .attr("x", -legendPadding+150)
         .attr("y", -legendHeight-5)
         .style("text-anchor", "end")
         .text("Nombre des athletes");
        
         
        });