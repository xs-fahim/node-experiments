import { Button, Card, Checkbox, Typography, } from 'antd'
import { GenieMapProps } from '../map-props';
import Skeletons from './Skeletons/CardSkeleton';
const GeneratedOutlines = GenieMapProps(({ setInput, getInputs, sidebar, visible, width }) => {

    const selectedOutlines = getInputs['selectedOutlines'] || [];
    const generatedOutlines = getInputs['generatedOutlines'] || [];
    const loading = sidebar.generatedOutlines.loading;

    const onChange = (text) => {
        let items = [...selectedOutlines];
        /** if content is available in selectedOutlines, remove it */
        if (items.indexOf(text) != -1) {
            items.splice(items.indexOf(text), 1)
        } else {
            items.push(text)
        }
        setInput('selectedOutlines', items);
    }

    /**
     * @function
     * @param {Array} arr current selected array of contents
     * @description checks if items of current array exist on selectedOutlines or not
     * @returns Boolean
     */
    const checkEveryElementExists = ((arr = []) => {
        return ([...arr].filter(r => selectedOutlines.includes(r)).length === arr.length)
    })

    /**
     * @function
     * @param {Array} arr current selected array of contents
     * @param {Boolean} isAllSelected if all contents of array exists in selectedOutlines
     * @description add/remove contents from array to selectedOutlines
     */
    const handleAllSelect = (arr, isAllSelected) => {

        let items = [...selectedOutlines];
        if (isAllSelected) {
            let filtered = []

            selectedOutlines.forEach((item, index) => {
                if (arr.indexOf(item) == -1) {
                    if (filtered.indexOf(item) === -1) {
                        filtered.push(item)
                    }
                }
            });

            items = filtered;
        } else {
            items = [...selectedOutlines, ...arr]
        }

        setInput('selectedOutlines', items)
    }



    return (
        visible && <div className="getgenie-generated-outlines">
            <div className="getgenie-empty-tag">

            </div>
            <h5 className="getgenie-generated-outlines-title">
                Generated Outlines
                <Typography.Text className='generateMsg outline'>
                    <span className="resultNumber">{generatedOutlines.length}</span>
                </Typography.Text>
            </h5>

            {loading ?
                <Skeletons count={5} />
                :
                generatedOutlines.length === 0 ?
                    <Typography.Title level={5} className="getgenie-not-found-title">Something Went Wrong! Please Try Again.</Typography.Title>
                    :
                    <div className="getgenie-generated-outlines-cards">
                        {
                            generatedOutlines.map((arr, index) => <>
                                <Card className="getgenie-generated-outlines-card">
                                    <Button className="getgenie-generated-outlines-card-select-btn" type="link" onClick={() => handleAllSelect(arr, checkEveryElementExists(arr))}>{checkEveryElementExists(arr) ? 'Unselect All' : 'Select All'}</Button>

                                    <div className="getgenie-checkbox">
                                        {
                                            arr.map((item, childIndex) => <>
                                                <div className={`getgenie-checkbox-container${selectedOutlines.indexOf(item) != -1 ? ' active' : ''}`}>
                                                    <Checkbox checked={selectedOutlines.indexOf(item) != -1} onChange={() => onChange(item)}>{item}</Checkbox>
                                                </div>
                                            </>)
                                        }
                                    </div>
                                </Card>
                            </>)
                        }
                    </div>
            }
        </div>


    )
}, ['setInput', 'getInputs', 'sidebar']);

export { GeneratedOutlines }