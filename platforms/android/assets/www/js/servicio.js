var servicio = {
    
    URL_SERVCIO_PREGUNTA : 'http://demo3767113.mockable.io/pretunta',
    
    setURLServicio : function (url) {
        this.URL_SERVCIO_PREGUNTA = url || URL_SERVCIO_PREGUNTA;  
    },
    
    obtenerPregunta : function () {        
        return $.get(this.URL_SERVCIO_PREGUNTA);        
    }
}