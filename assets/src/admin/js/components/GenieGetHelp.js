const { useContext } = wp.element;
import GenieHeader from './GenieAiMenuHeader';
// import { getgenieWrapper, SectionHeader } from '../components/getgenieComponents';

export default function GenieGetHelp() {

    const imageUrl = `${window.getGenie.config.assetsUrl}/dist/admin/images`;
    const data = [
        {
            label: 'Support Center',
            desc: 'Our experienced support team is ready to resolve your issues any time.',
            image: `${imageUrl}/support.png`
        },
        {
            label: 'Join The Community',
            desc: 'Follow us and stay connected for all the latest news and updates of GetGenie AI.',
            image: `${imageUrl}/community.png`
        },
        {
            label: 'Video Tutorials',
            desc: 'Learn the step by step process for developing your site easily from video tutorials.',
            image: `${imageUrl}/videos.png`
        },
        {
            label: 'Request A Feature',
            desc: 'Have any special feature in mind? Let us know through the feature request.',
            image: `${imageUrl}/request.png`
        },
        {
            label: 'Documentation',
            desc: 'Detailed documentation to help you understand the functionality of each feature.',
            image: `${imageUrl}/documentation.png`
        },
        {
            label: 'Public Roadmap',
            desc: 'Check our upcoming new features, detailed development stories and tasks',
            image: `${imageUrl}/roadmaps.png`
        }
    ];


    const products = [
        {
            label: 'ElementsKit',
            desc: 'All-in-One drag and drop Addons for Elementor',
            image: `${imageUrl}/elementskit.svg`,
            url: 'https://wpmet.com/plugin/elementskit/',
        },
        {
            label: 'MetForm',
            desc: 'Most flexible drag-and-drop form builder',
            image: `${imageUrl}/metform-logo.svg`,
            url: 'https://wpmet.com/plugin/metform/',
        },
        {
            label: 'ShopEngine',
            desc: 'All-in-one WooCommerce builder addon for Elementor',
            image: `${imageUrl}/shopengine.svg`,
            url: 'https://wpmet.com/plugin/shopengine/',
        },
        {
            label: 'WP Social',
            desc: 'Integrate all your social media to your website',
            image: `${imageUrl}/wp-social-logo.svg`,
            url: 'https://wpmet.com/plugin/wp-social/',
        },
        {
            label: 'Ultimate Review',
            desc: 'Integrate various styled review system in your website',
            image: `${imageUrl}/untimate-review.svg`,
            url: 'https://products.wpmet.com/review/?ref=wpmet',
        },
        {
            label: "Fundraising & Donation Platform",
            desc: 'Enable donation system in your website',
            image: `${imageUrl}/fundraising.svg`,
            url: 'https://products.wpmet.com/crowdfunding/?ref=wpmet',
        }
    ]


    return (
        <>
        <GenieHeader headerRightVisible={false}/>
            <div className="getgenie-get-help-page">
            
                <div className="getgenie-helpful-links">
                    {data.map( item => 
                        <a key={item.label} className="getgenie-help-card" href={ item.url } target="_blank">
                            <img src={item.image} alt={item.label} />
                            <label>{ item.label }</label>
                            <span>{ item.desc }</span>
                        </a>
                    )}
                </div>

                <div className="getgenie-products">
                    <div className="getgenie-products__header">
                        <h1>Take your website to the next level</h1>
                        <p>We have some plugins you can install to get most from Wordpress.<br/> These are absolute FREE to use.</p>
                    </div>

                    <div className="getgenie-products__content">
                        {products.map( item =>
                            <a key={item.label} className="getgenie-help-card" href={ item.url } target="_blank">
                                <label><img src={item.image} alt={item.label} /> { item.label }</label>
                                <span>{ item.desc }</span>
                            </a>
                        )}
                    </div>

                </div>

            </div>
        </>
    )
}