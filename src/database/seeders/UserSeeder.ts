import { SeederConfig } from "../../config/seeders";
import { UserRoles } from "../../constants/UserRoles";
import { User } from "../../models/User";
import { UserFactory } from "../factories/UserFactory";
import { Seeder } from "./Seeder";

export class UserSeeder extends Seeder{
    protected async generate(): Promise<void> {
        const {ADMINS, TEACHERS, STUDENTS} = SeederConfig;

        const userFactory = new UserFactory();

        //admins
        const adminUsers = userFactory.createMany(ADMINS);
        adminUsers.forEach((user, i)=>{
            user.role = UserRoles.ADMIN;
            user.email = `admin${i+1}@admin.com`
        });

        //workers
        const teacherUsers =  userFactory.createMany(TEACHERS);
        teacherUsers.forEach((user, i)=>{
            user.role = UserRoles.TEACHER;
            user.email = `teacher${i+1}@teacher.com`
        });

        //clients
        const studentUsers = userFactory.createMany(STUDENTS);
        studentUsers.forEach((user)=>{
            user.role = UserRoles.STUDENT;
        });

        //Save to DataBase
        const allUsers = [...adminUsers, ...teacherUsers, ...studentUsers];
        await User.save(allUsers)

    }
}