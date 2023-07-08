import { Card } from "../(helpers)/models";
import { Badges } from "./Badges";
import { S2S3Description } from "./S2S3Description";

export function S3Card({ card }: { card: Card }) {
    return (
        <div className="deckcard-container">
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
                                <a href={`nation=${card.NAME}`} className="nlink nameblock"><span className="nnameblock"><span className="ntype">
                                    The {card.TYPE} of</span> <span className="nname">{card.NAME}</span></span></a>
                            </div>
                        </div>
                        <div className="s3-mid deckcard-badges">
                            <div className="trophies">
                                <Badges cardBadges={Object.keys(card.BADGES)} cardTrophies={Object.keys(card.TROPHIES)} />
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
                                <div className="deckcard-region"><a href="region=lazarus" className="rlink">{card.REGION}</a></div>
                            </div>
                        </div>
                    </div>
                </figure>
            </div>
        </div>
    )
}