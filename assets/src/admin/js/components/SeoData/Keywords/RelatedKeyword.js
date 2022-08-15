import { Typography } from "antd"
import { GenieRequestApi } from "../../../api-request";
import { GenieMapProps } from "../../../map-props";
import { GenieHelpers } from "../../../utils/helpers";
import KeywordDoctor from "../../../utils/keywordDoctor";
import processResponse from "../../../utils/processResponse";
import GenieCard from '../../Card';
import Loading from "../../Loading";
import Skeletons from "../../Skeletons/CardSkeleton";
const { useEffect } = wp.element;

const RelatedKeyword = GenieMapProps(({ getInputs, setInput, sidebar, setSidebar }) => {
    const data = getInputs['relatedKeywords'] || [];

    const keyword = (getInputs['keyword'] || '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '');

    let inputKeyword = keyword;
    useEffect(async () => {

        if (sidebar.analyzingRelatedKeyword) {

            const keywordDoctor = new KeywordDoctor(keyword);
            const keywords = await keywordDoctor.getLongTailKeywords();
            /** check if generated related keywords is empty */
            if (!keywords || keywords.length === 0) {
                setSidebar({
                    analyzingRelatedKeyword: false,
                    analyzingSearchVolume: false
                })
                return
            }
            setInput('relatedKeywords', keywords)

            setSidebar({
                analyzingRelatedKeyword: false
            })

            /** get search volume data with generated related keywords */
            getSearchVol(keywords)
        }
    }, [sidebar.analyzingRelatedKeyword])  /** triggers from title screen */

    const getSearchVol = (keywordList) => {
        if (sidebar.analyzingSearchVolume) {
            let body = {
                keywords: keywordList,
                context: getInputs['inputContext'],
                location: getInputs['selectedCountry']
            }
            /** assign current input keyword of title screen to current input value */
            inputKeyword = keyword;
            GenieRequestApi.keywordsData((res) => {
                processResponse(res, () => {
                    /** find search volume for main keyword */
                    let responseData = res.data.find(item => item.keyword === inputKeyword)
                    if (responseData) {
                        let searchVol = {
                            ...responseData,
                            keyword: (getInputs['keyword'] || ''),
                            country: (getInputs['selectedCountry'] || 'usa')
                        };
                        setInput('searchVolume', searchVol)
                        setInput('relatedKeywords', res.data)

                        /** store data in db */
                        GenieHelpers.callStoreApi('keywordData', {
                            searchVolume: searchVol,
                            relatedKeywords: res.data
                        });
                    }
                })
                setSidebar({
                    analyzingSearchVolume: false
                })
            }, body);
        }
    }

    return (
        <div className="getgenie-seo-result-related-keyword">
            <Typography.Title level={5} className="getgenie-title">Related Keyword</Typography.Title>

            {sidebar.analyzingRelatedKeyword ?
                <Skeletons count={1} />
                :
                <>
                    <span className="getgenie-related-keywords">{data.length}</span>
                    {data.length === 0 ?
                        <Typography.Title level={5} className="getgenie-not-found-title">No related keyword found</Typography.Title>
                        :
                        <GenieCard list={data} column={1}>{
                            (item) => (
                                <div className="getgenie-data-container">
                                    <h5 className="getgenie-data-title">
                                        {typeof item === 'string' ?
                                            item
                                            :
                                            item?.keyword
                                        }
                                    </h5>
                                    {
                                        sidebar.analyzingSearchVolume ?
                                            <Loading fontSize={20} />
                                            :
                                            <div className="getgenie-data-column">
                                                <Typography.Title className="getgenie-data-value">
                                                    CPC: {item?.searchVolume?.cpc?.currency} {item?.searchVolume?.cpc?.value}
                                                </Typography.Title>

                                                <Typography.Title className="getgenie-data-value">
                                                    Search: {item?.searchVolume?.total}
                                                </Typography.Title>
                                            </div>
                                    }
                                </div>
                            )
                        }</GenieCard>

                    }
                </>
            }

        </div>
    )
}, ['getInputs', 'sidebar', 'setInput', 'setSidebar']);

export { RelatedKeyword }