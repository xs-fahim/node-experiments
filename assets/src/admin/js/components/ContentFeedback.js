import { Tooltip } from "antd";
import { GenieRequestApi } from "../api-request";
import { GenieMapProps } from "../map-props";


const ContentFeedback = GenieMapProps(({ content, listName, getInputs, setInput, creativityLevel, input, sidebar }) => {
    const handleFeedback = (type, text) => {

        let newList, currentList = getInputs[listName];

        if (type === 'like') {
            /** if already liked, return false */
            if (currentList.find(item => item.title === text && item.like)) {
                return;
            }
            /** updated current list properties */
            newList = currentList.map(item => {
                return item.title === text ? { ...item, like: true, dislike: false } : item
            })
        }
        else {
            /** if already disliked, return false */
            if (currentList.find(item => item.title === text && item.dislike)) {
                return;
            }
            /** updated current list properties */
            newList = currentList.map(item => {
                return item.title === text ? { ...item, dislike: true, like: false } : item
            })
        }
        setInput(listName, newList)

        let data = {
            input: input,
            output: text,
            creativity_level: creativityLevel,
            feedback_type: type,
            template_name: sidebar.currentTemplate
        }
        /** call api to store feedback */
        GenieRequestApi.contentFeedback((res) => {
            /** response status is not required */
        }, data);

    }
    return (
        <Tooltip placement="bottomRight" title="Is the output good?">
            <div className='getgenie-giving-feedback' onClick={(e) => e.stopPropagation()}>
                <span onClick={() => handleFeedback('like', content.title)}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill={`${content.like ? '#0FA958' : 'none'}`} d="M7.81833 4.16667H5.83333V2.08333C5.83333 1.86232 5.74554 1.65036 5.58926 1.49408C5.43298 1.3378 5.22101 1.25 5 1.25H4.96042C4.75208 1.25 4.58333 1.41875 4.58333 1.62708C4.58333 1.92458 4.49542 2.21542 4.33 2.46292L2.91667 4.58333V8.33333L4.48375 8.725C4.55 8.74167 4.61792 8.75 4.68583 8.75H6.35958C6.51444 8.75007 6.66626 8.70699 6.798 8.62559C6.92974 8.54419 7.03619 8.42769 7.10542 8.28917L8.56375 5.3725C8.62724 5.24545 8.6572 5.10428 8.65079 4.9624C8.64438 4.82052 8.60182 4.68263 8.52714 4.56182C8.45246 4.44101 8.34814 4.34129 8.22408 4.27213C8.10003 4.20298 7.96036 4.16667 7.81833 4.16667Z" />
                        <path d="M5.83333 4.16667H7.81833C7.96036 4.16667 8.10003 4.20298 8.22408 4.27213C8.34814 4.34129 8.45246 4.44101 8.52714 4.56182C8.60182 4.68263 8.64438 4.82052 8.65079 4.9624C8.6572 5.10428 8.62724 5.24545 8.56375 5.3725L7.10542 8.28917C7.03619 8.42769 6.92974 8.54419 6.798 8.62559C6.66626 8.70699 6.51444 8.75007 6.35958 8.75H4.68583C4.61792 8.75 4.55 8.74167 4.48375 8.725L2.91667 8.33333M5.83333 4.16667V2.08333C5.83333 1.86232 5.74554 1.65036 5.58926 1.49408C5.43298 1.3378 5.22101 1.25 5 1.25H4.96042C4.75208 1.25 4.58333 1.41875 4.58333 1.62708C4.58333 1.92458 4.49542 2.21542 4.33 2.46292L2.91667 4.58333V8.33333M5.83333 4.16667H5M2.91667 8.33333H2.08333C1.86232 8.33333 1.65036 8.24554 1.49408 8.08926C1.3378 7.93298 1.25 7.72101 1.25 7.5V5C1.25 4.77899 1.3378 4.56702 1.49408 4.41074C1.65036 4.25446 1.86232 4.16667 2.08333 4.16667H3.125" stroke="#0FA958" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <span onClick={() => handleFeedback('dislike', content.title)}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill={`${content.dislike ? '#EA4646' : 'none'}`} d="M2.18166 5.83333H4.16625V7.91667C4.16625 8.13768 4.25404 8.34964 4.41032 8.50592C4.5666 8.6622 4.77857 8.75 4.99958 8.75H5.03958C5.24791 8.75 5.41666 8.58125 5.41666 8.37333C5.41666 8.07542 5.50458 7.78458 5.67 7.53667L7.08333 5.41667L7.08291 1.66667L5.51625 1.275C5.45016 1.25844 5.38229 1.25004 5.31416 1.25H3.64C3.48521 1.25001 3.33348 1.29312 3.20182 1.37452C3.07016 1.45591 2.96377 1.57237 2.89458 1.71083L1.43625 4.6275C1.37276 4.75455 1.3428 4.89572 1.34921 5.0376C1.35562 5.17948 1.39818 5.31737 1.47286 5.43818C1.54754 5.55899 1.65186 5.65871 1.77591 5.72787C1.89997 5.79702 2.03964 5.83333 2.18166 5.83333Z" />
                        <path d="M7.08291 1.66667L5.51625 1.275C5.45016 1.25844 5.38229 1.25004 5.31416 1.25H3.64C3.48521 1.25001 3.33348 1.29312 3.20182 1.37452C3.07016 1.45591 2.96377 1.57237 2.89458 1.71083L1.43625 4.6275C1.37276 4.75455 1.3428 4.89572 1.34921 5.0376C1.35562 5.17948 1.39818 5.31737 1.47286 5.43818C1.54754 5.55899 1.65186 5.65871 1.77591 5.72787C1.89997 5.79702 2.03964 5.83333 2.18166 5.83333H4.16666H5M7.08291 1.66667L7.08333 5.41667L5.67 7.53667C5.50458 7.78458 5.41666 8.07542 5.41666 8.37333C5.41666 8.58125 5.24791 8.75 5.03958 8.75H4.99958C4.77857 8.75 4.5666 8.6622 4.41032 8.50592C4.25404 8.34964 4.16625 8.13768 4.16625 7.91667V5.83333M7.08291 1.66667H7.91666C8.13768 1.66667 8.34964 1.75446 8.50592 1.91074C8.6622 2.06702 8.75 2.27899 8.75 2.5V5C8.75 5.22101 8.6622 5.43298 8.50592 5.58926C8.34964 5.74554 8.13768 5.83333 7.91666 5.83333H6.875" stroke="#EA4646" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
            </div>
        </Tooltip>
    )
}, ['setInput', 'getInputs', 'sidebar']);

export { ContentFeedback } 