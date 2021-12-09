const map = L.map('map').setView([38.360, -85.482], 7.4, {
    zoomSnap: .1,
    zoomControl: false,
    maxBounds: L.latLngBounds([38.843986,-89.2957132], [36.549362,-80.918608]),
    keyboard: false
}
).setMaxZoom(12)
.setMinZoom(6);

map.removeControl(map.zoomControl); // I don't under why I had to use this to get the zoom control off when zoomControl is set to false


console.log(map.getMaxZoom());
console.log(map.getMinZoom());
console.log(map.getZoom());




omnivore
    .csv("data/updatedpharmcsv.csv")
    .on("ready", function (e) {
        console.log("all good so far");
       // console.log(e.target);
        // getPharmTotals(totalPharmPills);
        drawMap(e.target.toGeoJSON());
        // drawLegend(e.target.toGeoJSON());
    })
    .on("error", function (e) {
        console.log("there's a problem");
        console.log(e.error[0].message);
    });





function drawMap(data) {
    // access to data here
    console.log(data);
    const options = {
        pointToLayer: function (feature, ll) {
            return L.circleMarker(ll, {
                opacity: 1,
                weight: 1.5,
                fillOpacity: .01,
                // radius: calcRadius(getPharmTotals(totalPharmPills))
                radius: 10
            });
        },
    };
    // create a layer from geoJSON data
    const pharmLayer = L.geoJson(data, options).addTo(map);


    // color the layers different colors
    pharmLayer.setStyle({
        color: "#fc0808", // lightblue and red both look nice
        opacity: .65,
        fillOpacity: .1
    });


    // fit the bounds of the map to one of the layers
    map.fitBounds(pharmLayer.getBounds(), {
        padding: [50, 50],
    });

    //getPharmTotals(totalPharmPills)
    resizeCircles(pharmLayer, 2007);
    sequenceUI(pharmLayer);

} // end drawMap()



function calcRadius(val) {
    const radius = Math.sqrt(val / Math.PI);
    return radius; // adjust .5 as a scale factor
} // end calcRadius function




// function getPharmTotals(json) {
//     const pharmTotals = json;
//     return pharmTotals;
//     //console.log(pharmTotals);

// } // end getPharmTotals


function resizeCircles(pharmLayer, year) {
    pharmLayer.eachLayer(function (layer) {
        const radius = (calcRadius(
            Number(layer.feature.properties[year]))*6);
        layer.setRadius(radius);
    });

    retrieveInfo(pharmLayer, year);
} // end resizeCircles




function retrieveInfo(pharmLayer, year) {

    // select the element and reference with variable
    const info = document.querySelector('#blue_screen');

    // detect mouseover events
    pharmLayer.on("mouseover", function (e) {
       info.style.display = "block";
       

         // raise opacity level as visual affordance
         e.layer.setStyle({
            fillOpacity: .8,
        });

        // access properties of target layer
    const props = e.layer.feature.properties;

    // create a function with a short name to select elements
    const $ = function (x) {
        return document.querySelector(x);
    };
    //console.log(props);
   // $('h4 span').innerHTML = props.COUNTY;

   //$('h4 span').innerHTML = props.COUNTY;

   $('#blue_screen').innerHTML = `<span style=" background-color: red">${props.BUYER_NAME}</span> distributed <span style=" background-color: red">${Number(props[year]).toFixed(2)}</span> hydrocodone and oxycodone pills per person in ${props.BUYER_COUNTY} County in ${year}.`;
// commas in numbers: ${props[2006].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
   console.log($('#blue_screen'));

    }) // end mouseover

    pharmLayer.on("mouseout", function(e) {
        info.innerHTML = 'Hover over each pharmacy to explore how many pills it distributed.';
        e.layer.setStyle({
            fillOpacity: .01
           
        })
    }) // end mouseout

    //console.log(year);

    // document.addEventListener("mousemove", function (e) {
    //     // If the page is on the small screen, calculate the position of the info window
    //     if (window.innerWidth < 768) {
    //         info.style.right = "10px";
    //         info.style.top = `${window.innerHeight * 0.25 + 5}px`;
    //     } else {
    //         // Console the page coordinates to understand positioning
    //         //   console.log(e.pageX, e.pageY);

    //         // offset info window position from the mouse position
    //         (info.style.left = `${e.pageX + 6}px`),
    //         (info.style.top = `${e.pageY - info.offsetHeight - 25}px`);

    //         // if it crashes into the right, flip it to the left
    //         if (e.pageX + info.offsetWidth > window.innerWidth) {
    //             info.style.left = `${e.pageX - info.offsetWidth - 6}px`;
    //         }
    //         // if it crashes into the top, flip it lower right
    //         if (e.pageY - info.offsetHeight - 25 < 0) {
    //             info.style.top = `${e.pageY + 6}px`;
    //         }
    //     }
    // });

} // end retrieveInfo


function sequenceUI(pharmLayer) {
    //console.log("sequence ui")
  // create Leaflet control for the slider
  const sliderControl = L.control({
    position: "topleft",
});


sliderControl.onAdd = function (map) {
    const controls = L.DomUtil.get("slider");

    L.DomEvent.disableScrollPropagation(controls);
    L.DomEvent.disableClickPropagation(controls);

    return controls;
};

// add it to the map
sliderControl.addTo(map);

// add sliderYear info box
const sliderYear = L.control({
    position: "bottomleft",
});

// when the sliderYear box is added to the map
sliderYear.onAdd = function () {
    // select the slider grade box using id of it
    const sliderBox = L.DomUtil.get("sliderYear");
    // disable scroll and click functionality
    L.DomEvent.disableScrollPropagation(sliderBox);
    L.DomEvent.disableClickPropagation(sliderBox);
    // document.querySelector("#sliderYear span").innerHTML = `${currentGrade}`;
    

    // return the selection
    return sliderBox;
};
    sliderYear.addTo(map);
    //console.log(currentGrade);
    //console.log(document.querySelector("#sliderYear"));

     // select the slider's input and listen for change
     const slider = document.querySelector("#slider input");
     // select the slider's input and listen for change
     slider.addEventListener("input", function (e) {
         console.log(e.target.value);


         // current value of slider is current grade level
         var year = e.target.value;
         console.log(year);
         

         // resize the circles with updated grade level
         resizeCircles(pharmLayer, year);

             document.querySelector("#sliderYear").innerHTML = `Year: ${year}`;
           
         

     });


} // end sequenceUI









