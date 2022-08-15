import { Button, Divider } from "antd";
import { GenieMapProps } from "../../map-props";
const { useEffect, useState } = wp.element
import ScoreDetails from "./ScoreDetails";
import KeywordList from "./KeywordList";
import Feedback from "./Feedback";
import ScoreMeter from "./ScoreMeter";

const StatisticsScreen = GenieMapProps(({ setSidebar, sidebar }) => {

    const { totalContentStats } = sidebar.analyzedContent;
    const [showAnalysis, setShowAnalysis] = useState(false);
    const {imageUrl} = sidebar
    
    useEffect(() => {
        setSidebar({
            analyzeKeyword: {
                open: false,
            },
            generatedOutlines: {
                ...sidebar.generatedOutlines,
                open: false
            },
        })
    }, [])

    const closeSidebar = () => {
        setSidebar({
            open: false
        })
    }
    const handleShowAnalysis = () => {
        setShowAnalysis(!showAnalysis)
    }

    return (
        <div className="getgenie-statistics">
            <div className='getgenie-statistics-header'>
                <h5>Content Score</h5>
                <div className="close-btn">
                    <span onClick={closeSidebar}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1.00714L8.99286 0L5 3.99286L1.00714 0L0 1.00714L3.99286 5L0 8.99286L1.00714 10L5 6.00714L8.99286 10L10 8.99286L6.00714 5L10 1.00714Z" fill="#323232" />
                        </svg>
                    </span>
                </div>
            </div>
            <div className="getgenie-statistics-container">
                <div className="getgenie-statistics-container-data">
                    <div className="getgenie-statistics-score">

                        <ScoreMeter imageUrl={imageUrl} totalContentStats={totalContentStats} />

                        <div className="getgenie-statistics-score-heading">
                            <Button onClick={handleShowAnalysis} type="link">{showAnalysis ? 'Hide Analysis' : 'Show Analysis'}</Button>
                        </div>

                        {!showAnalysis && <>
                            <Divider />
                            <ScoreDetails />
                            <KeywordList />
                        </>}
                    </div >

                    {showAnalysis && <Feedback />}
                </div >
            </div >

        </div >
    )
}, ['setSidebar', 'sidebar']);

export { StatisticsScreen }
