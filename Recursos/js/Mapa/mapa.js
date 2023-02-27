/*JS encargado de creación y actualización de los listener para las acciones ocurridas al cambio de tamaños de ventana*/

const estiloCapa = new ol.style.Fill({
	color: [255,0,0,0]
});


const estiloLineaCapa = new ol.style.Stroke({
	color: [255,0,0,1],
	width: 1.0
});

const estiloCapaNitr = new ol.style.Fill({
	color: [0,255,0,0.15]
});


const estiloLineaCapaNitr = new ol.style.Stroke({
	color: [0,0,255,1],
	width: 1.5
});


var lyrMarmolejoParcela = new ol.layer.Vector({
	title: 'Parcelas Marmolejo',
	visible: false,
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url:"Recursos/Geoserver/ParcelasMarmolejo.json"
	}),
	style: new ol.style.Style({
		fill: estiloCapa,
		stroke: estiloLineaCapa
	})
})

var lyrNitratos = new ol.layer.Vector({
	title: 'Contaminación por Nitrato',
	visible: false,
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url:"Recursos/Geoserver/Nitratos.json"
	}),
	style: new ol.style.Style({
		fill: estiloCapaNitr,
		stroke: estiloLineaCapaNitr
	})
})


var lyrSatelite = new ol.layer.Tile({
	title:'Satelite',
	preload: 10,
	visible:true,
	source:new ol.source.XYZ({
		url:'http://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
	})
})


var lyrTerrain = new ol.layer.Tile({
	title: "Cartografía",
	visible: false,
	source: new ol.source.OSM(),
})


var grupoCapas = new ol.layer.Group({
	title:'Capas',
	fold: 'open',
    layers:[
		lyrMarmolejoParcela,
		lyrNitratos,
    ]
})

var map = new ol.Map({
	target: 'map',
	layers: [
		new ol.layer.Group({
            title:'Mapas base',
            layers:[
				lyrTerrain,
				lyrSatelite
            ]
        }),
		grupoCapas,
	],
	view: new ol.View({
		center: [-462469.89837683, 4587686.25458488],
		zoom: 18,
		maxZoom: 19,
		minZoom: 6,
	})
})


var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
	// startActive: true,
    groupSelectStyle: 'none' // Can be 'children' [default], 'group' or 'none'
});


map.addControl(layerSwitcher);
map.on('singleclick', function (evt) {

	map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){

		location.href = "InformacionParcela.php?modelo=" + feature.values_.ID_RECINTO;

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
			var arrayDeCadenas = f.id_.split(".");
			if(arrayDeCadenas[0] == "parcelasmarmolejodisuelta"){

				document.body.style.cursor = "pointer";
				selected = f;
				f.setStyle(selectStyle);
				return true;

			}
		});
	}else{
		document.body.style.cursor = "default";
	}

});


var mousePosition = new ol.control.MousePosition({
	className: 'mousePosition',
	projection: "EPSG:3857",
	coordinateFormat: function(coordinate){
		return ol.coordinate.format(coordinate, '{x} , {y}',6);
	}
});

map.addControl(mousePosition);

var scaleControl = new ol.control.ScaleLine({
	bar: true,
	text: true
});

map.addControl(scaleControl);
