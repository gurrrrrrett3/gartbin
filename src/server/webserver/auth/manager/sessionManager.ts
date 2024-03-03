import { db } from "../../../..";
import Session from "../../../../database/entities/session.entity";
import  User  from "../../../../database/entities/user.entity";

const sessionExpire = 604800000;

export default class SessionManager {
  public static async genSession(user: User): Promise<Session> {
    const session = new Session();
    session.user = user;

    await db.getEntityManager().persistAndFlush(session);

    return session;
  }

  public static async checkSession(session: string): Promise<Session | undefined> {
    this.checkSessionExpire();

    // check if session exists
    const validSession = await db.getEntityManager().findOne(Session, {
      id: session,
    }, {
      populate: ["user"],
    });

    if (validSession) {
      // Update the session
      validSession.lastUsed = new Date();
      await db.getEntityManager().persistAndFlush(validSession);
      return validSession;
    }

    return undefined;
  }

  public static async deleteSession(session: string): Promise<void> {
    await db.getEntityManager().nativeDelete(Session, {
      id: session,
    });
  }

  public static async touchSession(session: Session): Promise<void> {
    session.lastUsed = new Date();
    await db.getEntityManager().persistAndFlush(session);
  }

  public static async checkSessionExpire(): Promise<void> {
    if (!db.getEntityManager()) return;
    await db.getEntityManager().nativeDelete(Session, {
      lastUsed: {
        $lt: new Date(Date.now() - sessionExpire),
      },
    });
  }
}
