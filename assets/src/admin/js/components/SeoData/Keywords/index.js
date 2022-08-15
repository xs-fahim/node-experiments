import { KeywordAnalysis } from "./KeywordAnalysis.js"
import { OverviewChart } from "./OverviewChart.js"
import { RelatedKeyword } from "./RelatedKeyword.js"
import { GenieMapProps } from '../../../map-props';
import Skeletons from "../../Skeletons/CardSkeleton.js";

const Keywords = GenieMapProps(({ sidebar }) => {

    return (
        <>
            {sidebar.analyzingSearchVolume ?
                <Skeletons count={2} />
                :
                <>
                    <KeywordAnalysis />
                    <OverviewChart />
                </>
            }
            <RelatedKeyword />

        </>
    )
}, ['sidebar']);

export { Keywords }