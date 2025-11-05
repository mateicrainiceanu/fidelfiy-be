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

}