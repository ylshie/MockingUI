import { updateContext } from "../../common/db";

export default async function (req, res) {
    const id    = req.body.id;
    const name  = req.body.name;
    const text  = req.body.text;
    const data  = await updateContext(id, name, text)
    res.status(200).json( data );
}
