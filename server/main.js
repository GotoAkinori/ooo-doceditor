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

app.use( bodyParser.urlencoded( {
    extended: true
} ) );
app.use( bodyParser.json() );
app.use( "/docedit", express.static( __dirname + "\\..\\client" ) );

app.get( "/form/:id", ( req, res ) => {
    fs.readFile( "./server/database/form/" + req.params.id + ".json", ( err, data ) => {
        if ( err ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] read error" );
        } else {
            res.send( data );
        }
    } );
} );
app.post( "/form/:id", ( req, res ) => {
    fs.writeFile( "./server/database/form/" + req.params.id + ".json", JSON.stringify( req.body ), ( err ) => {
        if ( err ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] write error" );
        } else {
            res.send();
        }
    } );
} );
app.put( "/form/:id", ( req, res ) => {
    fs.writeFile( "./server/database/form/" + req.params.id + ".json", JSON.stringify( req.body ), ( err ) => {
        if ( err ) {
            res.status( 500 ).send( "[code: " + errorLog( err ) + "] put error" );
        } else {
            res.send( data );
        }
    } );
} );
app.delete( "/form/:id", ( req, res ) => {
    fs.unlink( "./server/database/form/" + req.params.id + ".json", ( err ) => {
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
