import { db } from "../..";
import { Paste } from "../entities/paste.entity";

export default class CleanDatabaseEvent {
  public static async run(): Promise<void> {
    const pastes = await db
      .getEntityManager()
      .fork()
      .find(Paste, {
        expiresAt: {
          $lt: new Date(),
          $ne: new Date(0)
        },
      });

    for (const paste of pastes) {
        await db.getEntityManager().fork().removeAndFlush(paste);
    }

    console.log(`Cleaned ${pastes.length} pastes`);
  }
}
