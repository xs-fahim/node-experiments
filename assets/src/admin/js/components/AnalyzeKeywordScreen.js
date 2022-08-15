const { useEffect, useState } = wp.element
import { GenieMapProps } from "../map-props";
import { SeoData } from "./SeoData";


const AnalyzeKeywordScreen = GenieMapProps(({ visible }) => {
    return (
        <div className={`getgenie-analyzeKeywordScreen ${visible ? '' : 'hide'}`}>
            <div className="getgenie-empty-tag">

            </div>
            <SeoData />

        </div>
    )
}, ['setSidebar', 'sidebar']);

export { AnalyzeKeywordScreen }