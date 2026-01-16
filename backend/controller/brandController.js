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


export const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
    
        if (!name) return res.status(400).send({error: "No name added"});
        
        const brand = await service.createBrandService(name);
        
        if (!brand) return res.status(400).send({error: "Can't create brand"});

        return res.status(201).send({
            message: "Brand created successfully",
            brand,
        });
    } catch (err) {
        return res.status(400).send({err: err.message});
    }
}
