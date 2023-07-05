'use client'

import { useState } from "react"

export default function Input() {
    const trophies = [
        'Civil Rights',
        'Economy',
        'Political Freedoms',
        'Population',
        'Wealth Gaps',
        'Death Rate',
        'Compassion',
        'Eco Friendliness',
        'Social Conservatism',
        'Nudity',
        'Automobile Manufacturing',
        'Cheese Exports',
        'Basket Weaving',
        'Informtion Technology',
        'Pizza Delivery',
        'Trout Fishing',
        'Arms Manufacturing',
        'Agriculture',
        'Beverage Sales',
        'Timber Woodchipping',
        'Mining',
        'Insurance',
        'Furniture Restoration',
        'Retail',
        'Book Publishing',
        'Gambling',
        'Manufacturing',
        'Government Size',
        'Welfare',
        'Public Healthcare',
        'Law Enforcement',
        'Business Subsidization',
        'Religiousness',
        'Income Equality',
        'Niceness',
        'Rudeness',
        'Intelligence',
        'Ignorance',
        'Political Apathy',
        'Health',
        'Cheerfulness',
        'Weather',
        'Compliance',
        'Safety',
        'Lifespan',
        'Ideological Radicality',
        'Defense Forces',
        'Pacifism',
        'Economic Freedom',
        'Taxation',
        'Freedom From Taxation',
        'Corruption',
        'Integrity',
        'Authoritarianism',
        'Youth Rebelliousness',
        'Culture',
        'Employment',
        'Public Transport',
        'Tourism',
        'Weaponization',
        'Recreational Drug Use',
        'Obesity',
        'Secularism',
        'Environmental Beauty',
        'Charmlessness',
        'Influence',
        'World Assembly Endorsements',
        'Averageness',
        'Human Development Index',
        'Primitiveness',
        'Scientific Advancement',
        'Inclusiveness',
        'Average Income',
        'Average Income Of Poor',
        'Average Income Of Rich',
        'Public Education',
        'Economic Output',
        'Crime',
        'Foreign Aid',
        'Black Market',
        'Residency',
        'Average Disposable Income',
        'International Artwork',
        'Food Quality',
        'Patriotism'
      ]

      const [input, setInput] = useState("");

      return (
        <div>
          <input
            className="p-2 text-black"
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            type="text"
            id="trophies"
            value={input}
            list="suggestions"
          />
          <datalist id="suggestions">
            {trophies.map((trophy, index) => (
              <option key={index} value={trophy} />
            ))}
          </datalist>
        </div>
      );
    }