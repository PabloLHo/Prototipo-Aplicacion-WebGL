/*JS encargado de creación y actualización de los listener para las acciones ocurridas al cambio de tamaños de ventana*/
var seleccion = false;
var queryGeoJson;

const estiloCapa = new ol.style.Fill({
	color: [255,0,0,0]
});

const estilo = new ol.style.Fill({
	color: [0, 0, 255, 0.01]
});

const estiloLinea = new ol.style.Stroke({
	color: [0, 0, 255, 1],
	width: 1.0
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

var lyrAndalucia = new ol.layer.Vector({
	title: 'Andalucia',
	visible: true,
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: "Recursos/Geoserver/Andalucia.json"
	}),
	style: new ol.style.Style({
		fill: estilo,
		stroke: estiloLinea
	}),
	zIndex: 10
})

var lyrProvincias = new ol.layer.Vector({
	title: 'Provincias',
	visible: false,
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: "Recursos/Geoserver/Provincias.json"
	}),
	style: new ol.style.Style({
		fill: estilo,
		stroke: estiloLinea
	}),
	zIndex: 10
})

var lyrMunicipios = new ol.layer.Vector({
	title: 'Municipios',
	visible: false,
	source: new ol.source.Vector({
		format: new ol.format.GeoJSON(),
		url: "Recursos/Geoserver/Municipios.json"
	}),
	style: new ol.style.Style({
		fill: estilo,
		stroke: estiloLinea
	}),
	zIndex: 10
})

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
	}),
	zIndex: 10
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
	}),
	zIndex: 10
})


var lyrSatelite = new ol.layer.Tile({
	title: 'Satelite',
	type: 'base',
	preload: 10,
	visible:false,
	source:new ol.source.XYZ({
		url:'http://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
	})
})


var lyrTerrain = new ol.layer.Tile({
	title: "Cartografía",
	type: 'base',
	visible: true,
	source: new ol.source.OSM(),
})


var grupoCapasTerreno = new ol.layer.Group({
	title:'Comunidades',
	fold: 'open',
	layers: [
		provincias = new ol.layer.Group({
			title: 'Provincias',
			fold: 'close',
			layers: [
				municipios = new ol.layer.Group({
					title: 'Municipios',
					fold: 'close',
					layers: [
						lyrMunicipios
					]
				}),
				lyrProvincias
			]
		}),
		lyrAndalucia
	],
})

var limitaciones = new ol.layer.Group({
	title: 'Limitaciones agricolas',
	fold: 'open',
	layers: [
		lyrMarmolejoParcela,
	],
})

var grupoCapasInfo = new ol.layer.Group({
	title: 'Capas información',
	fold: 'close',
	layers: [
		lyrNitratos
	],
})

var grupoBase = new ol.layer.Group({
	title: 'Mapas base',
	layers: [
		lyrTerrain,
		lyrSatelite
	]
})

var map = new ol.Map({
	target: 'map',
	layers: [
		grupoCapasInfo,
		limitaciones,
		grupoCapasTerreno,
		grupoBase

	],
	view: new ol.View({
		center: [-416963.989296, 4927665.902460],
		zoom: 6,
		maxZoom: 19,
		minZoom: 6,
	})
})


var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    groupSelectStyle: 'none' // Can be 'children' [default], 'group' or 'none'
});


map.addControl(layerSwitcher);

