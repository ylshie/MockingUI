import { delContext } from "../../common/db";

export default async function (req, res) {
    const id    = req.body.id;
    const data = await delContext(id)
    res.status(200).json( data );
}

