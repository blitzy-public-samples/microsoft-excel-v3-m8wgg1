import assert from 'assert';
import { User } from '../../../../src/core/models/User';
import { UserRole } from '../../../../src/shared/enums/UserRole';

describe('UserTest', () => {
  describe('testUserCreation', () => {
    it('should create a new User instance with correct properties', () => {
      const user = new User('John Doe', 'john@example.com', UserRole.Editor);
      
      assert.strictEqual(user.name, 'John Doe');
      assert.strictEqual(user.email, 'john@example.com');
      assert.strictEqual(user.role, UserRole.Editor);
      assert.ok(user.id && user.id.length > 0, 'User ID should be generated and not empty');
    });
  });

  describe('testUpdateProfile', () => {
    it('should update user profile correctly', () => {
      const user = new User('John Doe', 'john@example.com', UserRole.Editor);
      user.updateProfile({ name: 'Jane Doe', email: 'jane@example.com' });
      
      assert.strictEqual(user.name, 'Jane Doe');
      assert.strictEqual(user.email, 'jane@example.com');
    });
  });

  describe('testSetRole', () => {
    it('should update user role correctly', () => {
      const user = new User('John Doe', 'john@example.com', UserRole.Editor);
      user.setRole(UserRole.Administrator);
      
      assert.strictEqual(user.role, UserRole.Administrator);
    });
  });

  describe('testUpdatePreferences', () => {
    it('should update user preferences correctly', () => {
      const user = new User('John Doe', 'john@example.com', UserRole.Editor);
      const newPreferences = { theme: 'dark', language: 'en' };
      user.updatePreferences(newPreferences);
      
      assert.deepStrictEqual(user.preferences, newPreferences);
    });
  });

  describe('testToJSON', () => {
    it('should return correct JSON representation without sensitive information', () => {
      const user = new User('John Doe', 'john@example.com', UserRole.Editor);
      const json = user.toJSON();
      
      assert.ok(json.id);
      assert.strictEqual(json.name, 'John Doe');
      assert.strictEqual(json.email, 'john@example.com');
      assert.strictEqual(json.role, UserRole.Editor);
      assert.ok(json.preferences);
      assert.ok(!json.hasOwnProperty('password'), 'JSON should not include password');
    });
  });
});