namespace WebService.Models.DataTransferObjects.Dropdown;

public class Dropdown<T>
{
    public string Label { get; set; } = string.Empty;

    public T Value { get; set; }

    // Workaround for non-nullable generics.
    public Dropdown(string label, T value)
    {
        Label = label;
        Value = value;
    }
}
