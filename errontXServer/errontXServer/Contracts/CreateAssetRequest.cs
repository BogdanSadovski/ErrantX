namespace errontXServer.Contracts;

public record CreateAssetRequest(string userId, string assetName, float assetAmount, float assetPrice, string assetDate);
