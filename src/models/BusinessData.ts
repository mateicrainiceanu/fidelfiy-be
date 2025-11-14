import logger from "../config/logger";

export default class BusinessData {
    name: string;
    identifier: string;
    pictureUrl: string;
    website: string;

    static fromData(data: any) {
        delete data.id;

        if (!data.pictureUrl) data.pictureUrl = null;
        if (!data.website) data.website = null;

        if (data.identifier !== data.identifier.toLowerCase()){
            data.identifier = data.identifier.toLowerCase();
            logger.warn(`[BusinessData.fromData] Identifier [${data.identifier}] was not lowercase`);
        }

        const bd = new BusinessData();

        bd.name = data.name;
        bd.identifier = data.identifier;
        bd.pictureUrl = data.pictureUrl;
        bd.website = data.website;

        return bd;

    }

}