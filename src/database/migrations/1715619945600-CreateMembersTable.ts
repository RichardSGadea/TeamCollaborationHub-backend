import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMembersTable1715619945600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "members",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "user_id",
                        type: "int",
                    },
                    {
                        name: "group_id",
                        type: "int",
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["user_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                    },
                    {
                        columnNames: ["group_id"],
                        referencedTableName: "groups",
                        referencedColumnNames: ["id"],
                    },
                ],
            }),
            true // if no exist, creates it
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("members")
    }
}
