export interface AssetPriceDto {
  assetType: AssetType;
  buyPrice: number;
  sellPrice: number;
  source: string;
  createdAt: string; 
}

export enum AssetType {
  Gold = 1,
  Silver = 2,
}

export interface MarketPricesResponse {
  gold: AssetPriceDto;
  silver: AssetPriceDto;
}

export interface AssetDetails {
  title: string;
  availableGrams: number;
  livePricePerGram: number;
}
export interface AssetMap {
  [key: string]: AssetDetails;
  gold: AssetDetails;
  silver: AssetDetails;
}