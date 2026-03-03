import * as unitRepository from '../repositories/unit.repository';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const getAllUnits = async (query?: Prisma.UnitFindManyArgs) => {
  return unitRepository.findAll(query);
};

export const getUnitById = async (id: string, include?: Prisma.UnitInclude) => {
  const unit = await unitRepository.findById(id, include);
  if (!unit) {
    throw new ApiError(404, 'Unit not found');
  }
  return unit;
};

export const createUnit = async (data: Prisma.UnitCreateInput) => {
  const existingName = await unitRepository.findByName(data.name);
  if (existingName) {
    throw new ApiError(400, 'Unit with this name already exists');
  }

  const existingShortName = await unitRepository.findByShortName(data.shortName);
  if (existingShortName) {
    throw new ApiError(400, 'Unit with this short name already exists');
  }

  return unitRepository.create(data);
};

export const updateUnit = async (id: string, data: Prisma.UnitUpdateInput) => {
  const unit = await unitRepository.findById(id);
  if (!unit) {
    throw new ApiError(404, 'Unit not found');
  }

  if (data.name && typeof data.name === 'string') {
    const existingName = await unitRepository.findByName(data.name);
    if (existingName && existingName.id !== id) {
      throw new ApiError(400, 'Unit with this name already exists');
    }
  }

  if (data.shortName && typeof data.shortName === 'string') {
    const existingShortName = await unitRepository.findByShortName(data.shortName);
    if (existingShortName && existingShortName.id !== id) {
      throw new ApiError(400, 'Unit with this short name already exists');
    }
  }

  return unitRepository.update(id, data);
};

export const deleteUnit = async (id: string) => {
  const unit = await unitRepository.findById(id);
  if (!unit) {
    throw new ApiError(404, 'Unit not found');
  }
  return unitRepository.deleteUnit(id);
};
