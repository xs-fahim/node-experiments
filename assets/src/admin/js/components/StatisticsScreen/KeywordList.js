import { Typography, Card, Input, Tooltip } from "antd";
const { useState, useEffect } = wp.element
import { GenieMapProps } from "../../map-props";


const KeywordList = GenieMapProps(({ sidebar }) => {
  const { keywordStats } = sidebar.analyzedContent.allStats;
  const [seoKeywords, setSeoKeywords] = useState(keywordStats || [])

  useEffect(() => {
    setSeoKeywords(keywordStats || [])

  }, [sidebar.analyzedContent])

  const handleSearchKeyword = (e) => {
    let searchInput = e.target.value;
    let updatedSeoKeywords = keywordStats.filter(item => item.keyword.includes(searchInput))

    setSeoKeywords(updatedSeoKeywords)

  }
  return (
    <div className="getgenie-statistics-keyword-analysis">
      <h5 className='generateMsg'>
        SEO Keywords
        <span className="resultNumber">{seoKeywords.length}</span>
      </h5>
      <Input onChange={handleSearchKeyword} className="genie-input" placeholder="Search Keyword Here" />
      {seoKeywords.length === 0 ?
        ''
        :
        <div className="card-container">
          <h5>Used / Average - Highest</h5>
          {
            seoKeywords.map((item, index) => <Card className="getgenie-statistics-score-keyword-analysis-card">
              <Typography.Text className="title">{item?.keyword}</Typography.Text>

              <Typography.Text className="stat">{item?.used}</Typography.Text>
            </Card>
            )
          }
        </div>
      }
    </div>
  )
}, ['sidebar'])
export default KeywordList