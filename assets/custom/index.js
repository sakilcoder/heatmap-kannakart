
// var map = L.map('map').setView([43.82, -4.39], 2.5);
// var map = L.map('map').setView([10.82, -4.39], 3);
var map = L.map('map');
map.options.maxZoom = 3;
map.options.minZoom = 2;
// map.dragging.disable();
map.doubleClickZoom.disable();

var info = L.control({ position: 'bottomleft' });

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

var country_info = L.control({ position: 'topright' });
country_info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info-panle');
    this.update();
    return this._div;
};

country_info.update = function (html) {
    if (html == null)
        html = '';
    this._div.innerHTML = html;
};

country_info.addTo(map);

let countryView = 0;
var countryPanel = document.getElementsByClassName("info-panle")[0];
// L.easyButton('fa-navicon fa-lg', function () {

//     if (countryView == 1) {
//         countryView = 0;
//         countryPanel.style.display = "none";
//     } else {
//         countryView = 1;
//         countryPanel.style.display = "block";
//     }

// }).setPosition('topright').addTo(map);



function getColor(d) {
    return d > 5 ? '#084594' :
        d > 4 ? '#2171b5' :
            d > 3 ? '#4292c6' :
                d > 2 ? '#6baed6' :
                    d > 1 ? '#9ecae1' :
                        d > 0 ? '#c6dbef' : '#fff';
}


function styleCountryFeature(feature) {
    return {
        weight: .6,
        opacity: .8,
        color: '#bdbdbd',
        dashArray: '3',
        fillOpacity: 1,
        fillColor: getColor(feature.properties.sumWeightCollected_tons)
    };
}


var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info-legend legend');
    var grades = [0, 1, 2, 3, 4, 5];
    var labels = [];
    var from, to;
    labels.push('<h5>Tons of Waste</h5>');
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? ' &ndash; ' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

let legendView = 0;
var legendPanel = document.getElementsByClassName("info-legend")[0];
L.easyButton('fa-map-o fa-lg', function () {
    if (legendView == 1) {
        legendView = 0;
        legendPanel.style.display = "none";
    } else {
        legendView = 1;
        legendPanel.style.display = "block";
    }
}).setPosition('bottomright').addTo(map);

let countryLayer;
let cickedCountry = '';
const countries_stats = function () {
    $.get(countries_stats_url, function (data) {
        // console.log(data);
        for(i=0;i<data.length;i++){
            data[i].sumWeightCollectedPercentage = parseFloat(data[i].sumWeightCollectedPercentage);
        }
        
        const cstats = data;
        // console.log(cstats);
        let globe = { "type": "FeatureCollection" }
        let features = [];
        for (i = 0; i < countries.features.length; i++) {

            let properties = {}
            let cdata = _.where(cstats, { country_iso3_code: countries.features[i].properties.ISO_A3.trim() });
            if (cdata.length > 0) {
                // console.log(countries.features[i].properties.ADMIN);
                // console.log(parseFloat(cdata[0].sumWeightCollected_tons));
                properties.ADMIN = countries.features[i].properties.ADMIN;
                properties.ISO_A3 = countries.features[i].properties.ISO_A3;
                properties.ISO_A2 = countries.features[i].properties.ISO_A2;
                properties.country_iso_number = cdata[0].country_iso_number;
                properties.country_full_name = cdata[0].country_full_name;
                properties.continent_iso_code = cdata[0].continent_iso_code;
                properties.continent_name = cdata[0].continent_name;
                properties.sumWeightCollected = parseFloat(cdata[0].sumWeightCollected);
                properties.avgWeightCollected = parseFloat(cdata[0].avgWeightCollected);
                properties.maxWeightCollected = parseFloat(cdata[0].maxWeightCollected);
                properties.sumWeightCollectedPercentage = parseFloat(cdata[0].sumWeightCollectedPercentage);
                properties.sumWeightCollected_tons = parseFloat(cdata[0].sumWeightCollected_tons);
            } else {
                properties.ADMIN = countries.features[i].properties.ADMIN;
                properties.ISO_A3 = countries.features[i].properties.ISO_A3;
                properties.ISO_A2 = countries.features[i].properties.ISO_A2;
                properties.country_iso_number = '';
                properties.country_full_name = '';
                properties.continent_iso_code = '';
                properties.continent_name = '';
                properties.sumWeightCollected = '';
                properties.avgWeightCollected = '';
                properties.maxWeightCollected = '';
                properties.sumWeightCollected_tons = '';
            }

            let feature = { "type": "Feature", "properties": properties, "geometry": countries.features[i].geometry };
            features.push(feature);

        }
        
        globe.features = features;


        countryLayer = L.geoJSON(globe, {
            style: styleCountryFeature,
            onEachFeature: onEachCountry,
            attribution: 'One Earth - One Ocean'
        }).addTo(map);


        $.get(global_stats_url, function (data) {
            
            info.update = function (props) {
                let info_str = '<span>';

                info_str += '<h5 style="color: #6baed6; text-align: center;">Worldwide</h5>';
                info_str += '<h3 style="color: #084594; font-weight:bold;text-align: center;">' + numberToEuropeanFormat(parseFloat(data[0].sumWeightCollected)) + '</h3>';
                info_str += '<p style="color: #6baed6;text-align: center;font-size:10px">Kilograms of waste collected</p>';
                
                let fs = _.filter(features, function(v) { return (parseFloat(v.properties.sumWeightCollectedPercentage) > 0 ) });
                fs = _.sortBy(fs, (obj) => obj.properties.sumWeightCollectedPercentage);
                fs = fs.reverse();
                console.log(fs);

                for (i = 0; i < fs.length; i++) {
                    info_str += '<strong style="font-size:12px;color: #31708f"> ' + fs[i].properties.ADMIN + '</strong>';
                    info_str += '<div class="progress"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="' + fs[i].properties.sumWeightCollectedPercentage + '" aria-valuemin="0" aria-valuemax="100" style="width:' + fs[i].properties.sumWeightCollectedPercentage + '%">';
                    info_str += fs[i].properties.sumWeightCollectedPercentage + '% (' + parseInt(fs[i].properties.sumWeightCollected_tons) + ' tons) </div></div>';
                }

                this._div.innerHTML = info_str;
            };

            info.addTo(map);
            map.fitBounds(countryLayer.getBounds());
        });

    });
}

countries_stats();


L.easyButton('fa-home fa-lg', function () {
    // map.setView([10.82, -4.39], 2);
    map.fitBounds(countryLayer.getBounds());
}).addTo(map);





// console.log(document.getElementByClass("legend").style.display);
// document.getElementsByClassName('legend')[0].style.display='none';
