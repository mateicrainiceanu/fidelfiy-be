import logger from "../config/logger";
import prisma from "../config/db";
import {Prisma} from "@prisma/client";
import CustomError from "../utils/CustomError";

import {validate as isUUID} from "uuid";

// Type for Business that includes usersBusiness relation
export type BusinessWithUsers = Prisma.BusinessGetPayload<{ include: { usersBusiness: true } }>;

// Type after sanitization (without the relation)
export type BusinessSanitized = Omit<BusinessWithUsers, "usersBusiness">;


export default class BusinessService {
    static async createBusiness(creatorId: string, data: any) {

        delete data.id;

        if (!data.pictureUrl) data.pictureUrl = null;
        if (!data.website) data.website = null;

        data.identifier = data.identifier.toLowerCase();

        logger.trace(`[BusinessService.createBusiness] Creating business [${creatorId}] [${data}]`);

        const business: BusinessWithUsers = await prisma.business.create({
            data: {
                ...data,
                usersBusiness: {
                    create: {
                        userId: creatorId,
                        isCreator: true,
                        canCreate: true,
                        canEditOffer: true,
                        canSeeOffer: true,
                        canValidateOffer: true,
                    },
                },
            },
            include: {
                usersBusiness: true
            },
        });

        return this.sanitize(business, creatorId);
    }

    static async getBusinessesForAdmin(authUserId: string) {
        logger.trace(`[BusinessService.getBusinessesForAdmin] Getting businesses for admin [${authUserId}]`);
        const result = await prisma.business.findMany({
            where: {
                usersBusiness: {
                    some: {
                        userId: authUserId,
                    }
                }
            },
            include: {
                usersBusiness: true,
            }
        });

        return result.map(b => this.sanitize(b, authUserId));
    }

    static async isIdentifierValid(identifier: string) {
        logger.trace(`[BusinessService.isIdentifierValid] Checking if identifier [${identifier}] is valid`);
        identifier = identifier.toLowerCase();
        return await prisma.business.findUnique({where: {identifier}}) !== null;
    }

    static async getBusiness(id: string, authUserId: string) {
        logger.trace(`[BusinessService.getBusiness] Getting business [${id}]`);

        const found: BusinessWithUsers = await prisma.business.findUnique({
            where:
                isUUID(id) ? {id} : {identifier:id},
            include: {
                usersBusiness: true,
            }
        });

        if (found === null) {
            throw new CustomError(404, "No business with this id was found!");
        }

        return this.sanitize(found, authUserId);
    }

    private static sanitize(business: BusinessWithUsers, authUserId: string = null) {
        logger.trace(`[BusinessService.sanitize] Sanitizing business [${business.id}]`);

        const permissions = this.getPermissions(business, authUserId);

        delete business.usersBusiness;

        return {...business, permissions};
    }

    private static getPermissions(b: BusinessWithUsers, authUserId: string) {

        logger.trace(`[BusinessService.getPermissions] Getting permissions for business [${b.id}]`);

        const userPermissions= b.usersBusiness.find(u => u.userId === authUserId);

        if (userPermissions == null) {
            return {
                isCreator: false,
                canCreate: false,
                canEditOffer: false,
                canSeeOffer: false,
                canValidateOffer: false
            }
        }

        delete userPermissions.userId;
        delete userPermissions.businessId;

        return userPermissions;
    }
}