import assert from 'assert';
import { AuthService } from '../../../../src/core/services/AuthService';
import { User } from '../../../../src/core/models/User';
import { UserRole } from '../../../../src/shared/enums/UserRole';
import bcrypt from 'bcrypt';

describe('AuthServiceTest', () => {
  let authService: AuthService;

  beforeEach(() => {
    // Initialize a new AuthService instance
    authService = new AuthService();
    // Clear any existing user data or mocks
    // This might involve resetting a mock database or clearing in-memory storage
  });

  it('should register a new user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const newUser = await authService.register(userData.name, userData.email, userData.password);

    assert(newUser instanceof User, 'Registered user should be an instance of User');
    assert.strictEqual(newUser.name, userData.name, 'User name should match');
    assert.strictEqual(newUser.email, userData.email, 'User email should match');
    assert(await bcrypt.compare(userData.password, newUser.password_hash), 'Password should be hashed correctly');

    // Try to register with an existing email
    await assert.rejects(
      authService.register('Jane Doe', userData.email, 'anotherpassword'),
      /Email already exists/,
      'Should reject registration with existing email'
    );
  });

  it('should login user successfully and fail for incorrect credentials', async () => {
    const userData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'securepass'
    };

    await authService.register(userData.name, userData.email, userData.password);

    const sessionToken = await authService.login(userData.email, userData.password);
    assert(sessionToken && typeof sessionToken === 'string', 'Should return a valid session token');

    await assert.rejects(
      authService.login(userData.email, 'wrongpassword'),
      /Invalid credentials/,
      'Should reject login with incorrect password'
    );

    await assert.rejects(
      authService.login('nonexistent@example.com', userData.password),
      /User not found/,
      'Should reject login with non-existent email'
    );
  });

  it('should logout user successfully', async () => {
    const userData = {
      name: 'Alice Smith',
      email: 'alice@example.com',
      password: 'alicepass'
    };

    await authService.register(userData.name, userData.email, userData.password);
    const sessionToken = await authService.login(userData.email, userData.password);

    await authService.logout(sessionToken);

    const currentUser = await authService.getCurrentUser(sessionToken);
    assert.strictEqual(currentUser, null, 'Current user should be null after logout');
  });

  it('should get current user with valid token and return null for invalid token', async () => {
    const userData = {
      name: 'Bob Brown',
      email: 'bob@example.com',
      password: 'bobpass'
    };

    await authService.register(userData.name, userData.email, userData.password);
    const sessionToken = await authService.login(userData.email, userData.password);

    const currentUser = await authService.getCurrentUser(sessionToken);
    assert(currentUser instanceof User, 'Current user should be an instance of User');
    assert.strictEqual(currentUser.email, userData.email, 'Current user email should match');

    const invalidUser = await authService.getCurrentUser('invalid_token');
    assert.strictEqual(invalidUser, null, 'Should return null for invalid token');
  });

  it('should correctly check authorization for different user roles', async () => {
    const adminUser = await authService.register('Admin User', 'admin@example.com', 'adminpass', UserRole.Administrator);
    const editorUser = await authService.register('Editor User', 'editor@example.com', 'editorpass', UserRole.Editor);
    const viewerUser = await authService.register('Viewer User', 'viewer@example.com', 'viewerpass', UserRole.Viewer);

    const adminToken = await authService.login('admin@example.com', 'adminpass');
    const editorToken = await authService.login('editor@example.com', 'editorpass');
    const viewerToken = await authService.login('viewer@example.com', 'viewerpass');

    assert(await authService.isAuthorized(adminToken, UserRole.Administrator), 'Admin should be authorized as Administrator');
    assert(await authService.isAuthorized(adminToken, UserRole.Editor), 'Admin should be authorized as Editor');
    assert(await authService.isAuthorized(adminToken, UserRole.Viewer), 'Admin should be authorized as Viewer');

    assert(!(await authService.isAuthorized(editorToken, UserRole.Administrator)), 'Editor should not be authorized as Administrator');
    assert(await authService.isAuthorized(editorToken, UserRole.Editor), 'Editor should be authorized as Editor');
    assert(await authService.isAuthorized(editorToken, UserRole.Viewer), 'Editor should be authorized as Viewer');

    assert(!(await authService.isAuthorized(viewerToken, UserRole.Administrator)), 'Viewer should not be authorized as Administrator');
    assert(!(await authService.isAuthorized(viewerToken, UserRole.Editor)), 'Viewer should not be authorized as Editor');
    assert(await authService.isAuthorized(viewerToken, UserRole.Viewer), 'Viewer should be authorized as Viewer');
  });
});