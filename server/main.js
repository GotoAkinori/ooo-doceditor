let express = require( "express" );
let fs = require( "fs" );

const app = express();
const databasePath = "./server/database/";
const sizeLimit = "1000mb";

function errorLog( err ) {
    let id = Math.floor( Math.random() * 100000 );
    console.group( "code: " + id );
    console.log( err );
    console.groupEnd();
    return id;
}

function rest( url, pathFunc, type, callbackHandlers, writeOption ) {
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
            res.status( 500 ).send( "[code: " + errorLog( ex ) + "] get error" );
        }
    } );
    app.post( url, async ( req, res ) => {
        try {
            await fireEvent( "onbeforepost", req );

            let data;
            switch ( type ) {
                case "json": data = JSON.stringify( req.body ); break;
                case "binary": data = req.body; break;
            }
            fs.writeFile( path( req ), data, writeOption, async ( err ) => {
                if ( err ) {
                    throw err;
                } else {
                    await fireEvent( "onpost", req );
                    res.send();
                }
            } );
        } catch ( ex ) {
            res.status( 500 ).send( "[code: " + errorLog( ex ) + "] post error" );
        }
    } );
    app.put( url, async ( req, res ) => {
        try {
            await fireEvent( "onbeforeput", req );
            fs.writeFile( path( req ), JSON.stringify( req.body ), async ( err ) => {
                if ( err ) {
                    throw err;
                } else {
                    await fireEvent( "onput", req );
                    res.send();
                }
            } );
        } catch ( ex ) {
            res.status( 500 ).send( "[code: " + errorLog( ex ) + "] put error" );
        }
    } );
    app.delete( url, async ( req, res ) => {
        try {
            fireEvent( "onbeforedelete", req );
            fs.unlink( path( req ), async ( err ) => {
                if ( err ) {
                    throw err;
                } else {
                    fireEvent( "ondelete", req );
                    res.send( data );
                }
            } );
        } catch ( ex ) {
            res.status( 500 ).send( "[code: " + errorLog( ex ) + "] delete error" );
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
        fs.exists( path, ( exist ) => {
            if ( exist ) {
                resolve();
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

function useParseJson( path ) {
    app.use( path, express.urlencoded( {
        limit: sizeLimit,
        extended: true
    } ) );
    app.use( path, express.json() );
}
function UseParseBin( path ) {
    app.use( path, express.urlencoded( {
        limit: sizeLimit
    } ) );
    app.use( path, express.raw( { type: '*/*' } ) );
}

useParseJson( "/data/form/" );
useParseJson( "/data/document/" );
useParseJson( "/data/filelist/" );
UseParseBin( "/data/file/" );

app.use( "/docedit", express.static( __dirname + "\\..\\client" ) );
rest( "/data/form/:id", ( params ) => "form/" + params.id + ".json", "json" );
rest( "/data/document/:id", ( params ) => "document/" + params.id + ".json", "json", {
    ondelete: ( req, path ) => {
        const folder = "document/" + req.params.id;
        return new Promise( ( resolve, reject ) => {
            fs.rmdir( folder, ( err ) => {
                if ( err ) {
                    reject();
                } else {
                    resolve();
                }
            } );
        } )
    }
} );
rest( "/data/file/:id/:attribute/:filename",
    ( params ) => "document/" + params.id + "/" + params.attribute + "/" + params.filename,
    "binary",
    {
        onbeforepost: async ( req, path ) => { await makeDirectory( path, true ); },
        onbeforeput: async ( req, path ) => { await makeDirectory( path, true ); },
    },
    { encoding: null }
);
app.get( "/data/filelist/:id/:attribute", ( req, res ) => {
    try {
        fs.readdir( databasePath + "document/" + req.params.id + "/" + req.params.attribute + "/",
            ( err, files ) => {
                if ( err ) {
                    res.status( 500 ).send( "[code: " + errorLog( err ) + "] file list error" );
                } else {
                    res.send( files );
                }
            } );
    } catch ( ex ) {
        res.status( 500 ).send( "[code: " + errorLog( ex ) + "] read error" );
    }
} );

app.listen( 3000, () => {
    console.log( __dirname + "\\..\\client" );
    console.log( "Listening" );
} );
