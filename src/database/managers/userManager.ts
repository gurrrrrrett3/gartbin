import { db } from "../..";
import User from "../entities/user.entity";

export default class UserManager {
    static async getUser(id: string) {

        let user = await db.em.findOne(User, { username: id }, {
            populate: ['bins', 'linkedTo']
        });

        if (!user) {
            user = await db.em.findOne(User, { displayName: id }, {
                populate: ['bins', 'linkedTo']
            });
        }

        return user;
    }

    static async getRootUser(id: string | User): Promise<User | null> {
        const user = id instanceof User ? id : await this.getUser(id);
        if (!user?.linkedTo) {
            return user;
        }
        return UserManager.getRootUser(user.linkedTo.username);
    }
}
