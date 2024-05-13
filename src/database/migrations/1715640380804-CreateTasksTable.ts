import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTasksTable1715640380804 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tasks",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "estimated_hours",
                        type: "float",
                    },
                    {
                        name: "spent_hours",
                        type: "float",
                        isNullable:true,
                    },
                    {
                        name: "create_date",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "end_date",
                        type: "timestamp",
                    },
                    {
                        name: "deadline",
                        type: "timestamp",
                    },
                    {
                        name: "user_id",
                        type: "int",
                    },
                    {
                        name: "group_id",
                        type: "int",
                    },
                    {
                        name: "state_id",
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
                    {
                        columnNames: ["state_id"],
                        referencedTableName: "taskStates",
                        referencedColumnNames: ["id"],
                    },
                ],
            }),
            true // if no exist, creates it
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("tasks")
    }

}
