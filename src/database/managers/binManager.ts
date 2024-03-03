import { db } from "../..";
import { Bin } from "../entities/bin.entity";
import User from "../entities/user.entity";
import UserManager from "./userManager";

export default class BinManager {

    public static async getBin(id: string) {
        const bin = await db.em.findOne(Bin, { id }, {
            populate: ['user']
        });

        if (!bin) {
            return undefined;
        }

        bin.views++;
        // do not await this
        db.em.persistAndFlush(bin);
        return bin;
    }

    public static async createBin(content: string, filename: string | undefined, language: string, extension: string, expiration: Date | "never", password?: string, user?: User) {
        const id = await this.getBinId();
        const bin = new Bin();
        bin.id = id;
        bin.content = content;
        bin.filename = filename || `${id}${extension}`
        bin.language = language;
        bin.password = password;
        bin.expiration = expiration === "never" ? undefined : expiration;
        bin.user = user ? await UserManager.getRootUser(user) || undefined : undefined;
        bin.views = 0;
        bin.createdAt = new Date();
        bin.updatedAt = new Date();
        await db.em.persistAndFlush(bin);

        return id;
    }

    public static async updateBin(id: string, content: string, filename: string | undefined, language: string, extension: string, expiration: Date | "never", password: string, user?: User) {
        const bin = await db.em.findOne(Bin, { id });

        if (!bin) {
            return {
                success: false,
                status: 404,
                message: "bin not found"
            };
        }

        if (!bin.user) {
            return {
                success: false,
                status: 400,
                message: "bin is not editable."
            }
        }

        if (!user) {
            return {
                success: false,
                status: 401,
                message: "user is not authenticated."
            }
        }

        const binUser = await UserManager.getRootUser(bin.user);
        const sessionUser = await UserManager.getRootUser(user);

        if (binUser && sessionUser && binUser.username !== sessionUser.username) {
            return {
                success: false,
                status: 403,
                message: "user is not authorized to edit this bin."
            }
        }


        bin.content = content;
        bin.filename = filename || `${id}${extension}`
        bin.language = language;
        bin.password = password;
        bin.expiration = expiration === "never" ? undefined : expiration;
        bin.updatedAt = new Date();
        bin.user = user ? await UserManager.getRootUser(user) || undefined : undefined;
        await db.em.persistAndFlush(bin);

        return {
            success: true,
            status: 200,
            id: bin.id
        }
    }

    public static async getBinId(): Promise<string> {

        const newId = Math.random().toString(36).substring(2, 6);
        const bin = await db.em.findOne(Bin, { id: newId });

        if (bin) {
            return this.getBinId();
        }

        return newId;
    }

}