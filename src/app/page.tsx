// src/app/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { WeatherCard } from '@/components/weather/weather-card'
import { CryptoPriceCard } from '@/components/crypto/crypto-price-card'
import { PortfolioCard } from '@/components/coinbase/portfolio-card'
import { ThemeToggle } from '@/components/theme-toggle'

interface Portfolio {
  portfolio_id: string;
  name: string;
  entity_id: string;
}

export default function Home() {
  const [weatherData, setWeatherData] = useState(null)
  const [cryptoData, setCryptoData] = useState({ btc: null, eth: null })
  const [portfolioData, setPortfolioData] = useState<Portfolio[]>([])
  
  const [isLoadingWeather, setIsLoadingWeather] = useState(true)
  const [isLoadingCrypto, setIsLoadingCrypto] = useState(true)
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true)
  
  const [weatherError, setWeatherError] = useState('')
  const [cryptoError, setCryptoError] = useState('')
  const [portfolioError, setPortfolioError] = useState('')

  const formatTimeForZone = (date: Date, timeZone: string) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone
    })
  }

  const formatDate = (date: Date, timeZone: string) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: timeZone
    })
  }

  const fetchWeather = useCallback(async () => {
    try {
      setIsLoadingWeather(true)
      const latitude = 24.4539
      const longitude = 54.3773
      
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
      if (!response.ok) throw new Error('Failed to fetch weather')
      
      const data = await response.json()
      const now = new Date()
      
      setWeatherData({
        location: "Abu Dhabi",
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        date: formatDate(now, 'Asia/Dubai'),
        timestamp: formatTimeForZone(now, 'Asia/Dubai'),
        estTime: formatTimeForZone(now, 'America/New_York')
      })
      setWeatherError('')
    } catch (err: any) {
      setWeatherError(err.message)
    } finally {
      setIsLoadingWeather(false)
    }
  }, [])

  const fetchCryptoPrices = useCallback(async () => {
    try {
      setIsLoadingCrypto(true)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true'
      )
      if (!response.ok) throw new Error('Failed to fetch price data')
      
      const data = await response.json()
      
      setCryptoData({
        btc: {
          symbol: 'BTC',
          current_price: data.bitcoin.usd,
          price_change_percentage_24h: data.bitcoin.usd_24h_change,
          last_updated: new Date(data.bitcoin.last_updated_at * 1000).toISOString()
        },
        eth: {
          symbol: 'ETH',
          current_price: data.ethereum.usd,
          price_change_percentage_24h: data.ethereum.usd_24h_change,
          last_updated: new Date(data.ethereum.last_updated_at * 1000).toISOString()
        }
      })
      setCryptoError('')
    } catch (err: any) {
      setCryptoError(err.message)
    } finally {
      setIsLoadingCrypto(false)
    }
  }, [])

  const fetchPortfolios = useCallback(async () => {
    try {
      setIsLoadingPortfolios(true)
      const response = await fetch('/api/coinbase/portfolios')
      if (!response.ok) throw new Error('Failed to fetch portfolio data')
      
      const data = await response.json()
      setPortfolioData(data.portfolios)
      setPortfolioError('')
    } catch (err: any) {
      setPortfolioError(err.message)
    } finally {
      setIsLoadingPortfolios(false)
    }
  }, [])

  useEffect(() => {
    // Initial fetches
    fetchWeather()
    fetchCryptoPrices()
    fetchPortfolios()
    
    // Set up intervals for auto-refresh
    const weatherInterval = setInterval(fetchWeather, 60000) // Every minute
    const cryptoInterval = setInterval(fetchCryptoPrices, 30000) // Every 30 seconds
    const portfolioInterval = setInterval(fetchPortfolios, 60000) // Every minute
    
    // Cleanup intervals on unmount
    return () => {
      clearInterval(weatherInterval)
      clearInterval(cryptoInterval)
      clearInterval(portfolioInterval)
    }
  }, [fetchWeather, fetchCryptoPrices, fetchPortfolios])

  return (
    <main className="min-h-screen p-4 md:p-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeatherCard
            data={weatherData}
            isLoading={isLoadingWeather}
            error={weatherError}
            onRefresh={fetchWeather}
          />
          <CryptoPriceCard
            data={cryptoData}
            isLoading={isLoadingCrypto}
            error={cryptoError}
            onRefresh={fetchCryptoPrices}
          />
          <PortfolioCard
            data={portfolioData}
            isLoading={isLoadingPortfolios}
            error={portfolioError}
            onRefresh={fetchPortfolios}
          />
        </div>
      </div>
    </main>
  )
}