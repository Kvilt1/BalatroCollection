"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SaveFileData, parseMetaFile } from "@/lib/save-file"
import data from '../../consolidated_balatro_data.json'
import { Trash2 } from "lucide-react"

// List of base game jokers (excluding cry jokers)
const FILTERED_JOKERS = [
  "j_ring_master",
  "j_onyx_agate",
  "j_mr_bones",
  "j_matador",
  "j_family",
  "j_chicot",
  "j_hit_the_road",
  "j_smeared",
  "j_merry_andy",
  "j_troubadour",
  "j_tribe",
  "j_throwback",
  "j_shoot_the_moon",
  "j_swashbuckler",
  "j_stuntman",
  "j_brainstorm",
  "j_wee",
  "j_astronomer",
  "j_burnt",
  "j_yorick",
  "j_rough_gem",
  "j_order",
  "j_arrowhead",
  "j_perkeo",
  "j_bootstraps",
  "j_idol",
  "j_duo",
  "j_caino",
  "j_cartomancer",
  "j_seeing_double",
  "j_glass",
  "j_oops",
  "j_acrobat",
  "j_satellite",
  "j_hanging_chad",
  "j_trio",
  "j_invisible",
  "j_triboulet",
  "j_ticket",
  "j_blueprint",
  "j_flower_pot",
  "j_sock_and_buskin",
  "j_drivers_license",
  "j_bloodstone",
  "j_certificate"
];

type UnlockCategory = 'eventual' | 'easy' | 'difficult';

interface JokerCategoryInfo {
  category: UnlockCategory;
  strategy: string;
}

type JokerCategories = {
  [key: string]: JokerCategoryInfo;
}

const UNLOCK_CATEGORIES: Record<UnlockCategory, string> = {
  eventual: "Eventual Jokers - Will unlock naturally through gameplay",
  easy: "Easy Jokers - Require some effort but fairly straightforward",
  difficult: "Difficult Jokers - Require significant effort or luck"
};

const JOKER_CATEGORIES: JokerCategories = {
  "j_mr_bones": { category: "eventual", strategy: "Just lose five runs." },
  "j_acrobat": { category: "eventual", strategy: "Play normally, you'll reach 200 hands eventually." },
  "j_sock_and_buskin": { category: "eventual", strategy: "Play normally, focus on face cards if desired." },
  "j_swashbuckler": { category: "eventual", strategy: "Sell jokers when you get better ones." },
  "j_throwback": { category: "eventual", strategy: "Simply continue a saved run from the main menu." },
  "j_ring_master": { category: "eventual", strategy: "Play until you reach Ante 4." },
  "j_flower_pot": { category: "eventual", strategy: "Play until you reach Ante 8." },
  "j_blueprint": { category: "eventual", strategy: "Win your first run." },
  "j_oops": { category: "eventual", strategy: "Build a decent scoring hand to reach 10,000 chips." },
  "j_cartomancer": { category: "eventual", strategy: "Collect and use Tarot cards regularly." },
  "j_burnt": { category: "eventual", strategy: "Sell cards when better options appear." },
  "j_caino": { category: "eventual", strategy: "Obtain through the Soul card." },
  "j_triboulet": { category: "eventual", strategy: "Obtain through the Soul card." },
  "j_yorick": { category: "eventual", strategy: "Obtain through the Soul card." },
  "j_chicot": { category: "eventual", strategy: "Obtain through the Soul card." },
  "j_perkeo": { category: "eventual", strategy: "Obtain through the Soul card." },
  "j_golden_ticket": { category: "easy", strategy: "Use Devil cards or Midas Mask to create Gold cards." },
  "j_troubadour": { category: "easy", strategy: "Build a strong hand early and win 5 rounds with single plays." },
  "j_certificate": { category: "easy", strategy: "Use Devil card on Gold seal card or Talisman on Gold card." },
  "j_smeared": { category: "easy", strategy: "Use Lovers cards and buy standard packs for Wild cards." },
  "j_hanging_chad": { category: "easy", strategy: "Beat a boss blind with High Card, easier at lower antes." },
  "j_bloodstone": { category: "easy", strategy: "Use Checkered Deck plus 6 more Hearts." },
  "j_arrowhead": { category: "easy", strategy: "Use Checkered Deck plus 6 more Spades." },
  "j_glass": { category: "easy", strategy: "Use Justice cards and standard packs for Glass cards." },
  "j_wee": { category: "easy", strategy: "Build strong early and win quickly." },
  "j_idol": { category: "easy", strategy: "Build a powerful scoring combination." },
  "j_matador": { category: "easy", strategy: "Build strong and target Needle blind early." },
  "j_duo": { category: "easy", strategy: "Win a run without playing any Pairs." },
  "j_trio": { category: "easy", strategy: "Win a run without playing Three of a Kind." },
  "j_family": { category: "easy", strategy: "Win a run without playing Four of a Kind." },
  "j_order": { category: "easy", strategy: "Win a run without playing any Straights." },
  "j_tribe": { category: "easy", strategy: "Win a run without playing any Flushes." },
  "j_invisible": { category: "easy", strategy: "Win with Painted Deck, stay under 4 jokers." },
  "j_brainstorm": { category: "easy", strategy: "Use Checkered Deck, Sun/World cards help." },
  "j_drivers_license": { category: "easy", strategy: "Buy Arcana packs and use enhancement cards." },
  "j_astronomer": { category: "easy", strategy: "Discover secret hands: Five of a Kind, Flush House, Flush Five." },
  "j_bootstraps": { category: "easy", strategy: "Use Wheel of Fortune, Polychrome Tags, or Anaglyph Deck." },
  "j_rough_gem": { category: "difficult", strategy: "Collect 17 more Diamonds without a specialized deck." },
  "j_onyx_agate": { category: "difficult", strategy: "Collect 17 more Clubs without a specialized deck." },
  "j_merry_andy": { category: "difficult", strategy: "Win in 12 rounds - only 4 non-boss blinds allowed." },
  "j_seeing_double": { category: "difficult", strategy: "Get four 7♣ using Moon cards or collecting them." },
  "j_hit_the_road": { category: "difficult", strategy: "Collect Jacks and discard 5 at once." },
  "j_stuntman": { category: "difficult", strategy: "Build an extremely powerful scoring combination." },
  "j_satellite": { category: "difficult", strategy: "Focus on economy jokers while maintaining strength." },
  "j_shoot_the_moon": { category: "difficult", strategy: "Use Checkered Deck and focus on Heart flushes." }
};

