// let map = L.map('map').setView([37.560, -85.482], 7.4, {
//     minZoom: 7,
//     maxZoom: 8,
//     zoomSnap: 0.5,
//     zoomControl: false,

//     maxBounds: L.latLngBounds([38.843986,-89.2957132], [36.549362,-80.918608]),
// });



const map = L.map('map').setView([37.360, -85.482], 7.4, {
    zoomSnap: 0.5,
    maxBounds: L.latLngBounds([38.843986,-89.2957132], [36.549362,-80.918608]),
    keyboard: false
}
).setMaxZoom(8)
.setMinZoom(7);




console.log(map.getMaxZoom());
console.log(map.getMinZoom());
console.log(map.getZoom());












// mapbox API access Token
//  var accessToken = "pk.eyJ1IjoiY294Y285NiIsImEiOiJja3BrY2k0ZHgwa3Y0MnZwYTl3NWs4emJ5In0.ItwJEcRmF0LwO1DkHFgpZw";

// request a mapbox raster tile layer and add to map
// L.tileLayer(
//         `https://api.mapbox.com/styles/v1/coxco96/ckwpuursz33ao15ohyw9i97ef/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY294Y285NiIsImEiOiJja3BrY2k0ZHgwa3Y0MnZwYTl3NWs4emJ5In0.ItwJEcRmF0LwO1DkHFgpZw`, {
//             attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//             maxZoom: 18,
//             //id: "light-v10",
//             accessToken: 'pk.eyJ1IjoiY294Y285NiIsImEiOiJja3BrY2k0ZHgwa3Y0MnZwYTl3NWs4emJ5In0.ItwJEcRmF0LwO1DkHFgpZw',
//             //mapbox://styles/coxco96/ckwpuursz33ao15ohyw9i97ef
//             zoomControl: false,
//         }
//     )
//     .addTo(map);







// omnivore.csv("data/pharmwithlatlon.csv").addTo(map);

// check for errors

omnivore
    .csv("data/pharmwithlatlon.csv")
    .on("ready", function (e) {
        console.log("all good so far");
        console.log(e.target);
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
        color: "red",
        opacity: .2
    });


    // fit the bounds of the map to one of the layers
    map.fitBounds(pharmLayer.getBounds(), {
        padding: [50, 50],
    });

    //getPharmTotals(totalPharmPills)
    resizeCircles(pharmLayer);
    //sequenceUI(pharmLayer);

} // end drawMap()



function calcRadius(val) {
    const radius = Math.sqrt(val / Math.PI);
    return radius * .5; // adjust .5 as a scale factor
} // end calcRadius function




// function getPharmTotals(json) {
//     const pharmTotals = json;
//     return pharmTotals;
//     //console.log(pharmTotals);

// } // end getPharmTotals


function resizeCircles(pharmLayer) {
    pharmLayer.eachLayer(function (layer) {
        const radius = (calcRadius(
            Number(layer.feature.properties["pill_count"])) / 15);
        layer.setRadius(radius);
    });

    retrieveInfo(pharmLayer, infoOne);
} // end resizeCircles




function retrieveInfo(pharmLayer, info) {
   

    pharmLayer.on("mouseover", function (e) {
       //blueScreen.style.display = "block";
       

         // raise opacity level as visual affordance
         e.layer.setStyle({
            fillOpacity: 1,
        });

        // access properties of target layer
    const props = e.layer.feature.properties;

    // create a function with a short name to select elements
    const $ = function (x) {
        return document.querySelector(x);
    };
    console.log(props);
   // $('h4 span').innerHTML = props.COUNTY;

   //$('h4 span').innerHTML = props.COUNTY;

   $('#blue_screen').innerHTML = `<span style=" background-color: red">${props.BUYER_NAME} in ${props.BUYER_COUNTY} County</span> distributed <span style=" background-color: red">${props.pill_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span> hydrocodone and oxycodone pills in ${props.year}.`;
   console.log($('#blue_screen'));

    }) // end mouseover

    pharmLayer.on("mouseout", function(e) {
        e.layer.setStyle({
            fillOpacity: .01
        })
    }) // end mouseout

    

} // end retrieveInfo