using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Windows.Automation;
using TestStack.White;
using TestStack.White.UIItems;
using TestStack.White.UIItems.WindowItems;
using TestStack.White.Factory;
using TestStack.White.UIItems.Finders;

[TestClass]
public class WorkbookFlowTest
{
    private Application application;
    private Window mainWindow;
    private WorkbookService workbookService;
    private AuthService authService;

    [TestInitialize]
    public void TestInitialize()
    {
        // Launch the Excel desktop application
        application = Application.Launch("Excel.exe");
        
        // Initialize the main application window
        mainWindow = application.GetWindow("Microsoft Excel", InitializeOption.NoCache);
        
        // Set up the WorkbookService and AuthService
        workbookService = new WorkbookService();
        authService = new AuthService();
        
        // Log in a test user
        authService.Login("testuser@example.com", "password");
    }

    [TestCleanup]
    public void TestCleanup()
    {
        // Log out the test user
        authService.Logout();
        
        // Close the Excel application
        application.Close();
        
        // Clean up any created test data
        workbookService.CleanupTestData();
    }

    [TestMethod]
    public void TestCreateNewWorkbook()
    {
        // Click on the 'New Workbook' button in the application
        var newWorkbookButton = mainWindow.Get<Button>(SearchCriteria.ByAutomationId("NewWorkbookButton"));
        newWorkbookButton.Click();

        // Wait for the new workbook window to open
        var workbookWindow = mainWindow.Get<Window>(SearchCriteria.ByAutomationId("WorkbookWindow"));
        Assert.IsNotNull(workbookWindow, "New workbook window did not open");

        // Assert that a new workbook is created with default sheets
        var sheetTabs = workbookWindow.Get<TabStrip>(SearchCriteria.ByAutomationId("SheetTabs"));
        Assert.IsTrue(sheetTabs.TabCount > 0, "No default sheets were created");

        // Verify that the workbook title is editable
        var titleTextBox = workbookWindow.Get<TextBox>(SearchCriteria.ByAutomationId("WorkbookTitleTextBox"));
        Assert.IsTrue(titleTextBox.Enabled, "Workbook title is not editable");
    }

    [TestMethod]
    public void TestEditCellValues()
    {
        // Create a new workbook
        var newWorkbookButton = mainWindow.Get<Button>(SearchCriteria.ByAutomationId("NewWorkbookButton"));
        newWorkbookButton.Click();
        var workbookWindow = mainWindow.Get<Window>(SearchCriteria.ByAutomationId("WorkbookWindow"));

        // Enter values in multiple cells using the UI
        var cell1 = workbookWindow.Get<TextBox>(SearchCriteria.ByAutomationId("A1"));
        cell1.Enter("Test Value 1");
        var cell2 = workbookWindow.Get<TextBox>(SearchCriteria.ByAutomationId("B1"));
        cell2.Enter("Test Value 2");

        // Verify that the entered values are displayed correctly
        Assert.AreEqual("Test Value 1", cell1.Text, "Cell A1 value is incorrect");
        Assert.AreEqual("Test Value 2", cell2.Text, "Cell B1 value is incorrect");

        // Edit an existing cell value
        cell1.Enter("Updated Value");

        // Verify that the change is reflected in the UI
        Assert.AreEqual("Updated Value", cell1.Text, "Cell A1 value was not updated");
    }

    [TestMethod]
    public void TestFormulaCalculation()
    {
        // Create a new workbook
        var newWorkbookButton = mainWindow.Get<Button>(SearchCriteria.ByAutomationId("NewWorkbookButton"));
        newWorkbookButton.Click();
        var workbookWindow = mainWindow.Get<Window>(SearchCriteria.ByAutomationId("WorkbookWindow"));

        // Enter values in cells using the UI
        var cell1 = workbookWindow.Get<TextBox>(SearchCriteria.ByAutomationId("A1"));
        cell1.Enter("10");
        var cell2 = workbookWindow.Get<TextBox>(SearchCriteria.ByAutomationId("A2"));
        cell2.Enter("20");

        // Enter a formula in a cell
        var formulaCell = workbookWindow.Get<TextBox>(SearchCriteria.ByAutomationId("A3"));
        formulaCell.Enter("=SUM(A1:A2)");

        // Verify that the formula result is calculated correctly
        Assert.AreEqual("30", formulaCell.Text, "Formula result is incorrect");

        // Change a value in a cell referenced by the formula
        cell1.Enter("15");

        // Verify that the formula result updates automatically in the UI
        Assert.AreEqual("35", formulaCell.Text, "Formula result did not update automatically");
    }

    [TestMethod]
    public void TestSaveWorkbook()
    {
        // Create a new workbook and make some changes
        var newWorkbookButton = mainWindow.Get<Button>(SearchCriteria.ByAutomationId("NewWorkbookButton"));
        newWorkbookButton.Click();
        var workbookWindow = mainWindow.Get<Window>(SearchCriteria.ByAutomationId("WorkbookWindow"));
        var cell = workbookWindow.Get<TextBox>(SearchCriteria.ByAutomationId("A1"));
        cell.Enter("Test Save");

        // Click the save button in the UI
        var saveButton = workbookWindow.Get<Button>(SearchCriteria.ByAutomationId("SaveButton"));
        saveButton.Click();

        // Verify that the save operation completes successfully
        // (This might involve checking for a success message or the absence of error dialogs)

        // Close and reopen the workbook
        workbookWindow.Close();
        var openButton = mainWindow.Get<Button>(SearchCriteria.ByAutomationId("OpenButton"));
        openButton.Click();
        // (Implement logic to select the saved file in the Open dialog)

        // Verify that the changes persist after reopening
        workbookWindow = mainWindow.Get<Window>(SearchCriteria.ByAutomationId("WorkbookWindow"));
        cell = workbookWindow.Get<TextBox>(SearchCriteria.ByAutomationId("A1"));
        Assert.AreEqual("Test Save", cell.Text, "Saved changes did not persist");
    }

    [TestMethod]
    public void TestShareWorkbook()
    {
        // Create a new workbook
        var newWorkbookButton = mainWindow.Get<Button>(SearchCriteria.ByAutomationId("NewWorkbookButton"));
        newWorkbookButton.Click();
        var workbookWindow = mainWindow.Get<Window>(SearchCriteria.ByAutomationId("WorkbookWindow"));

        // Click on the share button in the UI
        var shareButton = workbookWindow.Get<Button>(SearchCriteria.ByAutomationId("ShareButton"));
        shareButton.Click();

        // Enter another user's email and set permissions
        var shareDialog = workbookWindow.Get<Window>(SearchCriteria.ByAutomationId("ShareDialog"));
        var emailInput = shareDialog.Get<TextBox>(SearchCriteria.ByAutomationId("EmailInput"));
        emailInput.Enter("anotheruser@example.com");
        var permissionComboBox = shareDialog.Get<ComboBox>(SearchCriteria.ByAutomationId("PermissionComboBox"));
        permissionComboBox.Select("Edit");
        var confirmButton = shareDialog.Get<Button>(SearchCriteria.ByAutomationId("ConfirmButton"));
        confirmButton.Click();

        // Verify that the share operation completes successfully
        // (This might involve checking for a success message or the absence of error dialogs)

        // Log in as the other user
        authService.Logout();
        authService.Login("anotheruser@example.com", "password");

        // Verify that the shared workbook is accessible
        var sharedWorkbooks = workbookService.GetSharedWorkbooks();
        Assert.IsTrue(sharedWorkbooks.Any(w => w.Name == "Shared Workbook"), "Shared workbook is not accessible");
    }
}