function formatJokerId(id: string): string {
  // Find the joker in our data
  const joker = data.Joker.items.find(item => item.id === id)
  if (joker) {
    return joker.name
  }
  // If not found, format the ID nicely
  return id
    .replace('j_', '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getJokerData(id: string) {
  // Find the joker in our data by gameid
  return data.Joker.items.find(item => item.gameid === id)
}

function getJokerCategory(id: string): UnlockCategory {
  return JOKER_CATEGORIES[id]?.category || "eventual";
}

function getJokerStrategy(id: string): string {
  return JOKER_CATEGORIES[id]?.strategy || "No specific strategy available.";
}

function getCategoryColor(category: UnlockCategory): string {
  switch(category) {
    case "eventual": return "bg-yellow-500/20 text-yellow-200";
    case "easy": return "bg-orange-500/20 text-orange-200";
    case "difficult": return "bg-rose-500/20 text-rose-200";
    default: return "bg-gray-500/20 text-gray-200";
  }
}

// Update the sort state type
type SortOption = 'name-asc' | 'name-desc' | 'difficulty-asc' | 'difficulty-desc' | 'rarity-asc' | 'rarity-desc';

type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary';

const RARITY_ORDER: Record<Rarity, number> = {
  'Common': 0,
  'Uncommon': 1,
  'Rare': 2,
  'Legendary': 3
};

function getRarityColor(rarity: Rarity | undefined): string {
  switch(rarity) {
    case 'Common': return 'bg-gray-500/20 text-gray-200';
    case 'Uncommon': return 'bg-green-500/20 text-green-200';
    case 'Rare': return 'bg-blue-500/20 text-blue-200';
    case 'Legendary': return 'bg-purple-500/20 text-purple-200';
    default: return 'bg-gray-500/20 text-gray-200';
  }
}

export default function SaveAnalysisPage() {
  const [saveData, setSaveData] = useState<SaveFileData | null>(null)
  const [showRawData, setShowRawData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('balatro-meta')
    if (savedData) {
      try {
        setSaveData(JSON.parse(savedData))
      } catch (error) {
        console.error('Error loading saved data:', error)
        localStorage.removeItem('balatro-meta')
      }
    }
  }, [])

  const handleLoadSaveFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result
        if (!buffer) throw new Error('Failed to read file')
        
        const data = parseMetaFile(buffer)
        setSaveData(data)
        // Save to localStorage
        localStorage.setItem('balatro-meta', JSON.stringify(data))
      } catch (error) {
        console.error('Error loading save file:', error)
        setError('Failed to parse meta.jkr file. Make sure it is a valid Balatro save file.')
        setSaveData(null)
        localStorage.removeItem('balatro-meta')
      }
    }

    reader.onerror = () => {
      setError('Failed to read file')
      setSaveData(null)
      localStorage.removeItem('balatro-meta')
    }

    reader.readAsArrayBuffer(file)
  }

  const handleClearData = () => {
    setSaveData(null)
    setShowRawData(false)
    localStorage.removeItem('balatro-meta')
  }

  const getJokerIds = (items: { [key: string]: boolean }) => {
    return Object.keys(items)
      .filter(id => FILTERED_JOKERS.includes(id))
  }

  const getLockedJokers = (unlockedItems: { [key: string]: boolean }) => {
    const unlockedIds = Object.keys(unlockedItems)
    return FILTERED_JOKERS.filter(id => !unlockedIds.includes(id))
  }

  const totalJokers = FILTERED_JOKERS.length
  const unlockedJokers = saveData ? getJokerIds(saveData.unlocked).length : 0

  const sortJokers = (jokers: string[]) => {
    return [...jokers].sort((a, b) => {
      const jokerA = getJokerData(a);
      const jokerB = getJokerData(b);
      const difficultyOrder = { eventual: 0, easy: 1, difficult: 2 };
      
      switch (sortBy) {
        case 'rarity-asc':
          const rarityA = RARITY_ORDER[jokerA?.rarity as Rarity] ?? RARITY_ORDER.Common;
          const rarityB = RARITY_ORDER[jokerB?.rarity as Rarity] ?? RARITY_ORDER.Common;
          if (rarityA !== rarityB) return rarityA - rarityB;
          return (jokerA?.name || '').localeCompare(jokerB?.name || '');
        
        case 'rarity-desc':
          const rarityADesc = RARITY_ORDER[jokerA?.rarity as Rarity] ?? RARITY_ORDER.Common;
          const rarityBDesc = RARITY_ORDER[jokerB?.rarity as Rarity] ?? RARITY_ORDER.Common;
          if (rarityADesc !== rarityBDesc) return rarityBDesc - rarityADesc;
          return (jokerA?.name || '').localeCompare(jokerB?.name || '');

        case 'difficulty-asc':
          const diffA = difficultyOrder[getJokerCategory(a)];
          const diffB = difficultyOrder[getJokerCategory(b)];
          if (diffA !== diffB) return diffA - diffB;
          return (jokerA?.name || '').localeCompare(jokerB?.name || '');
        
        case 'difficulty-desc':
          const diffADesc = difficultyOrder[getJokerCategory(a)];
          const diffBDesc = difficultyOrder[getJokerCategory(b)];
          if (diffADesc !== diffBDesc) return diffBDesc - diffADesc;
          return (jokerA?.name || '').localeCompare(jokerB?.name || '');
        
        case 'name-desc':
          return (jokerB?.name || '').localeCompare(jokerA?.name || '');
        
        case 'name-asc':
        default:
          return (jokerA?.name || '').localeCompare(jokerB?.name || '');
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 to-slate-950">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-white/50 hover:text-white">
            ← Back to Categories
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Base Game Jokers</h1>
            <div className="bg-black/20 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-white mb-3">Unlock Difficulty Categories</h2>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded ${getCategoryColor("eventual")}`}>Eventual</div>
                  <span className="text-white/70">Will unlock naturally through gameplay</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded ${getCategoryColor("easy")}`}>Easy</div>
                  <span className="text-white/70">Require some effort but fairly straightforward</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded ${getCategoryColor("difficult")}`}>Difficult</div>
                  <span className="text-white/70">Require significant effort or luck</span>
                </div>
              </div>
            </div>
            <p className="text-white/70 mb-4">
              Upload your meta.jkr file to see which base game jokers you have unlocked.
              The file is located in your Balatro save directory, typically at:
              <br />
              <code className="text-sm bg-black/20 px-2 py-1 rounded mt-2 block">
                %APPDATA%/Balatro/saves/meta.jkr
              </code>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="file"
                accept=".jkr"
                onChange={handleLoadSaveFile}
                className="sr-only"
              />
              <span className="px-4 py-2 text-sm text-white bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                Load meta.jkr
              </span>
            </label>
            {saveData && (
              <>
                <button
                  onClick={() => setShowRawData(!showRawData)}
                  className="px-4 py-2 text-sm text-white bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                >
                  {showRawData ? "Show Analysis" : "Show Raw Data"}
                </button>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 text-sm text-red-200 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                  title="Clear saved data"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Data
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}

          {saveData && (
            <div className="bg-black/20 rounded-lg p-6">
              {showRawData ? (
                <div className="font-mono text-sm text-white/80 overflow-auto max-h-[600px]">
                  <pre>{JSON.stringify(
                    {
                      unlocked: Object.fromEntries(
                        Object.entries(saveData.unlocked)
                          .filter(([key]) => FILTERED_JOKERS.includes(key))
                      )
                    }, 
                    null, 
                    2
                  )}</pre>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-white">
                          Base Game Jokers
                          <span className="text-sm font-normal text-white/60 ml-2">
                            ({unlockedJokers} / {totalJokers} jokers)
                          </span>
                        </h2>
                        <div className="text-sm text-white/60">
                          {Math.round((unlockedJokers / totalJokers) * 100)}% Complete
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white/60">Sort by:</span>
                        <select 
                          className="bg-black/20 text-white px-3 py-1 rounded border border-white/20"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as SortOption)}
                        >
                          <option value="name-asc">Name (A-Z)</option>
                          <option value="name-desc">Name (Z-A)</option>
                          <option value="difficulty-asc">Difficulty (Easiest First)</option>
                          <option value="difficulty-desc">Difficulty (Hardest First)</option>
                          <option value="rarity-asc">Rarity (Common First)</option>
                          <option value="rarity-desc">Rarity (Legendary First)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getJokerIds(saveData.unlocked).length > 0 ? (
                        sortJokers(getJokerIds(saveData.unlocked))
                          .map((id) => {
                            const joker = getJokerData(id)
                            if (!joker) return null
                            
                            return (
                              <Link
                                href={`/jokers?card=${id}`}
                                key={id} 
                                className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-colors flex flex-col gap-4"
                              >
                                <div className="flex gap-4">
                                  <div className="w-16 h-16 relative flex-shrink-0">
                                    <img 
                                      src={`${data.Joker.image_folder}${joker.appearance}`}
                                      alt={joker.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-white font-semibold mb-1">{joker.name}</h3>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      <div className={`text-xs px-2 py-1 rounded inline-block ${getCategoryColor(getJokerCategory(id))}`}>
                                        {getJokerCategory(id).charAt(0).toUpperCase() + getJokerCategory(id).slice(1)}
                                      </div>
                                    </div>
                                    <p className="text-sm text-white/60 mb-2">{joker.unlock_requirement}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-sm text-white/70 bg-black/20 p-2 rounded">
                                    <strong>Strategy:</strong> {getJokerStrategy(id)}
                                  </div>
                                  <div className={`text-xs px-2 py-1 rounded inline-block ${getRarityColor(joker.rarity as Rarity)}`}>
                                    {joker.rarity}
                                  </div>
                                </div>
                              </Link>
                            )
                          })
                      ) : (
                        <p className="text-white/60">No base game jokers unlocked yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Locked Jokers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortJokers(getLockedJokers(saveData.unlocked))
                        .map((id) => {
                          const joker = getJokerData(id)
                          if (!joker) return null

                          return (
                            <div key={id} className="bg-black/10 p-4 rounded-lg flex flex-col gap-4">
                              <div className="flex gap-4">
                                <div className="w-16 h-16 relative flex-shrink-0 opacity-50">
                                  <img 
                                    src={`${data.Joker.image_folder}${joker.appearance}`}
                                    alt={joker.name}
                                    className="w-full h-full object-contain grayscale"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-white/50 font-semibold mb-1">{joker.name}</h3>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    <div className={`text-xs px-2 py-1 rounded inline-block opacity-50 ${getCategoryColor(getJokerCategory(id))}`}>
                                      {getJokerCategory(id).charAt(0).toUpperCase() + getJokerCategory(id).slice(1)}
                                    </div>
                                  </div>
                                  <p className="text-sm text-white/40 mb-2">{joker.unlock_requirement}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm text-white/40 bg-black/10 p-2 rounded">
                                  <strong>Strategy:</strong> {getJokerStrategy(id)}
                                </div>
                                <div className={`text-xs px-2 py-1 rounded inline-block opacity-50 ${getRarityColor(joker.rarity as Rarity)}`}>
                                  {joker.rarity}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 