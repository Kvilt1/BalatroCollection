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

export default function SaveAnalysisPage() {
  const [saveData, setSaveData] = useState<SaveFileData | null>(null)
  const [showRawData, setShowRawData] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 to-slate-950">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-white/50 hover:text-white">
            ← Back to Categories
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Base Game Jokers</h1>
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
                    <div className="flex items-center justify-between mb-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getJokerIds(saveData.unlocked).length > 0 ? (
                        getJokerIds(saveData.unlocked)
                          .sort((a, b) => formatJokerId(a).localeCompare(formatJokerId(b)))
                          .map((id) => (
                            <Link
                              href={`/jokers?card=${id}`}
                              key={id} 
                              className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-colors"
                            >
                              <span className="text-white">{formatJokerId(id)}</span>
                            </Link>
                          ))
                      ) : (
                        <p className="text-white/60">No base game jokers unlocked yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Locked Jokers
                      <span className="text-sm font-normal text-white/60 ml-2">
                        ({totalJokers - unlockedJokers} remaining)
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getLockedJokers(saveData.unlocked)
                        .sort((a, b) => formatJokerId(a).localeCompare(formatJokerId(b)))
                        .map((id) => (
                          <Link
                            href={`/jokers?card=${id}`}
                            key={id} 
                            className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-colors opacity-50"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-white/80">🔒</span>
                              <span className="text-white/80">{formatJokerId(id)}</span>
                            </div>
                          </Link>
                        ))}
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