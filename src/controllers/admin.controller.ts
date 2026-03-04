import { Request, Response } from 'express';
import prisma from '../config/database';
import { Prisma } from '@prisma/client';

// Helper to determine if a string is a valid prisma model name
const getModelName = (modelRaw: string): string => {
  return modelRaw.charAt(0).toLowerCase() + modelRaw.slice(1);
};

export const executeQuery = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Valid SQL query string is required' });
    }

    // WARNING: This executes arbitrary SQL directly. 
    // It is protected by the SUPER_ADMIN role middleware.
    let result;
    if (query.trim().toLowerCase().startsWith('select') || 
        query.trim().toLowerCase().startsWith('with')) {
        result = await prisma.$queryRawUnsafe(query);
    } else {
        result = await prisma.$executeRawUnsafe(query);
    }
    
    // In javascript BigInt fields are returned which JSON.stringify cannot handle by default
    // We stringify it using a custom replacer
    const jsonString = JSON.stringify(result, (key, value) => {
      return typeof value === 'bigint' ? value.toString() : value;
    });

    res.status(200).json(JSON.parse(jsonString));
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Query execution failed' });
  }
};

export const getModels = (req: Request, res: Response) => {
  // Safely get all database models compiled by prisma exactly
  const models = Prisma.dmmf.datamodel.models.map(m => m.name);
  res.status(200).json(models);
};

export const getSchema = (req: Request, res: Response) => {
  const modelName = req.params.modelName as string;
  const model = Prisma.dmmf.datamodel.models.find(
    m => m.name.toLowerCase() === modelName.toLowerCase()
  );

  if (!model) {
    return res.status(404).json({ error: `Schema for ${modelName} not found` });
  }

  // Return the fields array and all system enums to the frontend
  res.status(200).json({
    fields: model.fields,
    enums: Prisma.dmmf.datamodel.enums
  });
};

export const getAllData = async (req: Request, res: Response) => {
  try {
    const modelName = req.params.modelName as string;
    const model = getModelName(modelName);

    // @ts-ignore dynamic prisma access
    if (!prisma[model]) {
      return res.status(404).json({ error: `Model ${modelName} not found` });
    }
    
    // Pagination defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // @ts-ignore dynamic prisma access
    const data = await prisma[model].findMany({
      skip,
      take: limit,
      orderBy: { id: 'desc' }, // assuming everything has an ID
    });
    
    // @ts-ignore
    const total = await prisma[model].count();

    res.status(200).json({
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const getOneData = async (req: Request, res: Response) => {
  try {
    const modelName = req.params.modelName as string;
    const id = req.params.id as string;
    const model = getModelName(modelName);

    // @ts-ignore
    if (!prisma[model]) return res.status(404).json({ error: `Model not found` });

    // @ts-ignore
    const data = await prisma[model].findUnique({ where: { id } });

    if (!data) return res.status(404).json({ error: 'Record not found' });
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const createData = async (req: Request, res: Response) => {
  try {
    const modelName = req.params.modelName as string;
    const model = getModelName(modelName);

    // @ts-ignore
    if (!prisma[model]) return res.status(404).json({ error: `Model not found` });

    console.log(`[CREATE API] Attempting to create ${modelName} with body:`, JSON.stringify(req.body, null, 2));

    // @ts-ignore
    const data = await prisma[model].create({
      data: req.body
    });

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Validation/Creation Error' });
  }
};

export const updateData = async (req: Request, res: Response) => {
  try {
    const modelName = req.params.modelName as string;
    const id = req.params.id as string;
    const model = getModelName(modelName);

    // @ts-ignore
    if (!prisma[model]) return res.status(404).json({ error: `Model not found` });

    // @ts-ignore
    const data = await prisma[model].update({
      where: { id },
      data: req.body
    });

    res.status(200).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Update Error' });
  }
};

export const deleteData = async (req: Request, res: Response) => {
  try {
    const modelName = req.params.modelName as string;
    const id = req.params.id as string;
    const model = getModelName(modelName);

    // @ts-ignore
    if (!prisma[model]) return res.status(404).json({ error: `Model not found` });

    // @ts-ignore
    await prisma[model].delete({ where: { id } });

    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Deletion Error' });
  }
};
