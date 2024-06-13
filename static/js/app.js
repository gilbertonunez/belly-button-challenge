// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;


    // Filter the metadata for the object with the desired sample number
    function metaFilter(row) {
      return row.id == sample
    };
    let theFilter = metadata.filter(metaFilter)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let item in theFilter) {
      panel.append('p').text(`${item}: ${theFilter[key]}`)
    };
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;


    // Filter the samples for the object with the desired sample number
    function sampleFilter(row) {
      return row.id == sample
    };
    let sampFilter = samples.filter(sampleFilter)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampFilter.otu_ids
    let otu_labels = sampFilter.otu_labels
    let sample_values = sampFilter.sample_values

    // Build a Bubble Chart
    let bubbleChart = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
  
    };

    let bubbles = [bubbleChart];

    let bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis:{
        title:"OTU ID"},
      yaxis: {
        title: "Number of Bacteria"
      },
      height: 500,
      width: 900,

    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble',bubbles, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otuString = otu_ids.map(data => String(`OTU ${data}`));

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let xyBar = {
      x: sample_values.slice(0,10).reverse(),
      y: otuString.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis:{
        title:"Number of Bacteria"},
      height: 500,
      width: 800,
    }

    let barData = [xyBar];

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const nameField = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset')


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < nameField.length; i++) {
      id = nameField[i]
      dropdown.append('option').text(id)
    }

    // Get the first sample from the list
    let firstSamp = nameField[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSamp)
    buildCharts(firstSamp)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Initialize the dashboard
init();
