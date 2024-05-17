import Category from "../models/category.model.js";

export const getCategory = async (req, res) => {
  
    const {title} = req.params;

    try {
        const category = await Category.findOne({title});

        if (!category) return res.status(404).json({error: "Categoría no encontrado"});

        req.status(200).json(category);
    
  } catch (error) {
        console.log("Error en getCategory ",error.message);
        res.status(500).json({error: error.message});
  }
};

export const setCategory = async (req, res) => {
    try {
        const {title} = req.body;

        const existingCategory = await Category.findOne({ title });

        if (existingCategory) {
            return res.status(400).json({ error: "La categoría ya existe" });
        }

        //new user with the data with pass hashed
        const newCategory = new Category({
            title: title,
        });

        if (newCategory) {
            await newCategory.save();

            res.status(201).json({
                _id: newCategory.id,
                title: newCategory.title
            });
        } else {
            res.status(400).json({error: 'Datos de Categoría no válidos'});
        }

    } catch (error) {
        console.log("Error en el controlador de Categoría ", error.message);
        res.status(500).json({error: 'Error interno desde el controller'});
    }
};

export const listCategories = async (req, res) => {
  
    try {
        const categories = await Category.find({});

        if (!categories || categories.length === 0) return res.status(404).json({error: "No hay Categorías que listar"});

        res.status(200).json(categories);
    
  } catch (error) {
        console.log("Error en listCategories ",error.message);
        res.status(500).json({error: error.message});
  }
};