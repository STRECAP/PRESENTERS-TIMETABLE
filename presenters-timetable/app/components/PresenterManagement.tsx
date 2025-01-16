'use client'

import { useState, useEffect } from 'react'
import { PRESENTERS } from '../data/presenters'
import { Presenter } from '../types'
import { playSound } from '../utils/sound'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'
const { jsx, jsxs } = React

interface PresenterManagementProps {
  soundEnabled: boolean;
  onPresentersChange: (updatedPresenters: Presenter[]) => void;
}

export default function PresenterManagement({ soundEnabled, onPresentersChange }: PresenterManagementProps) {
  const [presenters, setPresenters] = useState<Presenter[]>(() => {
    const savedPresenters = localStorage.getItem('presenters')
    return savedPresenters ? JSON.parse(savedPresenters) : PRESENTERS
  })
  const [newPresenterName, setNewPresenterName] = useState('')
  const [newPresenterPhone, setNewPresenterPhone] = useState('')
  const [newPresenterLevel, setNewPresenterLevel] = useState<1 | 2>(1)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState('level1')

  useEffect(() => {
    localStorage.setItem('presenters', JSON.stringify(presenters))
    onPresentersChange(presenters)
  }, [presenters, onPresentersChange])

  const level1Count = presenters.filter(p => p.level === 1).length
  const level2Count = presenters.filter(p => p.level === 2).length

  const handleAddPresenter = () => {
    if (newPresenterName && newPresenterPhone) {
      const newPresenter: Presenter = {
        name: newPresenterName,
        phone: newPresenterPhone,
        level: newPresenterLevel
      }
      setPresenters(prevPresenters => [...prevPresenters, newPresenter])
      setNewPresenterName('')
      setNewPresenterPhone('')
      setShowConfetti(true)
      if (soundEnabled) {
        playSound('success')
      }
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  const handleDeletePresenter = (phoneToDelete: string) => {
    setPresenters(prevPresenters => prevPresenters.filter(p => p.phone !== phoneToDelete))
  }

  const renderPresenterList = (level: 1 | 2) => (
    <AnimatePresence>
      <ul className="max-h-96 overflow-y-auto">
        {presenters.filter(p => p.level === level).map(presenter => (
          <motion.li
            key={presenter.phone}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded-lg"
          >
            <span>{presenter.name} - {presenter.phone}</span>
            <button
              onClick={() => handleDeletePresenter(presenter.phone)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
            >
              Delete
            </button>
          </motion.li>
        ))}
      </ul>
    </AnimatePresence>
  )

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Presenters</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newPresenterName}
          onChange={(e) => setNewPresenterName(e.target.value)}
          placeholder="New Presenter Name"
          className="flex-grow p-2 border rounded-l-full"
        />
        <input
          type="tel"
          value={newPresenterPhone}
          onChange={(e) => setNewPresenterPhone(e.target.value)}
          placeholder="Phone Number"
          className="flex-grow p-2 border-t border-b"
        />
        <select
          value={newPresenterLevel}
          onChange={(e) => setNewPresenterLevel(Number(e.target.value) as 1 | 2)}
          className="p-2 border-t border-b"
        >
          <option value={1}>Level 1</option>
          <option value={2}>Level 2</option>
        </select>
        <button
          onClick={handleAddPresenter}
          className="bg-blue-500 text-white p-2 rounded-r-full hover:bg-blue-600 transition-colors duration-200"
        >
          Add
        </button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="level1" className="rounded-full transition-all duration-200">
            Level 1 Presenters ({level1Count})
          </TabsTrigger>
          <TabsTrigger value="level2" className="rounded-full transition-all duration-200">
            Level 2 Presenters ({level2Count})
          </TabsTrigger>
        </TabsList>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="level1">
              {renderPresenterList(1)}
            </TabsContent>
            <TabsContent value="level2">
              {renderPresenterList(2)}
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000 }}>
          {/* Confetti effect */}
        </div>
      )}
    </div>
  )
}

