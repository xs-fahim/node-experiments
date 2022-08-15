const { useState, useEffect } = wp.element;
import { Button, Divider, Form, Spin, Typography } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import GenieInput from './Input';
import GenieAiMenuHeader from './GenieAiMenuHeader';
import { GenieRequestApi } from "../api-request";
import GenieButton from "./Button";
import { GenieMapProps } from "../map-props";
import processResponse from "../utils/processResponse";
import { confirmModal } from "../utils/ConfirmModal";

const GenieAiLicense = GenieMapProps(({ getInputs, limitUsage, setLimitUsage }) => {
    const allURL = {
        wpmet: 'https://account.wpmet.com/',									/* Used in license page */
        shopengine: 'https://wpmet.com/plugin/shopengine/',						/* Used in license page to display shopEngine landing page*/
        support: 'https://wpmet.com/support-ticket-form/',						/* Used in license page */
        doc: 'https://wpmet.com/knowledgebase/shopengine/',  				/* Used in license page */
        fbGroup: 'https://go.wpmet.com/facebook-group',						/* Used in header */
        idea: 'https://wpmet.com/plugin/shopengine/roadmaps/#ideas',		/* Used in header for freature request and share idea */
        roadmap: 'https://wpmet.com/plugin/shopengine/roadmaps/',				/* Used in header  to show roadmap*/
        videos: 'https://www.youtube.com/playlist?list=PL3t2OjZ6gY8OHctiBYbNj_h0uL70QV8eF', /* Youtube video tutorial playlist*/
    }

    const [loading, setLoading] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);

    const [currentSite, setCurrentSite] = useState('Current site');
    const [siteData, setSiteData] = useState(limitUsage.sites);
    const [subscriptionData, setSubscriptionData] = useState(limitUsage.subscriptions);

    const [status, setStatus] = useState(window.getGenie.config.siteToken);
    const inActiveLicenseText = <p> Still can't find your license key? <a href={allURL.support} target="_blank"> Knock us here!  </a> </p>;
    const [statusText, setStatusText] = useState(inActiveLicenseText)
    useEffect(() => {
        if (status) {
            setStatusText("Your License Is Activated")
            getUsage()
        }
    }, [])


    const titleCase = (str) => {
        let initial = str.replace(/^[_]*(.)/, (_, char) => char.toUpperCase())
        let result = initial.replace(/[_]+(.)/g, (_, char) => ' ' + char.toUpperCase())
        return result
    }

    const prepareUsageData = (result) => {
        let values = Object.values(result);
        if (values.length === 0) {
            return
        }
        let limit = result?.limits || {};
        let usage = result?.usages || {};

        let data = Object.keys(limit).map(key => {
            let arr = []
            let limitValue = limit?.[key] || '~';
            let usageValue = usage?.[key] || 0;

            arr.push(`${titleCase(key)}: ${limitValue}`)
            arr.push(`${titleCase(key)}: ${usageValue}`)
            /** set 0 if subtraction result is negative */
            arr.push(`${titleCase(key)}: ${isNaN(limitValue) ? '~' : (Math.max(0, (limitValue - usageValue)) || 0)}`)
            return arr
        })
        return data || [];
    }

    const getUsage = () => {
        if (siteData.length > 0 && subscriptionData.length > 0) {
            return
        }
        setLoadingTable(true)
        GenieRequestApi.limitUsage((res) => {
            processResponse(res, () => {

                let subscriptionDataResponse = Object.values(res?.data?.subscriptionUsagesLimit || {}) || []
                subscriptionDataResponse = subscriptionDataResponse?.find(item => item?.type === 'subscription')

                let subscriptionResult = prepareUsageData(subscriptionDataResponse || {})
                let domainResult = prepareUsageData(Object.values(res?.data?.siteUsagesLimit || {})?.[0] || {})

                setCurrentSite(Object.keys(res?.data?.siteUsagesLimit || {})?.[0] || 'Current site');

                setSubscriptionData(subscriptionResult)
                setSiteData(domainResult)

                setLimitUsage({
                    sites: domainResult,
                    subscriptions: subscriptionResult
                })
            })
            setLoadingTable(false)
        });
    }

    const onSubmitKey = () => {
        let data = { license: getInputs['licenseKey'] };
        setLoading(true)
        GenieRequestApi.getLicenseToken((res) => {

            processResponse(res, () => {
                window.location.reload();
            })
            setLoading(false);
        }, data);
    }

    /*
        On removing license key  
    */
    const removeLicenseKeyProcessor = () => {
        setLoading(true)
        GenieRequestApi.removeLicenseToken((res) => {

            processResponse(res, () => {
                window.location.reload();
            })
            setLoading(false);
        });

    }
    /** open modal for confirmation */
    const onRemoveKey = () => {
        confirmModal('Are you sure to remove license from this site?',
            '',
            removeLicenseKeyProcessor)
    }

    return (
        <>
            <GenieAiMenuHeader />
            <div className="getgenie-info-wrapper">
                <div className={`getgenie-license-page ${status}`}>

                    {   /** Show heading and instruction when license is not activated */
                        !status && <>
                            <Typography.Title level={2}>License Settings</Typography.Title>
                            <Typography.Text strong level={2}>
                                You'll need a license to use both the free and pro version of GetGenie AI.
                                <Button style={{ boxShadow: 'none' }} ghost type="link" href="https://app.getgenie.ai/license/?product=free-trial" target="_blank">Claim your license here →</Button>
                            </Typography.Text>
                            <Divider />
                            <h3>If you have the license key, paste the code below and activate your subscription.</h3>
                            <p>Or, follow the steps below to activate the Genie AI plugin:</p>
                            <ul className="getgenie-license-page__steps">
                                {/* <li>Log in to your <a href="#">GetGenie account</a>.</li> */}
                                <li>Log in to your GetGenie account.</li>
                                {/* <li>Generate a license key from Product Licenses then <a href="#">Manage Licenses</a>.</li> */}
                                <li>Generate a license key from Product Licenses then Manage Licenses.</li>
                                <li>Copy the license key text and paste it inside the input box below.</li>
                            </ul>
                        </>
                    }

                    <Form
                        className="getgenie-license-form"
                        layout="vertical"
                        onFinish={onSubmitKey}
                    >
                        { /* Show license input box when it's not activated */
                            !status &&
                            <GenieInput name="licenseKey" required={true} maxLength={window.getGenie.config?.licenseKeyLength} errorMessage='Your key is empty!' label="Your License Key" placeholder="Please insert your license key here" />
                        }

                        <div className={`getgenie-license-page--status ${status ? 'valid' : 'invalid'}`}> {statusText} </div>

                        {
                            status &&
                            <Spin tip="Loading..." spinning={loadingTable}>
                                <Typography.Title level={4}>Subscription stats:</Typography.Title>
                                <table className="user-stats-table">
                                    <thead>
                                        <tr>
                                            <th>Limit</th>
                                            <th>Usage</th>
                                            <th>Usage Left</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loadingTable ?
                                                <>
                                                    <tr>
                                                        <td>Word Generate:</td>
                                                        <td>Word Generate:</td>
                                                        <td>Word Generate:</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Serp Analysis:</td>
                                                        <td>Serp Analysis:</td>
                                                        <td>Serp Analysis:</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Keyword Lookup:</td>
                                                        <td>Keyword Lookup:</td>
                                                        <td>Keyword Lookup:</td>
                                                    </tr>
                                                </>
                                                :
                                                subscriptionData?.map(item => <tr>
                                                    <td>{item[0]}</td>
                                                    <td>{item[1]}</td>
                                                    <td>{item[2]}</td>
                                                </tr>)
                                        }


                                    </tbody>
                                </table>
                            </Spin>
                        }

                        {
                            status &&
                            <Spin tip="Loading..." spinning={loadingTable}>
                                <Typography.Title level={4}>{currentSite} usage stats:</Typography.Title>
                                <table className="user-stats-table">
                                    <thead>
                                        <tr>
                                            <th>Limit</th>
                                            <th>Usage</th>
                                            <th>Usage Left</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loadingTable ?
                                                <>
                                                    <tr>
                                                        <td>Word Generate:</td>
                                                        <td>Word Generate:</td>
                                                        <td>Word Generate:</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Serp Analysis:</td>
                                                        <td>Serp Analysis:</td>
                                                        <td>Serp Analysis:</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Keyword Lookup:</td>
                                                        <td>Keyword Lookup:</td>
                                                        <td>Keyword Lookup:</td>
                                                    </tr>
                                                </>
                                                :
                                                siteData?.map(item => <tr>
                                                    <td>{item[0]}</td>
                                                    <td>{item[1]}</td>
                                                    <td>{item[2]}</td>
                                                </tr>)
                                        }


                                    </tbody>
                                </table>
                            </Spin>
                        }


                        { /* Show license button when it's not activated */
                            !status &&
                            <GenieButton className="getgenie-license-active" loading={loading}
                                icon={<CheckOutlined />} type="primary" htmlType="submit"
                                disabled={(getInputs['licenseKey'] || '').length != window.getGenie.config?.licenseKeyLength}
                                size="large"> ACTIVATE NOW</GenieButton>
                        }
                    </Form>

                    { /* Show remove button when it's activated */
                        status &&
                        <>
                            <div className="getgenie-item-flex">
                                <GenieButton loading={loading} onClick={onRemoveKey} type="danger" size="large"> Remove license from this domain </GenieButton>
                                <p> See documentation <a href="https://getgenie.ai/docs/getting-started/license-settings/" target="_blank"> here </a> </p>
                            </div>
                        </>
                    }
                </div>
            </div>

        </>
    )
}, ["getInputs", "limitUsage", "setLimitUsage"])

export default GenieAiLicense