import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1744291975784 implements MigrationInterface {
  name = 'Users1744291975784';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(255) NOT NULL, \`role\` varchar(64) NOT NULL, \`efficiency\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP TABLE \`users\``);
  }
}
