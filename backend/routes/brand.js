import express from 'express';
import * as BrandController from '../controller/brandController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list', BrandController.listBrand);


export default router;