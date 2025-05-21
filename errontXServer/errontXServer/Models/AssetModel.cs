namespace errontXServer.Models;

public class AssetModel
{
    public AssetModel() {}
    
    public AssetModel(string userId, string assetName, float  assetAmount, float assetPrice, string assetDate)
    {
        UserId = userId;
        AssetName = assetName;
        AssetAmount = assetAmount;
        AssetPrice = assetPrice;
        AssetDate = assetDate;
    }

    // Публичные свойства — обязательно!
    public Guid Id { get; set; } // Можно авто-генерацию
    public string UserId { get; set; }
    public string AssetName { get; set; }
    public float AssetAmount { get; set; }
    public float AssetPrice { get; set; }
    public string AssetDate { get; set; }
}