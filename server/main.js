let express = require( "express" );
const bodyParser = require( 'body-parser' );
let fs = require( "fs" );

const app = express();
const databasePath = "./server/database/";

function errorLog( err ) {
    let id = Math.floor( Math.random() * 100000 );
    console.group( "code: " + id );
    console.log( err );
    console.groupEnd();
    return id;
}

function rest( url, pathFunc, callbackHandlers ) {
    function path( req ) { return databasePath + pathFunc( req.params ) };
    async function fireEvent( name, req ) {
        if ( callbackHandlers && callbackHandlers[name] ) {
            await callbackHandlers[name]( req, path( req ) )
        };
    }
    app.get( url, async ( req, res ) => {
        try {
            await fireEvent( "onbeforeget", req );
            fs.readFile( path( req ), async ( err, data ) => {
                if ( err ) {
                    throw ex;
                } else {
                    await fireEvent( "onget", req );
                    res.send( data );
                }
            } );
        } catch ( ex ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] read error" );
        }
    } );
    app.post( url, async ( req, res ) => {
        try {
            await fireEvent( "onbeforepost", req );
            fs.writeFile( path( req ), JSON.stringify( req.body ), async ( err ) => {
                if ( err ) {
                    res.status( 500 ).send( "[code: " + errorLog( err ) + "] write error" );
                } else {
                    await fireEvent( "onpost", req );
                    res.send();
                }
            } );
        } catch ( ex ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] read error" );
        }
    } );
    app.put( url, async ( req, res ) => {
        try {
            await fireEvent( "onbeforeput", req );
            fs.writeFile( path( req ), JSON.stringify( req.body ), async ( err ) => {
                if ( err ) {
                    res.status( 500 ).send( "[code: " + errorLog( err ) + "] write error" );
                } else {
                    await fireEvent( "onput", req );
                    res.send();
                }
            } );
        } catch ( ex ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] read error" );
        }
    } );
    app.delete( url, async ( req, res ) => {
        try {
            fireEvent( "onbeforedelete", req );
            fs.unlink( path( req ), async ( err ) => {
                if ( err ) {
                    res.status( 500 ).send( "[code: " + errorLog( err ) + "] put error" );
                } else {
                    fireEvent( "ondelete", req );
                    res.send( data );
                }
            } );
        } catch ( ex ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] read error" );
        }
    } );
}

/**
 * make directory
 * @param {string} path file path
 * @param {boolean} isFile true: target is file path / false: target is directory path
 */
function makeDirectory( path, isFile ) {
    if ( isFile ) {
        let slIndex = path.lastIndexOf( "/" );
        if ( slIndex >= 0 ) {
            path = path.substring( 0, slIndex );
        }
    }

    return new Promise( ( resolve, reject ) => {
        fs.exists( path, ( err ) => {
            if ( err ) {
                reject( err );
            } else {
                fs.mkdir( path, { recursive: true }, ( err ) => {
                    if ( err ) {
                        reject( err );
                    } else {
                        resolve();
                    }
                } );
            }
        } );
    } );
}

app.use( bodyParser.urlencoded( {
    extended: true
} ) );
app.use( bodyParser.json() );
app.use( "/docedit", express.static( __dirname + "\\..\\client" ) );

rest( "/data/form/:id", ( params ) => "form/" + params.id + ".json" );
rest( "/data/document/:id", ( params ) => "document/" + params.id + ".json" );
rest( "/data/file/:id/:attribute/:filename",
    ( params ) => "document/" + params.id + "/" + params.attribute + "/" + params.filename,
    {
        onbeforepost: async ( req, path ) => { await makeDirectory( path, true ); },
        onbeforeput: async ( req, path ) => { await makeDirectory( path, true ); },
    }
);

app.listen( 3000, () => {
    console.log( __dirname + "\\..\\client" );
    console.log( "Listening" );
} );
