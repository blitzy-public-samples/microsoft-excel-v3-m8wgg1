using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Ribbon;
using System.Windows.Input;
using System.Collections.ObjectModel;
using Microsoft.Win32;

public partial class RibbonInterface : RibbonWindow
{
    private readonly WorkbookService workbookService;
    private readonly VisualizationService visualizationService;

    public ICommand NewWorkbookCommand { get; private set; }
    public ICommand OpenWorkbookCommand { get; private set; }
    public ICommand SaveWorkbookCommand { get; private set; }
    public ICommand PasteCommand { get; private set; }
    public ICommand CutCommand { get; private set; }
    public ICommand CopyCommand { get; private set; }
    public ICommand InsertColumnChartCommand { get; private set; }
    public ICommand InsertPieChartCommand { get; private set; }

    public ObservableCollection<string> FontFamilies { get; } = new ObservableCollection<string>();
    public ObservableCollection<double> FontSizes { get; } = new ObservableCollection<double>();
    public string SelectedFontFamily { get; set; }
    public double SelectedFontSize { get; set; }
    public bool IsBoldSelected { get; set; }
    public bool IsItalicSelected { get; set; }

    public RibbonInterface(WorkbookService workbookService, VisualizationService visualizationService)
    {
        InitializeComponent();
        this.workbookService = workbookService;
        this.visualizationService = visualizationService;

        InitializeCommands();
        InitializeFontProperties();
        SetupEventHandlers();

        DataContext = this;
    }

    private void InitializeCommands()
    {
        NewWorkbookCommand = new RelayCommand(ExecuteNewWorkbook);
        OpenWorkbookCommand = new RelayCommand(ExecuteOpenWorkbook);
        SaveWorkbookCommand = new RelayCommand(ExecuteSaveWorkbook);
        PasteCommand = new RelayCommand(ExecutePaste);
        CutCommand = new RelayCommand(ExecuteCut);
        CopyCommand = new RelayCommand(ExecuteCopy);
        InsertColumnChartCommand = new RelayCommand(ExecuteInsertColumnChart);
        InsertPieChartCommand = new RelayCommand(ExecuteInsertPieChart);
    }

    private void InitializeFontProperties()
    {
        // Populate FontFamilies and FontSizes
        foreach (var fontFamily in System.Windows.Media.Fonts.SystemFontFamilies)
        {
            FontFamilies.Add(fontFamily.Source);
        }

        for (double size = 8; size <= 72; size += 2)
        {
            FontSizes.Add(size);
        }

        SelectedFontFamily = "Calibri";
        SelectedFontSize = 11;
    }

    private void SetupEventHandlers()
    {
        // Add event handlers for ribbon controls
    }

    private void ExecuteNewWorkbook(object parameter)
    {
        try
        {
            var newWorkbook = workbookService.CreateNewWorkbook();
            // Update UI to reflect the new workbook
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Error creating new workbook: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void ExecuteOpenWorkbook(object parameter)
    {
        var openFileDialog = new OpenFileDialog
        {
            Filter = "Excel Files|*.xlsx;*.xls|All Files|*.*"
        };

        if (openFileDialog.ShowDialog() == true)
        {
            try
            {
                var openedWorkbook = workbookService.OpenWorkbook(openFileDialog.FileName);
                // Update UI with the opened workbook
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error opening workbook: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }

    private void ExecuteSaveWorkbook(object parameter)
    {
        try
        {
            workbookService.SaveWorkbook();
            // Update UI to reflect the saved state
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Error saving workbook: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void ExecuteInsertColumnChart(object parameter)
    {
        try
        {
            var selectedRange = workbookService.GetSelectedRange();
            var chart = visualizationService.CreateColumnChart(selectedRange);
            workbookService.InsertChart(chart);
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Error inserting column chart: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void OnFontFamilyChanged(object sender, SelectionChangedEventArgs e)
    {
        if (e.AddedItems.Count > 0)
        {
            var selectedFont = e.AddedItems[0] as string;
            workbookService.ApplyFontFamilyToSelectedCells(selectedFont);
            // Refresh worksheet display
        }
    }

    private void OnFontSizeChanged(object sender, SelectionChangedEventArgs e)
    {
        if (e.AddedItems.Count > 0)
        {
            var selectedSize = (double)e.AddedItems[0];
            workbookService.ApplyFontSizeToSelectedCells(selectedSize);
            // Refresh worksheet display
        }
    }

    // Implement other command execution methods (Paste, Cut, Copy, InsertPieChart) similarly
}

// You would need to implement a RelayCommand class if not already available
public class RelayCommand : ICommand
{
    private readonly Action<object> _execute;
    private readonly Func<object, bool> _canExecute;

    public RelayCommand(Action<object> execute, Func<object, bool> canExecute = null)
    {
        _execute = execute ?? throw new ArgumentNullException(nameof(execute));
        _canExecute = canExecute;
    }

    public event EventHandler CanExecuteChanged
    {
        add { CommandManager.RequerySuggested += value; }
        remove { CommandManager.RequerySuggested -= value; }
    }

    public bool CanExecute(object parameter) => _canExecute == null || _canExecute(parameter);

    public void Execute(object parameter) => _execute(parameter);
}