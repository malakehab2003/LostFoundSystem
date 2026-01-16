import * as service from '../services/brandService.js';


export const listBrand = async (req, res) => {
    try {
        const brands = await service.listBrandService();
    
        if (!brands) return res.status(400).send({message: "Can't get brands"});

        return res.status(200).send({
            brands,
        });
    } catch (err) {
        return res.status(400).send({err: err.message});
    }
}
