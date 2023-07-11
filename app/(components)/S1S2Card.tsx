import { Card } from "../(helpers)/models"
import { banners } from "../(helpers)/specialBadges"
import { Badges } from "./Badges"
import { S2S3Description } from "./S2S3Description"

export function S1S2Card({ card }: { card: Card }) {
    return (
        <a href={`https://www.nationstates.net/page=deck/card=${card.id}/season=${card.season}`} target="_blank" rel="noopener noreferrer">
            <div className={`deckcard-container ${card.inCollection !== undefined ? card.inCollection ? 'border-blue-400 border-1 border-solid' : 'border-red-600 border-1 border-solid' : ""}`}>
                <div className={`deckcard deckcard-season-${card.season}`} data-cardid={card.id} data-season={card.season}>
                    <figure className={`front deckcard-category-${card.cardcategory}`} >
                        <div className="deckcard-flag"
                            style={{ backgroundImage: `url(https://www.nationstates.net/images/cards/s${card.season}/${card.flag})` }}>
                        </div>
                        <div className="deckcard-category"></div>
                        <div className="deckcard-title"><p className="nlink nameblock"><span
                            className="nnameblock"><span className="ntype">The {card.type} of</span> <span className="nname"> {card.name}</span></span></p></div>
                        <div className="deckcard-lower">
                            <div className="deckcard-govt">{card.category}</div>
                            <div className="deckcard-slogan">“{card.motto}”</div>
                            <div className="deckcard-badges">
                                {Object.keys(card.badges).map(badge => {
                                    if (banners[badge]) {
                                        let badge_img = banners[badge]
                                        return (
                                            <div key={badge} className="badge">
                                                <div className={badge_img}><i className="icon-flash"></i>{badge}</div>
                                            </div>
                                        )
                                    }
                                }
                                )}
                                <Badges cardBadges={card.badges as {[key: string]: string}} cardTrophies={Object.keys(card.trophies)} />
                            </div>
                            <div className="deckcard-desc">
                                {card.season === 1 ? `${card.description}` : <S2S3Description description={card.description} />}
                            </div>
                        </div>
                        <div className="deckcard-stripe">
                            <div className="deckcard-season">SEASON {card.season === 1 ? "ONE" : "TWO"}</div>
                            <div className="deckcard-region"><p className="rlink">{card.region}</p>
                            </div>
                        </div>
                    </figure>
                </div>
            </div>
        </a>
    )
}