map.on('singleclick', function (evt) {

	map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
		if (layer.values_.title == "Parcelas Marmolejo" && seleccion && lyrMarmolejoParcela.getVisible())
			location.href = "InformacionParcela.php?modelo=" + feature.values_.ID_RECINTO;
		else
			document.getElementById("mensaje").style.display = "block";

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
	if(lyrMarmolejoParcela.getVisible() && seleccion){
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

var fullScreen = new ol.control.FullScreen();
var zoomSlider = new ol.control.ZoomSlider();

map.addControl(zoomSlider);
map.addControl(fullScreen);
document.getElementsByClassName("ol-zoomslider-thumb")[0].innerHTML = map.getView().getZoom().toFixed(1);
document.getElementsByClassName("ol-zoomslider-thumb")[0].style.width = "100%";
document.getElementsByClassName("ol-zoomslider-thumb")[0].style.height = "10%";

var boton = document.createElement('button');
boton.innerHTML = '🫳';
boton.title = "Selección parcela"

boton.addEventListener('click', function () {
	seleccion = !seleccion;
});

var elementoDiv = document.createElement('div');
elementoDiv.className = 'ol-unselectable ol-control';
elementoDiv.appendChild(boton);
elementoDiv.style.top = "8.5px";
elementoDiv.style.right = "3em";
var NuevoControl = new ol.control.Control({ element: elementoDiv });
map.addControl(NuevoControl);

var scaleControl = new ol.control.ScaleLine({
	bar: true,
	text: true
});

map.addControl(scaleControl);

map.getView().on('change:resolution', function (e) {

	if (map.getView().getZoom() >= 14) {

		lyrSatelite.setVisible(true);
		lyrTerrain.setVisible(false);
		lyrAndalucia.setVisible(false);
		lyrProvincias.setVisible(false);
		lyrMunicipios.setVisible(false);
		lyrProvincias.setVisible(false);
		grupoCapasTerreno.values_.fold = "close";
		layerSwitcher.renderPanel();
	} else {
		grupoCapasTerreno.values_.fold = "open";
		lyrSatelite.setVisible(false);
		lyrTerrain.setVisible(true);
		lyrAndalucia.setVisible(true);
		if (map.getView().getZoom() >= 10) {
			lyrMunicipios.setVisible(true);
			municipios.values_.fold = "open";
		} else {
			lyrMunicipios.setVisible(false);
			if (map.getView().getZoom() >= 7.8) {
				lyrProvincias.setVisible(true);
				provincias.values_.fold = "open";
			} else {
				lyrProvincias.setVisible(false);
            }
		}

		layerSwitcher.renderPanel();

	}
	document.getElementsByClassName("ol-zoomslider-thumb")[0].innerHTML = map.getView().getZoom().toFixed(1);

});

var busqueda = document.createElement('input');
busqueda.type = "text";
busqueda.placeholder = "Municipio";
busqueda.id = "inpt_search";
var elementoDiv2 = document.createElement('div');
var elementoDiv3 = document.createElement('div');
elementoDiv3.id = "liveDataDiv"
elementoDiv2.className = 'ol-unselectable ol-control';
elementoDiv2.appendChild(busqueda);
elementoDiv2.appendChild(elementoDiv3);
elementoDiv2.style.top = "8.5px";
elementoDiv2.style.left = "3em";
var NuevoControl2 = new ol.control.Control({ element: elementoDiv2 });
map.addControl(NuevoControl2);

var txtVal = "";
busqueda.onkeyup = function () {
	var newVal = this.value.trim();
	if (newVal == txtVal) {

	} else {
		txtVal = this.value;
		txtVal = txtVal.trim();
		if (txtVal != "") {
			if (txtVal.length > 2) {
				elementoDiv3.innerHTML = '';
				$.ajax({
					url: "Recursos/php/obtenerMunicipio.php",
					data: {
						busqueda: txtVal,
					},
					dataType: 'json',
					success: function (response) {
						crearFilas(response, "Municipios");
                    }
				});
				
			} else {
				elementoDiv3.innerHTML = '';
			}
		} else {
			elementoDiv3.innerHTML = '';
        }
    }

}

function crearFilas(data, capa) {
	searchTable = document.createElement("table");
	var i = 0;
	for (var key in data) {
		var data2 = data[key];
		var tableRow = document.createElement("tr");
		var td1 = document.createElement("td");
		if (i == 0)
			td1.innerHTML = "<b>" + capa + "</b>";
		var td2 = document.createElement("td");
		for (var key2 in data2) {
			td2.innerHTML = data2[key2];
			td2.setAttribute("onClick", "zoom('" + data2[key2] + "')");
		}
		tableRow.appendChild(td1);
		tableRow.appendChild(td2);
		searchTable.appendChild(tableRow);

		i = i + 1;
	}

	elementoDiv3.appendChild(searchTable);

}

function zoom(nombre) {
	url = "http://localhost:8080/geoserver/ParcelasJaen/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=ParcelasJaen:municipios&CQL_FILTER=nombre+==+'" + nombre +"'&outputFormat=application/json";
	if (queryGeoJson) {
		queryGeoJson.getSource().clear();
		map.removeLayer(queryGeoJson);
    }

	queryGeoJson = new ol.layer.Vector({
		source: new ol.source.Vector({
			url: url,
			format: new ol.format.GeoJSON()
		})
	});

	queryGeoJson.getSource().on('addfeature', function () {
		map.getView().fit(
			queryGeoJson.getSource().getExtent(), { duration: 1590, size: map.getSize(), maxZoom: 19 }
		);
	});

	map.addLayer(queryGeoJson);
}
