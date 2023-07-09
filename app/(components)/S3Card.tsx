import { Card } from "../(helpers)/models";
import { banners } from "../(helpers)/specialBadges";
import { Badges } from "./Badges";
import { S2S3Description } from "./S2S3Description";

export function S3Card({ card }: { card: Card }) {
    return (
        <a key={card.ID} href={`https://www.nationstates.net/page=deck/card=${card.ID}/season=${card.SEASON}`} target="_blank" rel="noopener noreferrer">
            <div className={`deckcard-container ${card.inCollection !== undefined ? card.inCollection ? 'border-blue-400 border-1 border-solid' : 'border-red-600 border-1 border-solid' : ""}`}>
                <div className="deckcard deckcard-season-3" data-cardid={card.ID} data-season="3">
                    <figure className={`front deckcard-category-${card.CARDCATEGORY}`}>
                        <div className="s3-content">
                            <div className="s3-upper">
                                <div className="s3-flagbox">
                                    <div className="s3-flag"><div className="s3-flag-image" style={{ backgroundImage: `url(https://www.nationstates.net/images/cards/s3/${card.FLAG})` }}></div></div>
                                </div>
                                <div className="s3-topline">
                                    <div className="s3-topbox">
                                        <div className="s3-slogan">
                                            {card.MOTTO}
                                        </div>
                                    </div>
                                </div>
                                <div className="deckcard-name">
                                    <p className="nlink nameblock"><span className="nnameblock"><span className="ntype">
                                        The {card.TYPE} of</span> <span className="nname">{card.NAME}</span></span></p>
                                </div>
                            </div>
                            <div className="s3-mid deckcard-badges">
                                <div className="role-badges">
                                    {Object.keys(card.BADGES).map(badge => {
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
                                </div>
                                <div className="trophies">
                                    <Badges cardBadges={card.BADGES} cardTrophies={Object.keys(card.TROPHIES)} />
                                </div>
                            </div>
                            <div className="s3-lower">
                                <div className="deckcard-lower-collection deckcard-govt-collection">
                                    <S2S3Description description={card.DESCRIPTION} />
                                </div>
                                <div className="deckcard-lower-collection">
                                    <div className="deckcard-category"></div>
                                    <div className="deckcard-govt">
                                        {card.CATEGORY}
                                    </div>
                                </div>
                                <div className="deckcard-stripe">
                                    <div className="deckcard-season">SEASON THREE</div>
                                    <div className="deckcard-region"><p className="rlink">{card.REGION}</p></div>
                                </div>
                            </div>
                        </div>
                    </figure>
                </div>
            </div>
        </a>
    )
}