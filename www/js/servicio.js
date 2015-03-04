/*global $ */
var servicio = {
    
    URL_SERVCIO_OBTENER_PREGUNTA : 'https://demo9021555.mockable.io/pregunta',
    URL_SERVCIO_SUBMIT_RESPUESTA : 'https://demo9021555.mockable.io/respuesta',
    
    setURLServicio : function (url) {
        this.URL_SERVCIO_PREGUNTA = url || URL_SERVCIO_PREGUNTA;  
    },
    
    obtenerPregunta : function () {
        var pregunta = sessionStorage.getItem('pregunta');
        if (pregunta === null) {
            var promesa =  $.get(this.URL_SERVCIO_OBTENER_PREGUNTA);
            promesa.done(function (pregunta) {
                sessionStorage.setItem('pregunta', JSON.stringify(pregunta));
            });
            return promesa;
        } else {
            //Mecanismo para crear promesas
            var deferred = $.Deferred();
            var promesa = deferred.promise();
            //Resuelve la promesa => ejecuta todos los metodos done
            deferred.resolve(JSON.parse(pregunta));
            return promesa;
        }
    },
    
    submitRespuesta : function (data){
        var respuesta = $.post(this.URL_SERVCIO_SUBMIT_RESPUESTA,data);   
        return respuesta;
    }
};