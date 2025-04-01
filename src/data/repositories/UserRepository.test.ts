import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { SQL } from 'bun';
import { UserRepository } from './UserRepository';
import type { User } from '../../core/entities/User';

describe('UserRepository Integration Tests', () => {
	let container: StartedPostgreSqlContainer;
	let userRepository: UserRepository;
	let testDb: SQL;
	
	beforeAll(async () => {
		container = await new PostgreSqlContainer().withDatabase("test").start();
		console.log(`postgreSQL started at ${container.getConnectionUri()}`);

		testDb = new SQL({url: container.getConnectionUri()});
		
		userRepository = new UserRepository(testDb);
		
		// Создание тестовой таблицы
		await testDb`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				email VARCHAR(255) UNIQUE NOT NULL
			)
		`;
	});
	
	afterAll(async () => {
		await container.stop();
	});
	
	test('should create a user', async () => {
		console.log('should create a user');
	/* 	const user: Partial<User> = {
			name: 'Test User',
			email: 'test@example.com'
		};
		
		const createdUser = await userRepository.create(user as User);
		
		expect(createdUser.id).toBeDefined(); */
	//	expect(createdUser.name).toBe(user.name);
	});
	
	// Другие тесты для findById, update, getAll
});