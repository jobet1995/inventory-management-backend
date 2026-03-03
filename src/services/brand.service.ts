import * as brandRepository from '../repositories/brand.repository';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const getAllBrands = async (query?: Prisma.BrandFindManyArgs) => {
  return brandRepository.findAll(query);
};

export const getBrandById = async (id: string, include?: Prisma.BrandInclude) => {
  const brand = await brandRepository.findById(id, include);
  if (!brand) {
    throw new ApiError(404, 'Brand not found');
  }
  return brand;
};

export const createBrand = async (data: Prisma.BrandCreateInput) => {
  const existingBrand = await brandRepository.findByName(data.name);
  if (existingBrand) {
    throw new ApiError(400, 'Brand with this name already exists');
  }
  return brandRepository.create(data);
};

export const updateBrand = async (id: string, data: Prisma.BrandUpdateInput) => {
  const brand = await brandRepository.findById(id);
  if (!brand) {
    throw new ApiError(404, 'Brand not found');
  }

  if (data.name && typeof data.name === 'string') {
    const existingBrand = await brandRepository.findByName(data.name);
    if (existingBrand && existingBrand.id !== id) {
      throw new ApiError(400, 'Brand with this name already exists');
    }
  }

  return brandRepository.update(id, data);
};

export const deleteBrand = async (id: string) => {
  const brand = await brandRepository.findById(id);
  if (!brand) {
    throw new ApiError(404, 'Brand not found');
  }
  return brandRepository.deleteBrand(id);
};
