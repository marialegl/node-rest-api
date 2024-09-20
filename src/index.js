const express = require('express');
const morgan = require('morgan');
const fs = require('fs')



const app = express();
//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)
//permite que Express parsee automáticamente los datos JSON de las solicitudes entrantes,
//lo cual es esencial para manejar las solicitudes POST
app.use(express.json());

app.use(morgan('dev'));

/*app.get('/', (req, res) => {    
    res.json(
        {
            "Title": "Hola mundo"
        }
    );
})*/

//Routes
app.use(require('./routes/index'));

//Iniciando el servidor, escuchando...
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});
