let express = require( "express" );
const bodyParser = require( 'body-parser' );
let fs = require( "fs" );

const app = express();

function errorLog( err ) {
    let id = Math.floor( Math.random() * 100000 );
    console.group( "code: " + id );
    console.log( err );
    console.groupEnd();
    return id;
}

function getPath( type ) {
    switch ( type ) {
        case "form": return "./server/database/form/";
        case "document": return "./server/database/document/";
        default: return "";
    }
}

app.use( bodyParser.urlencoded( {
    extended: true
} ) );
app.use( bodyParser.json() );
app.use( "/docedit", express.static( __dirname + "\\..\\client" ) );

app.get( "/data/:type/:id", ( req, res ) => {
    let path = getPath( req.params.type );
    if ( path === "" ) {
        res.status( 404 ).send( "[code: " + errorLog( err ) + "] path not exists" );
    }
    fs.readFile( path + req.params.id + ".json", ( err, data ) => {
        if ( err ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] read error" );
        } else {
            res.send( data );
        }
    } );
} );
app.post( "/data/:type/:id", ( req, res ) => {
    let path = getPath( req.params.type );
    if ( path === "" ) {
        res.status( 404 ).send( "[code: " + errorLog( err ) + "] path not exists" );
    }
    fs.writeFile( path + req.params.id + ".json", JSON.stringify( req.body ), ( err ) => {
        if ( err ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] write error" );
        } else {
            res.send();
        }
    } );
} );
app.put( "/data/:type/:id", ( req, res ) => {
    let path = getPath( req.params.type );
    if ( path === "" ) {
        res.status( 404 ).send( "[code: " + errorLog( err ) + "] path not exists" );
    }
    fs.writeFile( path + req.params.id + ".json", JSON.stringify( req.body ), ( err ) => {
        if ( err ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] put error" );
        } else {
            res.send( data );
        }
    } );
} );
app.delete( "/data/:type/:id", ( req, res ) => {
    let path = getPath( req.params.type );
    if ( path === "" ) {
        res.status( 404 ).send( "[code: " + errorLog( err ) + "] path not exists" );
    }
    fs.unlink( path + req.params.id + ".json", ( err ) => {
        if ( err ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] put error" );
        } else {
            res.send( data );
        }
    } );
} );

app.listen( 3000, () => {
    console.log( __dirname + "\\..\\client" );
    console.log( "Listening" );
} );
