import assert from 'assert';
import { Workbook } from '../../../../src/core/models/Workbook';
import { Worksheet } from '../../../../src/core/models/Worksheet';
import { User } from '../../../../src/core/models/User';
import { WorkbookPermission } from '../../../../src/shared/enums/WorkbookPermission';

describe('WorkbookTest', () => {
  let mockUser: User;
  let workbook: Workbook;

  beforeEach(() => {
    mockUser = new User('Test User', 'test@example.com', 'Editor');
    workbook = new Workbook('Test Workbook', mockUser);
  });

  describe('testWorkbookCreation', () => {
    it('should create a new Workbook instance with correct properties', () => {
      assert.strictEqual(workbook.name, 'Test Workbook');
      assert.strictEqual(workbook.owner, mockUser);
      assert.ok(workbook.id);
      assert.strictEqual(workbook.worksheets.length, 1);
      assert.ok(workbook.createdAt instanceof Date);
      assert.ok(workbook.modifiedAt instanceof Date);
    });
  });

  describe('testAddWorksheet', () => {
    it('should add a new worksheet to the workbook', () => {
      const initialCount = workbook.worksheets.length;
      const newWorksheet = workbook.addWorksheet('New Sheet');
      
      assert.strictEqual(workbook.worksheets.length, initialCount + 1);
      assert.ok(workbook.worksheets.includes(newWorksheet));
      assert.strictEqual(newWorksheet.name, 'New Sheet');
    });
  });

  describe('testRemoveWorksheet', () => {
    it('should remove a worksheet from the workbook', () => {
      const newWorksheet = workbook.addWorksheet('To Remove');
      const initialCount = workbook.worksheets.length;
      
      const removed = workbook.removeWorksheet(newWorksheet.id);
      
      assert.strictEqual(workbook.worksheets.length, initialCount - 1);
      assert.ok(removed);
      assert.ok(!workbook.worksheets.includes(newWorksheet));
    });

    it('should return false when trying to remove non-existent worksheet', () => {
      const removed = workbook.removeWorksheet('non-existent-id');
      assert.strictEqual(removed, false);
    });
  });

  describe('testGetWorksheet', () => {
    it('should return the correct worksheet by ID', () => {
      const newWorksheet = workbook.addWorksheet('Test Sheet');
      const retrievedWorksheet = workbook.getWorksheet(newWorksheet.id);
      
      assert.strictEqual(retrievedWorksheet, newWorksheet);
    });

    it('should return undefined for non-existent worksheet ID', () => {
      const retrievedWorksheet = workbook.getWorksheet('non-existent-id');
      assert.strictEqual(retrievedWorksheet, undefined);
    });
  });

  describe('testSetPermissions', () => {
    it('should set permissions correctly for a user', () => {
      const newUser = new User('New User', 'new@example.com', 'Viewer');
      const permissions = [WorkbookPermission.Read, WorkbookPermission.Write];
      
      workbook.setPermissions(newUser, permissions);
      
      const userPermissions = workbook.permissions.find(p => p.user === newUser);
      assert.ok(userPermissions);
      assert.deepStrictEqual(userPermissions.permissions, permissions);
    });
  });

  describe('testHasPermission', () => {
    it('should correctly identify user permissions', () => {
      const newUser = new User('New User', 'new@example.com', 'Viewer');
      const permissions = [WorkbookPermission.Read, WorkbookPermission.Write];
      
      workbook.setPermissions(newUser, permissions);
      
      assert.strictEqual(workbook.hasPermission(newUser, WorkbookPermission.Read), true);
      assert.strictEqual(workbook.hasPermission(newUser, WorkbookPermission.Write), true);
      assert.strictEqual(workbook.hasPermission(newUser, WorkbookPermission.Delete), false);
    });
  });

  describe('testSave', () => {
    it('should update the lastModified timestamp when saving', async () => {
      const originalModifiedAt = workbook.modifiedAt;
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      
      await workbook.save();
      
      assert.ok(workbook.modifiedAt > originalModifiedAt);
    });
  });

  describe('testToJSON', () => {
    it('should return a correct JSON representation of the workbook', () => {
      const json = workbook.toJSON();
      
      assert.strictEqual(json.id, workbook.id);
      assert.strictEqual(json.name, workbook.name);
      assert.strictEqual(json.owner, mockUser.id);
      assert.strictEqual(json.worksheets.length, workbook.worksheets.length);
      assert.ok(json.createdAt);
      assert.ok(json.modifiedAt);
    });
  });
});