import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Paste {

    @PrimaryKey()
    id: string = Math.random().toString(36).substring(2, 6)

    @Property({
        type: "text"
    })
    content: string = ""

    @Property()
    language: string = "txt"

    @Property()
    createdAt: Date = new Date()

    @Property()
    expiresAt?: Date
    
    @Property()
    views: number = 0

    @Property({
        nullable: true
    })
    password?: string

    @Property({
        nullable: true
    })
    allowUpdate?: boolean = false

}
