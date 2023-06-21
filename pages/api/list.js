import { listContext } from "../../common/db";

export default async function (req, res) {
    const data = await listContext()
    res.status(200).json( data );
}