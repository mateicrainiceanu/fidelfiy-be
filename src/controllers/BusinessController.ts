import BusinessService from "../services/BusinessService";
import CustomError from "../utils/CustomError";
import logger from "../config/logger";

export default class BusinessController {
    static async createBusiness(creatorId: string, data: any) {
        logger.debug(`[BusinessController.createBusiness] Creating business for user [${creatorId}] businessIdentifier: [${data.identifier}]`);
        // Check if the identifier is valid
        if (await BusinessService.isIdentifierValid(data.identifier)) {
            throw new CustomError(400,"Identifier already exists");
        }

        //create business
        return BusinessService.createBusiness(creatorId, data);
    }

    static async getBusiness(id: string, authUserId: string) {
        logger.debug(`[BusinessController.getBusiness] Getting business [${id}]`);
        return await BusinessService.getBusiness(id, authUserId);
    }
    
    static async getBusinessFor(authUserId: string, forType: string) {
        logger.debug(`[BusinessController.getBusinessFor] Getting businesses for user [${authUserId}] forType: [${forType}]`);
        switch (forType) {
            case "admin":
                return this.getBusinessesForAdmin(authUserId);
            case "user": // TODO: Return the businesses that the user has cards at -> implement.
                return this.getBusinessesForUser(authUserId);
        }
    }

    static async updateBusinessData(identifier: string, data: any, authUserId: string) {
        logger.debug(`[BusinessController.updateBusinessData] Updating business [${identifier}] with data [${JSON.stringify(data)}]`);
        const business = await this.findBusinessOrThrow(identifier, authUserId);

        if (!business.permissions.isCreator) {
            throw new CustomError(403, "You are not authorized to update this business!");
        }

        return BusinessService.updateBusiness(identifier, data, authUserId);
    }

    static async deleteBusiness(identifier: string, authUserId: string) {
        logger.debug(`[BusinessController.deleteBusiness] Deleting business [${identifier}] for user [${authUserId}]`);
        const business = await this.findBusinessOrThrow(identifier, authUserId);

        if (!business.permissions.isCreator) {
            throw new CustomError(403, "You are not authorized to update this business!");
        }

        return BusinessService.deleteBusiness(business.id);

    }

    private static async findBusinessOrThrow(identifier: string, authUserId: string) {
        const b = await BusinessService.getBusiness(identifier, authUserId);
        return b || Promise.reject(new CustomError(404, "No business with this id was found!"));
    }

    private static getBusinessesForAdmin(authUserId: string) {
        logger.debug(`[BusinessController.getBusinessesForAdmin] Getting businesses for admin [${authUserId}]`);
        return BusinessService.getBusinessesForAdmin(authUserId);
    }

    private static getBusinessesForUser(authUserId: string) {
        //TODO: Return the businesses that the user has cards at.
        throw new Error("Not implemented");
    }
}