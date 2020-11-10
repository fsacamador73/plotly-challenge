// Create a function to load the individual IDs into the Dropdown Menu and initializes the charts
function init() {
  // Select the element that contains the selector from the html (#selDataset)
  var selector = d3.select("#selDataset");
  
  // Get the json file
  d3.json("samples.json").then((personID) => {
    personID.names.forEach((id) => {
      selector
        .append("option")
        .text(id)
        .property("value", id);
    });
    
  // Use the first ID from the list to initialize the charts
      const firstSample = personID.names[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }

  // Initialize the page
init();
  
// Create a function to get the new id when the dropdown menu changes and rebuild the charts with this new id
function optionChanged(newid) {
  buildMetadata(newid);
  buildCharts(newid);
};

// Create a function to retrieve the sample information for the selected personID
function buildMetadata(id) {

  // Get the json file
  d3.json("samples.json").then((data) => {

      var allData = data.metadata;
      var selectedID = allData.filter(data => data.id.toString() === id)[0];

      // Select the element that contains the demographic information from the html (#sample-metadata)
      var demographics = d3.select("#sample-metadata").html("");
      
      // Populate the demographic information with the selected personID
      for (var key in selectedID) {
          demographics
              .append("h5")
              .text(key + ": " + selectedID[key] + "\n");
      };

  //Create the Gage Chart

  d3.json("samples.json").then(function(response) {

    // Data for the chart
    var data = [
      { type: 'indicator',
        value: selectedID.wfreq,
        marker: {size: 18, color:'850000'},
        showlegend: false,
        hoverinfo: 'none'
      },
      // Gauge steps
      { 
        values: [50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50/9,50],
        rotation: 90,
        text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:["#7fb384", "#84bb8a", "#86be7f", "#b6cc8a", "#d4e494", "#e4e8ae", "#e8e6c8", "#f3f0e4", "#f7f2eb", "#ffffff"]},
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: 'none',
        hole: .55,
        type: 'pie',
        showlegend: false
      }
    ];

    // Layout for the chart
    var layout = {
      title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
    };

  // Plot the gage chart
  Plotly.newPlot("gauge", data, layout);
      
  });    
});
};

// Create a function to generate the bar chart and the bubble chart
function buildCharts(id) {

  // Get json file
  d3.json("samples.json").then((data) => {
  
  // All sample data
  var allSamples = data.samples;
  
  // Filter the sample data using the selected ID
  var sampleID = allSamples.filter(data => data.id.toString() === id)[0];

  
  // Top 10 labels
  var TopTenLabels = sampleID.otu_labels.slice(0, 10);

  
  // Top 10 Values
  var TopTenValues = sampleID.sample_values.slice(0, 10).reverse();


  // Top 10 IDs
  var TopTenIds = (sampleID.otu_ids.slice(0, 10)).reverse();


  var OTU = TopTenIds.map(d => "OTU " + d)


  // Create the Bar Chart

  // Create the data for the bar chart
  var data1 = [{
      x: TopTenValues,
      y: OTU,
      text: TopTenLabels,
      type:"bar",
      orientation: "h"
  }];

  // Create the layout for the bar chart
  var layout1 = {
      title: "Top 10 OTU",
      yaxis:{
          tickmode:"linear"
      },
      margin: { 
          t: 60, 
          b: 0 
      } 
  };

  // Plot bar chart
  Plotly.newPlot("bar", data1, layout1);


  // Create the Bubble Chart
    var trace = {
      x: sampleID.otu_ids,
      y: sampleID.sample_values,
      text: sampleID.otu_labels,
      mode: 'markers',
      marker: {
        size: sampleID.sample_values,
        color: sampleID.otu_ids
      },
      type: 'bubble'
    };

    var data2 = [trace];

    var layout2 = {
      title: "Belly Button Diversity",
      xaxis: {title: "OTU ID"},
      showlegend: false
    };

    Plotly.newPlot("bubble", data2, layout2);
});
};