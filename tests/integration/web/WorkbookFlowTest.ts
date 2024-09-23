import { assert } from 'assert';
import { WebDriver, By, until } from 'selenium-webdriver';
import { WorkbookService } from '../../../src/core/services/WorkbookService';
import { AuthService } from '../../../src/core/services/AuthService';

class WorkbookFlowTest {
    private driver: WebDriver;
    private workbookService: WorkbookService;
    private authService: AuthService;

    async setUp(): Promise<void> {
        // Initialize the WebDriver
        this.driver = new WebDriver(/* configuration */);

        // Set up the WorkbookService and AuthService
        this.workbookService = new WorkbookService();
        this.authService = new AuthService();

        // Log in a test user
        await this.authService.login('testuser@example.com', 'password');
    }

    async tearDown(): Promise<void> {
        // Log out the test user
        await this.authService.logout();

        // Quit the WebDriver
        await this.driver.quit();

        // Clean up any created test data
        await this.workbookService.deleteAllTestWorkbooks();
    }

    async testCreateNewWorkbook(): Promise<void> {
        // Navigate to the home page
        await this.driver.get('https://excel.example.com');

        // Click on the 'New Workbook' button
        const newWorkbookButton = await this.driver.findElement(By.id('new-workbook-button'));
        await newWorkbookButton.click();

        // Wait for the workbook to load
        await this.driver.wait(until.elementLocated(By.id('workbook-container')), 5000);

        // Assert that a new workbook is created with default sheets
        const sheetTabs = await this.driver.findElements(By.className('sheet-tab'));
        assert.strictEqual(sheetTabs.length, 1, 'New workbook should have one default sheet');

        // Verify that the workbook title is editable
        const workbookTitle = await this.driver.findElement(By.id('workbook-title'));
        assert.strictEqual(await workbookTitle.isEnabled(), true, 'Workbook title should be editable');
    }

    async testEditCellValues(): Promise<void> {
        // Create a new workbook
        await this.testCreateNewWorkbook();

        // Enter values in multiple cells
        const cellA1 = await this.driver.findElement(By.id('cell-A1'));
        await cellA1.sendKeys('10');
        const cellB1 = await this.driver.findElement(By.id('cell-B1'));
        await cellB1.sendKeys('20');

        // Verify that the entered values are displayed correctly
        assert.strictEqual(await cellA1.getAttribute('value'), '10', 'Cell A1 should contain 10');
        assert.strictEqual(await cellB1.getAttribute('value'), '20', 'Cell B1 should contain 20');

        // Edit an existing cell value
        await cellA1.clear();
        await cellA1.sendKeys('15');

        // Verify that the change is reflected
        assert.strictEqual(await cellA1.getAttribute('value'), '15', 'Cell A1 should be updated to 15');
    }

    async testFormulaCalculation(): Promise<void> {
        // Create a new workbook
        await this.testCreateNewWorkbook();

        // Enter values in cells
        const cellA1 = await this.driver.findElement(By.id('cell-A1'));
        await cellA1.sendKeys('10');
        const cellB1 = await this.driver.findElement(By.id('cell-B1'));
        await cellB1.sendKeys('20');

        // Enter a formula in a cell
        const cellC1 = await this.driver.findElement(By.id('cell-C1'));
        await cellC1.sendKeys('=A1+B1');

        // Verify that the formula result is calculated correctly
        assert.strictEqual(await cellC1.getAttribute('value'), '30', 'Formula result should be 30');

        // Change a value in a cell referenced by the formula
        await cellA1.clear();
        await cellA1.sendKeys('15');

        // Verify that the formula result updates automatically
        assert.strictEqual(await cellC1.getAttribute('value'), '35', 'Formula result should update to 35');
    }

    async testSaveWorkbook(): Promise<void> {
        // Create a new workbook and make some changes
        await this.testEditCellValues();

        // Click the save button
        const saveButton = await this.driver.findElement(By.id('save-button'));
        await saveButton.click();

        // Verify that the save operation completes successfully
        const saveConfirmation = await this.driver.wait(until.elementLocated(By.id('save-confirmation')), 5000);
        assert.strictEqual(await saveConfirmation.isDisplayed(), true, 'Save confirmation should be displayed');

        // Reload the page
        await this.driver.navigate().refresh();

        // Verify that the changes persist after reload
        const cellA1 = await this.driver.findElement(By.id('cell-A1'));
        assert.strictEqual(await cellA1.getAttribute('value'), '15', 'Cell A1 value should persist after reload');
    }

    async testShareWorkbook(): Promise<void> {
        // Create a new workbook
        await this.testCreateNewWorkbook();

        // Click on the share button
        const shareButton = await this.driver.findElement(By.id('share-button'));
        await shareButton.click();

        // Enter another user's email and set permissions
        const shareEmailInput = await this.driver.findElement(By.id('share-email-input'));
        await shareEmailInput.sendKeys('anotheruser@example.com');
        const permissionSelect = await this.driver.findElement(By.id('permission-select'));
        await permissionSelect.sendKeys('Edit');

        // Verify that the share operation completes successfully
        const shareConfirmButton = await this.driver.findElement(By.id('share-confirm-button'));
        await shareConfirmButton.click();
        const shareConfirmation = await this.driver.wait(until.elementLocated(By.id('share-confirmation')), 5000);
        assert.strictEqual(await shareConfirmation.isDisplayed(), true, 'Share confirmation should be displayed');

        // Log in as the other user
        await this.authService.logout();
        await this.authService.login('anotheruser@example.com', 'password');

        // Verify that the shared workbook is accessible
        await this.driver.get('https://excel.example.com');
        const sharedWorkbook = await this.driver.findElement(By.xpath(`//div[contains(text(), 'Shared Workbook')]`));
        assert.strictEqual(await sharedWorkbook.isDisplayed(), true, 'Shared workbook should be accessible');
    }
}