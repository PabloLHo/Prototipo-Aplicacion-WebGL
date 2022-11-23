/*JS encargado de creación y actualización de los listener para las acciones ocurridas al cambio de tamaños de ventana*/

const estiloCapa = new ol.style.Fill({
	color: [255,0,0,0]
});

const estiloInteriorCapa = new ol.style.Stroke({
	color: [255,0,0,1],
	width: 1.0
});

// var lyrMarmolejoParcela = new ol.layer.Vector({
  // title: 'JaenVector',
  // visible: true,
  // source: new ol.source.Vector({
	// format: new ol.format.GeoJSON(),
	// url:"http://localhost:8080/geoserver/ParcelasJaen/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ParcelasJaen%3Aparcelasjaen&outputFormat=application%2Fjson"
  // }),
// })

var lyrMarmolejoParcela = new ol.layer.Vector({
	title: 'Parcelas Marmolejo',
	visible: false,
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url:"Recursos/Geoserver/ParcelasMarmolejo.json"
	}),
	style: new ol.style.Style({
		fill: estiloCapa,
		stroke: estiloInteriorCapa
	})
})


// var lyrJaenParcela = new ol.layer.Tile({
	// title:'Parcelas Jaen',
	// visible: false,
	// source:new ol.source.TileWMS({
		// url:'http://localhost:8080/geoserver/wms?',
		// params:{
			// VERSION:'1.1.1',
			// FORMAT:'image/png',
			// TRANSPARENT:true,
			// LAYERS:'ParcelasJaen:parcelasjaen'
		// }
	// })
// })


var lyrSatelite = new ol.layer.Tile({
	title:'Satelite',
	type: 'base',
	preload: 10,
	visible:true,
	source:new ol.source.XYZ({
		url:'http://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
	})
})

var lyrTerrain = new ol.layer.Tile({
	title: "Terreno",
	type: 'base',
	visible: false,
	source: new ol.source.Stamen({layer: "terrain"}),
})

var map = new ol.Map({
	target: 'map',
	layers: [
		new ol.layer.Group({
            title:'Mapas base',
            layers:[
				lyrSatelite,
				lyrTerrain
            ]
        }),
		new ol.layer.Group({
			title:'Capas superpuestas',
			fold: 'open',
            layers:[
				lyrMarmolejoParcela,
				// lyrJaenParcela,
            ]
		})
		
	],
	view: new ol.View({
		center: [-462469.89837683, 4587686.25458488],
		zoom: 18,
		maxZoom: 19,
		minZoom: 3,
	})
})

var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: 'Leyenda', // Optional label for button
    groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
});

map.addControl(layerSwitcher);
map.on('singleclick', function(evt) {
	map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
		if(feature.values_.CD_PARCELA == "211")
			location.href = "InformacionParcela.php?modelo=Parcela_1";
	})
})


const selectStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255, 0, 0, 0.2)',
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(255, 0, 0, 1)',
    width: 1.5,
  }),
});

let selected = null;
map.on('pointermove', function (e) {
	if(lyrMarmolejoParcela.getVisible()){
		if (selected !== null) {
			selected.setStyle(undefined);
			selected = null;
		}

		map.forEachFeatureAtPixel(e.pixel, function (f) {
			document.body.style.cursor = "pointer";
			selected = f;
			f.setStyle(selectStyle);
			return true;
		});
	}else{
		document.body.style.cursor = "default";
	}

});


function actualiza(){ 
	if(map.getView().getZoom() > 11){
		lyrSatelite.setVisible(true);
		lyrTerrain.setVisible(false);
	}else{
		lyrSatelite.setVisible(false);
		lyrTerrain.setVisible(true);
		lyrMarmolejoParcela.setVisible(false);
	}
}

setInterval(actualiza,1000);