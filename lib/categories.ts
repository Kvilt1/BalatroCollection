// Import all category data files
import Blind from '@/categories/Blind.json';
import Booster from '@/categories/Booster.json';
import Deck from '@/categories/Deck.json';
import Enhancement from '@/categories/Enhancement.json';
import Joker from '@/categories/Joker.json';
import Planet from '@/categories/Planet.json';
import Seal from '@/categories/Seal.json';
import Spectral from '@/categories/Spectral.json';
import Tag from '@/categories/Tag.json';
import Tarot from '@/categories/Tarot.json';
import Voucher from '@/categories/Voucher.json';
import VoucherPlus from '@/categories/VoucherPlus.json';

// Extract the category data from each file
const blindData = Blind.Blind;
const boosterData = Booster.Booster;
const deckData = Deck.Deck;
const enhancementData = Enhancement.Enhancement;
const jokerData = Joker.Joker;
const planetData = Planet.Planet;
const sealData = Seal.Seal;
const spectralData = Spectral.Spectral;
const tagData = Tag.Tag;
const tarotData = Tarot.Tarot;
const voucherData = Voucher.Voucher;
const voucherPlusData = VoucherPlus.VoucherPlus;

// Create a consolidated object that mimics the structure of the original consolidated file
export const categoryData = {
  Blind: blindData,
  Booster: boosterData,
  Deck: deckData,
  Enhancement: enhancementData,
  Joker: jokerData,
  Planet: planetData,
  Seal: sealData,
  Spectral: spectralData,
  Tag: tagData,
  Tarot: tarotData,
  Voucher: voucherData,
  VoucherPlus: voucherPlusData
};

// Export individual categories for direct import by category pages
export { 
  blindData as Blind,
  boosterData as Booster,
  deckData as Deck,
  enhancementData as Enhancement,
  jokerData as Joker,
  planetData as Planet,
  sealData as Seal,
  spectralData as Spectral,
  tagData as Tag,
  tarotData as Tarot,
  voucherData as Voucher,
  voucherPlusData as VoucherPlus
};

// Typescript interfaces
export interface CardItem {
  id: string;
  name: string;
  effect: string;
  appearance: string;
  category: string;
  type: string | null;
  rarity: string | null;
  cost: string | null;
  unlock_requirement: string | null;
  additional: string | null;
  related_items: string[];
}

export interface CardCategory {
  image_folder: string;
  items: CardItem[];
}

export interface BalatraData {
  Blind: CardCategory;
  Booster: CardCategory;
  Deck: CardCategory;
  Enhancement: CardCategory;
  Joker: CardCategory;
  Planet: CardCategory;
  Seal: CardCategory;
  Spectral: CardCategory;
  Tag: CardCategory;
  Tarot: CardCategory;
  Voucher: CardCategory;
  VoucherPlus: CardCategory;
} 