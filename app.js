
require('colors');

const { inquirerMenu, 
    pausa, 
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostarListadoChecklist, 
} = require('./helpers/inquirer');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

console.clear();

const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if( tareasDB ){
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {
        opt = await inquirerMenu();

        switch ( opt ) {
            case '1': // Crear tarea
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
            break;
    
            case '2': // Listar todas
                tareas.listadoCompleto();
            break;

            case '3': // Listar completadas
                tareas.listarPendientesCompletadas( true );
            break;

            case '4': // Listar pendientes
                tareas.listarPendientesCompletadas( false );
            break;

            case '5': // Completado | Pendiente
                const ids = await mostarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break;

            case '6': // Borrar
                const id = await listadoTareasBorrar( tareas.listadoArr );

                if( id !== '0' ){
                    
                    const ok = await confirmar( '¿Está seguro?' );
                    if( ok ){
                        tareas.borrarTarea( id );
                        console.log( 'Tarea borrada' );
                    }
                }
            break;

        }
        guardarDB( tareas.listadoArr );
        await pausa();

    } while (opt !== '0' );

    //pausa();
}

main();