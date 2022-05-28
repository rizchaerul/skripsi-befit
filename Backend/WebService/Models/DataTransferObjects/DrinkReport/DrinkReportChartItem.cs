namespace WebService.Models.DataTransferObjects.DrinkReport;

public class DrinkReportChartItem
{
    public DateTime Date { get; set; }

    public int Target { get; set; }

    public int Progress { get; set; }

    public bool Pass { get; set; }
}
