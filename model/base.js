import mysql from "mysql";

class BaseDb {
     #connection;

     constructor() {
          this.#connection = mysql.createConnection({
               host: "localhost",
               user: "project_manager_app_admin",
               password: "admin222",
               database: "project_manager_app",
          });
          this.#connection.connect();
          this.createTables();
     }

     getConnection() {
          return this.#connection;
     }

     createTables() {
          const createProjectTable = {
               query: `CREATE TABLE IF NOT EXISTS project (id VARCHAR(20)  PRIMARY KEY, 
                                                    name VARCHAR(300) NOT NULL,
                                                    date_created DATE NOT NULL DEFAULT(CURRENT_DATE)
                                                    )`,
               tableName: "project",
          };

          const createBoardTable = {
               query: `CREATE TABLE IF NOT EXISTS board (id VARCHAR(20) PRIMARY KEY, 
                                                    title VARCHAR(300) NOT NULL,
                                                    project_id VARCHAR(20) NOT NULL
                                                )`,
               tableName: "board",
          };

          const createCardTable = {
               query: `CREATE TABLE IF NOT EXISTS card (id VARCHAR(20) PRIMARY KEY, 
                                                    description TEXT NOT NULL,
                                                    board_id VARCHAR(20) NOT NULL,
                                                    is_completed BOOLEAN NOT NULL DEFAULT(FALSE)
                                                )`,
               tableName: "card",
          };

          const queryList = [
               createProjectTable,
               createBoardTable,
               createCardTable,
          ];

          for (let query of queryList) {
               this.#connection.query(query.query, (error, result) => {
                    if (!error) {
                         console.log(`${query.tableName} table created`);
                    } else {
                         console.log(
                              `${query.tableName} table not created.  ${error}. Check your database connection!`
                         );
                    }
               });
          }
     }

     getProjectBoards(projectId) {
          return new Promise((resolve, reject) => {
               const query = `SELECT * FROM board WHERE project_id = ${projectId}`;
               this.#connection.query(query, (error, result) => {
                    if (!error) {
                         resolve(result);
                    } else {
                         reject(error);
                    }
               });
          });
     }
}

const base = new BaseDb();
Object.freeze(base);
export default base;