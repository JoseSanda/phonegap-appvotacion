'use strict';
var controlador = {    
    _$botonCargarPregunta : $('#cargarPregunta'),
    _$botonRespuestaSi : $('#responderSi'),
    _$botonRespuestaNo : $('#responderNo'),
    _$pantallaBienvenida : $('#bienvenida'),
    _$pantallaPregunta : $('#pregunta'),
    _$pantallaRespuesta : $('#resultados'),
    
    _inicializarBienvenida : function () {
     var that = this;    
     this._$botonCargarPregunta.click(function(){
          that._cargarPregunta();          
      });
      this._$botonRespuestaSi.click(function(){
          that._submitRespuesta($(this).text());
          that._navegar(that._$pantallaRespuesta);
      });
      this._$botonRespuestaNo.click(function(){
          that._submitRespuesta($(this).html());
          that._navegar(that._$pantallaRespuesta);
      });
    },  
    
    _inicializarHistory : function () {
        var that = this;
         History.Adapter.bind(window,'statechange',function(){ 
            var estadoActual = History.getState(); 
             var infoEstado = estadoActual.data;
             var idPantalla = infoEstado.mostrar;
             that._cambiarPantalla(idPantalla);
        });  
    },
    
    
    inicializar: function () {
        this._inicializarBienvenida();
        this._inicializarHistory();        
        this._inicializarAjax();
    },
    
    _navegar : function($pantalla) {
        var id = $pantalla.attr('id');
        var title = $pantalla.find('h2').text();
        var href = id;
        //Al cambiar el estado se lanza un evento
        //Le pasamos: informacion (que recuperemos al capturar el evento),el titulo y lo que queremos que aparezca en la barra de navegacion
        History.pushState({mostrar : id}, title, href);
    },
    
    _cambiarPantalla : function (idPantalla) {
        //Paso de parametros con valor por defecto. Si idPantalla es <> '' 
        //y <> undefined da idPantalla sino cogera 'bienvenida'. 
        idPantalla = idPantalla || 'bienvenida';   
        var $pantallaNueva = $('#'+idPantalla);
        var $pantallaVieja = $('.activa');
                
        //Es necesario hacerlo así ya lo que se guarda es una cola. Si lo hacemos llamando primero a fadeOut y luego a fadein
        //veriamos un retardo, primero se ocultaria una pantalla y luego se visualizaria el otro. Lo que queremos es que cuando se desvanezca
        //uno, aparezca la otra. Esto lo hacemos con un callback, indicandolo en el fadeout. Cuando acaba el fadeout ejecuta el callback
        //que lanza el fadein
        $pantallaVieja.fadeOut(150,function(){
            $pantallaNueva.fadeIn(150,function(){
                $pantallaVieja.removeClass('activa');
                $pantallaNueva.addClass('activa');                
            });
            
        });
    },
    
    _cargarPregunta : function () {
        var that = this;
        //Llamamos al servicio que recupera la pregunta
        var respuesta = servicio.obtenerPregunta();
        //Mostramos el resultado cuando se obtenga la respuesta
        var $preguntaDiv = $('#pregunta>h2');        
        respuesta.done(function(data){            
            $preguntaDiv.html(data.msg).fadeIn();
            that._navegar(that._$pantallaPregunta);
        });
        /*
        respuesta.fail(function(){
            $preguntaDiv.html('No se ha podido obtener la pregunta');
        });
        */
    },
    
    _actualizarResultado : function(tag, resultado){
        var cols = $('#resultados>table').find(tag).find('td');
        $(cols[1]).html(resultado);
        $(cols[2]).html(resultado);
    },
        
    _submitRespuesta : function (data) {
        var that = this;
        var respuesta = servicio.submitRespuesta(data);   
        var $tablaResultados = $('#resultados>table');        
        respuesta.done(function(resp){
            //that._actualizarResultado('.si',resp.resultados.si); 
            //that._actualizarResultado('.no',resp.resultados.no);
            //that._actualizarResultado('.total',resp.resultados.NA);
            //Ocultamos la tabla y mostramos un grafico
            $tablaResultados.hide();
            that._mostrarGrafico([{label : 'si',y : resp.resultados.si },{label: 'no', y : resp.resultados.no },{label: 'No sabe', y : resp.resultados.NA }]);
        });
        /*
        respuesta.fail(function(){
            $tablaResultados.html('No se han podido obtener los resultados');
        });*/
    },
    
    _mostrarEstado : function (codigoEstado) {
        var estado = $('#infoEstado');
        if(codigoEstado === 0){
            var img = $('<img src="images/ellipsis.svg"/>');
            var span = $('<span>Cargando </span>');
            estado.append(span);
            estado.append(img);
        }else if(codigoEstado === 1){
            estado.html('');
        }else if(codigoEstado === 2){
            //Plugin de toast: https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
            window.plugins.toast.show('No se ha podido realizar la petición. Inténtelo de nuevo.','short','top');
        }
    },      
    
    _mostrarGrafico : function (datos) {
        var chart = new CanvasJS.Chart("chart", {
          title:{
            text: ""              
          },
          data: [//array of dataSeries              
            { //dataSeries object

             /*** Change type "column" to "bar", "area", "line" or "pie"***/
             type: "pie",
             dataPoints: datos
           }
           ]
         });
        chart.render();
    },
    
    /*
     * Estados:
     *  0 => Arrancando la peticion
     *  1 => Parando la llamada (exito/fracaso)
     *  2 => Error en la peticion
     *  3 => Llamada realizada con exito
     * 
    */
    _inicializarAjax : function () {
        var that = this;
        $(document).ajaxStart(function(){
            that._mostrarEstado(0);
        }).ajaxStop(function(){
            that._mostrarEstado(1);
        }).ajaxError(function(){
            that._mostrarEstado(2);    
        }).ajaxSuccess(function(){
            that._mostrarEstado(3);
        });
    }
};

$(document).ready(function(){
    document.addEventListener('deviceready', function() {
        controlador.inicializar();
    });
});