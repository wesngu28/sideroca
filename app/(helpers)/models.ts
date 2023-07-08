export interface Card {
    ID: number
    SEASON: number
    NAME: string
    TYPE: string
    MOTTO: string
    CATEGORY: string
    REGION: string
    FLAG: string
    CARDCATEGORY: string
    DESCRIPTION: string
    BADGES: {[key: string]: string}
    TROPHIES: {[key: string]: string}
  }
  