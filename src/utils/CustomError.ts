export default class CustomError extends Error {
    name: string;
    statusCode: number;

    constructor(status: number, message: string) {
        super(message);
        this.statusCode = status;
    }
}

