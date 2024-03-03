import { db } from "../..";
import { Bin } from "../entities/bin.entity";

export default class CleanDatabaseEvent {
  public static async run(): Promise<void> {
    const pastes = await db
      .em
      .find(Bin, {
        expiration: {
          $lt: new Date(),
          $ne: new Date(0)
        },
      });

    for (const paste of pastes) {
      await db.em.removeAndFlush(paste);
    }

    console.log(`Cleaned ${pastes.length} pastes`);
  }
}
