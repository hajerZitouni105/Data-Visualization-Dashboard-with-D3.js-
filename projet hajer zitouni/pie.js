// Chargement des données depuis le fichier CSV
d3.csv("year.csv").then(function(data) {

    // Convertir les valeurs de chaîne en nombres si nécessaire
    data.forEach(d => {
      d.count = +d.count;
      d.year = +d.year;
    });
  
    // Définition des dimensions et rayon pour la pie chart
    const pieWidth = 400;
    const pieHeight = 400;
    const pieRadius = Math.min(pieWidth, pieHeight) / 2;
  
    // Création de l'échelle de couleurs pour les tranches du graphique
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Création de l'arc pour chaque tranche du graphique
    const arc = d3.arc()
        .outerRadius(pieRadius - 10)
        .innerRadius(0);
  
    // Création de la fonction pour générer le pie chart
    const pie = d3.pie()
        .sort(null)
        .value(d => d.count);
  
    // Création du conteneur SVG pour le graphique
    const svgPie = d3.select("#pie-chart")
        .append("g")
        .attr("transform", `translate(${pieWidth / 2},${pieHeight / 2})`);
  
    // Génération des tranches du pie chart
    const path = svgPie.selectAll("path")
        .data(pie(data))
        .enter().append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        // Événements de survol pour afficher et masquer l'infobulle
        .on("mouseover", function(event, d) {
          d3.select(this)
            .style("opacity", 0.8);
          // Afficher l'infobulle avec les informations
          tooltip.style("opacity", 1)
            .html(`<strong>Year:</strong> ${d.data.year}<br><strong>Count:</strong> ${d.data.count}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px")
            .style("visibility", "visible");
        })
        .on("mouseout", function() {
          d3.select(this)
            .style("opacity", 1);
          // Masquer l'infobulle lorsque le survol est terminé
          tooltip.style("opacity", 0)
            .style("visibility", "hidden");
        });
  
    // Ajout d'une légende pour la pie chart
    const legendPie = svgPie.selectAll("#legend3")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(-60,${i * 20})`);
  
    legendPie.append("rect")
        .attr("x", pieWidth - 108)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => color(i));
  
    legendPie.append("text")
        .attr("x", pieWidth - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d.data.year);
  
    // Fonction pour afficher et masquer l'infobulle
    const tooltip = d3.select("#tooltip3");
  
  });