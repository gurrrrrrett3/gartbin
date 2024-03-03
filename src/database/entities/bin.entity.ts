import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import User from "./user.entity";

@Entity()
export class Bin {

    @PrimaryKey()
    id: string = Math.random().toString(36).substring(2, 6)

    @Property({
        type: "text"
    })
    content: string = ""

    @Property()
    language: string = "plaintext"

    @Property({
        nullable: true
    })
    filename?: string = ""

    get extension() {
        return this.filename?.split(".").pop() || "txt"
    }

    get name() {
        if (this.filename) {
            return this.filename.split(".").slice(0, -1).join(".")
        } else {
            return this.id
        }
    }

    @Property()
    createdAt: Date = new Date()

    @Property()
    updatedAt: Date = new Date()

    @Property({
        nullable: true
    })
    expiration?: Date

    @Property()
    views: number = 0

    @Property({
        nullable: true
    })
    password?: string

    @ManyToOne(() => User, { nullable: true })
    user?: User

}
