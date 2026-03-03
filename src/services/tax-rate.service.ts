import * as taxRateRepository from '../repositories/tax-rate.repository';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const getAllTaxRates = async (query?: Prisma.TaxRateFindManyArgs) => {
  return taxRateRepository.findAll(query);
};

export const getTaxRateById = async (id: string, include?: Prisma.TaxRateInclude) => {
  const taxRate = await taxRateRepository.findById(id, include);
  if (!taxRate) {
    throw new ApiError(404, 'Tax rate not found');
  }
  return taxRate;
};

export const createTaxRate = async (data: Prisma.TaxRateCreateInput) => {
  const existingTaxRate = await taxRateRepository.findByName(data.name);
  if (existingTaxRate) {
    throw new ApiError(400, 'Tax rate with this name already exists');
  }
  return taxRateRepository.create(data);
};

export const updateTaxRate = async (id: string, data: Prisma.TaxRateUpdateInput) => {
  const taxRate = await taxRateRepository.findById(id);
  if (!taxRate) {
    throw new ApiError(404, 'Tax rate not found');
  }

  if (data.name && typeof data.name === 'string') {
    const existingTaxRate = await taxRateRepository.findByName(data.name);
    if (existingTaxRate && existingTaxRate.id !== id) {
      throw new ApiError(400, 'Tax rate with this name already exists');
    }
  }

  return taxRateRepository.update(id, data);
};

export const deleteTaxRate = async (id: string) => {
  const taxRate = await taxRateRepository.findById(id);
  if (!taxRate) {
    throw new ApiError(404, 'Tax rate not found');
  }
  return taxRateRepository.deleteTaxRate(id);
};
