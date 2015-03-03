'use strict';
var controlador = {    
    _$botonCargarPregunta : $('#cargarPregunta'),
    _$pantallaBienvenida : $('#bienvenida'),
    _$pantallaPregunta : $('#pregunta'),
    
    _inicializarBienvenida : function () {
     var that = this;    
     this._$botonCargarPregunta.click(function(){
          that._cargarPregunta();
          that._navegar(that._$pantallaPregunta);
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
    }
};