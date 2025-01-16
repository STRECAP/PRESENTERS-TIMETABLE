import { useState, useEffect } from 'react'
import { Presenter } from '../types'

export function usePresenterManagement() {
  const [presenters, setPresenters] = useState<Presenter[]>([])

  useEffect(() => {
    // Fetch presenters from API
    fetch('/api/presenters')
      .then(res => res.json())
      .then(data => setPresenters(data))
  }, [])

  const addPresenter = (name: string, level: number) => {
    const newPresenter = { id: Date.now().toString(), name, level }
    setPresenters(prevPresenters => [...prevPresenters, newPresenter])
    
    // Update API
    fetch('/api/presenters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPresenter)
    })
  }

  const deletePresenter = (id: string) => {
    setPresenters(prevPresenters => prevPresenters.filter(p => p.id !== id))
    
    // Update API
    fetch(`/api/presenters/${id}`, { method: 'DELETE' })
  }

  return { presenters, addPresenter, deletePresenter }
}

