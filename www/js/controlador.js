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
          that._navegar(that._$pantallaPregunta);
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
        //Llamamos al servicio que recupera la pregunta
        var respuesta = servicio.obtenerPregunta();
        //Mostramos el resultado cuando se obtenga la respuesta
        var $preguntaDiv = $('#pregunta>h2');        
        respuesta.done(function(data){            
            $preguntaDiv.html(data.msg);
        });
        respuesta.fail(function(){
            $preguntaDiv.html('No se ha podido obtener la pregunta');
        });
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
            that._actualizarResultado('.si',resp.si); 
            that._actualizarResultado('.no',resp.no);
            that._actualizarResultado('.total',parseInt(resp.si)+parseInt(resp.no));            
        });
        respuesta.done(function(){
            $tablaResultados.html('No se han podido obtener los resultados');
        });
    }
};

$(document).ready(function(){
    controlador.inicializar();
});