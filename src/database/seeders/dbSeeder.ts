import { RoleSeeder } from "./RoleSeeder";
import { TaskStatesSeeder } from "./TaskStatesSeeder";
import { UserSeeder } from "./UserSeeder";


(async () =>{
    console.log("Starting seeders...");
    await new RoleSeeder().start();
    await new UserSeeder().start();
    await new TaskStatesSeeder().start();
})();