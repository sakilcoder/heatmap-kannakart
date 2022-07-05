
let target_e;

function onEachCountry(feature, layer) {

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        // click: zoomToFeature,
    });

    var popup = L.popup();
    // console.log(feature);
    let popup_string = '';

    if(feature.properties.sumWeightCollected_tons==''){
        popup_string='<table>'+
            '<tr><td>Admin: </td><th>' + feature.properties.ADMIN + '</th></tr>'+
            '<tr><td>ISO A3: </td><th>' + feature.properties.ISO_A3 + '</th></tr>'+
            '<tr><td>ISO A2: </td><th>' + feature.properties.ISO_A2 + '</th></tr>'+
        '</table>';

    }else{
        popup_string='<table>'+
            '<tr><th colspan=2 align="center">' + feature.properties.ISO_A2 + ' : ' + feature.properties.ADMIN + ' (Waste Collected)</th></tr>'+
            '<tr><th>Sum</th><th>: ' + numberToEuropeanFormat(feature.properties.sumWeightCollected) + ' (' +  feature.properties.sumWeightCollectedPercentage.toFixed(2) + '%)</th></tr>'+
            '<tr><th>Avg</th><th>: ' + numberToEuropeanFormat(feature.properties.avgWeightCollected) + '</th></tr>'+
            '<tr><th>Max</th><th>: ' + numberToEuropeanFormat(feature.properties.maxWeightCollected) + '</th></tr>'+
            // '<tr><td>Max of Weight Collected: </td><th>' + feature.properties.sumWeightCollectedPercentage.toFixed(2) + '(%)</th></tr>'+
            '<tr><th>Sum (tons)</th><th>: ' + numberToEuropeanFormat(feature.properties.sumWeightCollected_tons) + '</th></tr>'+
        '</table>';
    }


    // popup.setContent(popup_string);
    // layer.bindPopup(popup, popupOptions);

    layer.on('click', function (e) {

        if(feature.properties.sumWeightCollected=='')
            return;

        // if(cickedCountry != feature.properties.ADMIN){
        //     let newLayer=e.target;

        //     newLayer.setStyle({
        //         'fillColor': '#bdbdbd'
        //     }).addTo(map);
        // }

        // target_e=e;
        // cickedCountry = feature.properties.ADMIN;

        // this.setStyle({
        //     'fillColor': '#ffff00'
        // });
        
        countryView = 1;
        countryPanel.style.display = "block";

        let c_info='<a href="#" class="pull-right" style="padding:2px 5px 0 0" onclick="closeInfoPanel();"><i class="fa fa-close"></i></a>';
        c_info  += '<div class="thumbnail"><h4 style="color: #6baed6; text-align: center;">'+ feature.properties.ADMIN +'</h4>';
        c_info  += '<p style="color: #6baed6;text-align: center;font-size:14px">Waste Collected</p>';
        c_info += '<div class="caption text-center">';
        c_info  += '<h3 style="color: #084594; font-weight:bold;">' + numberToEuropeanFormat(parseFloat(feature.properties.sumWeightCollected)) + ' KG</h3>';
        c_info  += '<h3 style="color: #084594; font-weight:bold;">' + numberToEuropeanFormat(parseFloat(feature.properties.sumWeightCollected_tons)) + ' Tons</h3>';
        c_info  += '</div></div>';

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    
        country_info.update(c_info);

        // let url = active_country_url + feature.properties.ISO_A2 + active_country_token;
        // $.get(url, function (data) {
        //     console.log(data);

        //     let c_info='<a href="#" class="pull-right" style="padding:2px" onclick="closeInfoPanel();">X</a>';
        //     c_info  += '<div class="thumbnail"><h5 style="color: #6baed6; text-align: center;">'+ feature.properties.ADMIN +'</h5>';
        //     c_info  += '<p style="color: #6baed6;text-align: center;font-size:10px">Kilograms of waste collected</p>';
        //     c_info += '<div class="caption text-center">';

        //     for(i=0;i<data.length;i++){
        //         c_info  += '<span>' + data[i].name +': ' + numberToEuropeanFormat(parseFloat(data[i].sumWeightCollected)) + ' KG </span><br>';
        //     }
        //     c_info  += '</div></div>';

        //     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        //         layer.bringToFront();
        //     }
        
        //     country_info.update(c_info);
        

        // });
        // console.log(e);
    });

    // layer.on('mouseover', function (e) {
        // var popup = e.target.getPopup();
        // popup.setLatLng(e.latlng).openOn(map);

        // this.setStyle({
        //     'fillColor': '#5bc0de'
        // });
    // });

    // layer.on('mouseout', function (e) {
        // e.target.closePopup();
        // this.setStyle({
        //     'fillColor': '#719b6b'
        // });
    // });

}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#5bc0de',
        dashArray: '',
        fillOpacity: 0.7
    });

    // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //     layer.bringToFront();
    // }

    // info.update(layer.feature.properties);
}

function resetHighlight(e) {
    // if(countryClicked==)
    let layer = e.target;
    // if(layer.feature.properties.ADMIN == cickedCountry)
    //     return;
    countryLayer.resetStyle(layer);
    // info.update();
}

function closeInfoPanel(){
    cickedCountry = '';
    countryView = 0;
    countryPanel.style.display = "none";

    // let layer = target_e;
    // console.log(layer);
    // layer.setStyle({
    //     'fillColor': '#bdbdbd'
    // });

}