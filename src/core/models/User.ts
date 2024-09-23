import { IUser } from '../shared/interfaces';
import { UserRole } from '../shared/enums';
import { generateUniqueId } from '../shared/utils';

export class User implements IUser {
  public id: string;
  public name: string;
  public email: string;
  public role: UserRole;
  public preferences: object;

  constructor(name: string, email: string, role: UserRole) {
    this.id = generateUniqueId();
    this.name = name;
    this.email = email;
    this.role = role;
    this.preferences = {};
  }

  public updateProfile(updates: { name?: string; email?: string }): void {
    // TODO: Implement proper error handling for invalid inputs
    if (updates.name) {
      this.name = updates.name;
    }
    if (updates.email) {
      // TODO: Add validation logic for email format
      this.email = updates.email;
    }
    // TODO: Trigger any necessary side effects (e.g., update database)
  }

  public setRole(newRole: UserRole): void {
    // TODO: Implement proper error handling for invalid inputs
    this.role = newRole;
    // TODO: Trigger any necessary side effects (e.g., update permissions)
  }

  public updatePreferences(newPreferences: object): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    // TODO: Trigger any necessary side effects (e.g., update UI)
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      preferences: this.preferences
    };
  }

  // TODO: Implement a method to check if the user has a specific permission
  // public hasPermission(permission: string): boolean {
  //   // Implementation
  // }

  // TODO: Consider adding methods for password management if applicable
  // public changePassword(newPassword: string): void {
  //   // Implementation
  // }

  // TODO: Consider implementing a static method to create a User instance from a plain object
  // public static fromObject(obj: any): User {
  //   // Implementation
  // }
}

// TODO: Add unit tests for the User class and its methods