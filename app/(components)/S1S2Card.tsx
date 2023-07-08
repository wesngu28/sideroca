import { Card } from "../(helpers)/models"
import { banners } from "../(helpers)/specialBadges"
import { Badges } from "./Badges"
import { S2S3Description } from "./S2S3Description"

export function S1S2Card({ card }: { card: Card }) {
    return (
        <div className="deckcard-container">
            <div className={`deckcard deckcard-season-${card.SEASON}`} data-cardid={card.ID} data-season={card.SEASON}>
                <figure className={`front deckcard-category-${card.CARDCATEGORY}`} >
                    <div className="deckcard-flag"
                        style={{ backgroundImage: `url(https://www.nationstates.net/images/cards/s${card.SEASON}/${card.FLAG})` }}>
                    </div>
                    <div className="deckcard-category">{card.CATEGORY}</div>
                    <div className="deckcard-title"><a href="nation=${name}" className="nlink nameblock"><span
                        className="nnameblock"><span className="ntype">The {card.TYPE} of</span> <span className="nname"> {card.NAME}</span></span></a></div>
                    <div className="deckcard-lower">
                        <div className="deckcard-govt">{card.CATEGORY}</div>
                        <div className="deckcard-slogan">“{card.MOTTO}”</div>
                        <div className="deckcard-badges">
                            {Object.keys(card.BADGES).map(badge => {
                                if (banners[badge]) {
                                    let badge_img = banners[badge]
                                    return (
                                        <div>
                                            <div className="badge">
                                                <div className={badge_img}><i className="icon-flash"></i>{badge}</div>
                                            </div>
                                        </div>
                                    )
                                }
                            }
                            )}
                            <Badges cardBadges={Object.keys(card.BADGES)} cardTrophies={Object.keys(card.TROPHIES)} />
                        </div>
                        <div className="deckcard-desc">
                            {card.SEASON === 1 ? `${card.DESCRIPTION}` : <S2S3Description description={card.DESCRIPTION} />}
                        </div>
                    </div>
                    <div className="deckcard-stripe">
                        <div className="deckcard-season">SEASON ONE</div>
                        <div className="deckcard-region"><a href="region=space_sector_rpra" className="rlink">{card.REGION}</a>
                        </div>
                    </div>
                </figure>
            </div>
        </div>
    )
}