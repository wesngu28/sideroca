import Image from "next/image"
import { badges } from "../(helpers)/specialBadges"

interface Props { cardBadges: string[], cardTrophies: string[] }

export function Badges({ cardBadges, cardTrophies }: Props) {
    return (
        <>
            <div className="specialbadges">
                {cardBadges.map(badge => {
                    if (badges[badge]) {
                        let badge_img = badges[badge]
                        return (
                            <Image alt={badge} key={badge} src={`https://www.nationstates.net/images/trophies/${badge_img}.png`}
                                className="trophy inline" title={`${badge}`} />
                        )
                    }
                }
                )}
            </div>
            <div id="trophycabinet">
                {cardTrophies.map((trophy, i) =>
                    <Image key={trophy} src={`https://www.nationstates.net/images/trophies/${trophy.toLowerCase()}.png`} className="trophy inline"
                        alt={`${trophy.toLowerCase} ranked ${cardTrophies[i]}`} />
                )}
            </div>
        </>
    )
}