import { IUser } from '../shared/interfaces';
import { User } from '../models/User';
import { UserRole } from '../shared/enums';
import { generateUniqueId } from '../shared/utils';
import bcrypt from 'bcrypt';

export class AuthService {
  private users: Map<string, IUser>;
  private sessions: Map<string, string>;

  constructor() {
    this.users = new Map<string, IUser>();
    this.sessions = new Map<string, string>();
  }

  async register(name: string, email: string, password: string): Promise<IUser> {
    // TODO: Implement password strength validation

    if (this.users.has(email)) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(generateUniqueId(), name, email, UserRole.Viewer);
    newUser.setPasswordHash(hashedPassword);

    this.users.set(email, newUser);

    // Return user object without sensitive information
    const { passwordHash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(email: string, password: string): Promise<string> {
    const user = this.users.get(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const sessionToken = generateUniqueId();
    this.sessions.set(sessionToken, user.id);

    return sessionToken;
  }

  async logout(sessionToken: string): Promise<void> {
    this.sessions.delete(sessionToken);
  }

  async getCurrentUser(sessionToken: string): Promise<IUser | null> {
    const userId = this.sessions.get(sessionToken);
    if (!userId) {
      return null;
    }

    const user = Array.from(this.users.values()).find(u => u.id === userId);
    return user || null;
  }

  async isAuthorized(sessionToken: string, requiredRole: UserRole): Promise<boolean> {
    const user = await this.getCurrentUser(sessionToken);
    if (!user) {
      return false;
    }

    // TODO: Implement more granular RBAC
    return user.role >= requiredRole;
  }

  // TODO: Implement password reset functionality
  // TODO: Implement multi-factor authentication
  // TODO: Implement session expiration and renewal
  // TODO: Implement rate limiting
  // TODO: Add logging for security-related events
  // TODO: Implement GDPR-compliant user data management
  // TODO: Add support for OAuth2 and other third-party authentication providers
}