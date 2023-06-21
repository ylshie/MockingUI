const fs = require('fs');

export default async function (req, res) {
    const id    = req.body.id;
    const path  = "public/"+id+".mp3"

    fs.unlink(path, (err) => {
        if (err) {
            console.log("delete " + path + " error")
        } else {
            console.log(path + " was deleted");
        }
        res.status(200).json( {status: "ok"} );
    });
}
