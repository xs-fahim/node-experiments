import { Radio } from 'antd';
import { GenieMapProps } from '../map-props';


const SidebarNav = ({ sidebar, navigation = 'title', setSidebar, getInputs }) => {

    let navs = {
        title: { title: "Title", screen: "TitleScreen", selected: !!getInputs['generatedTitles'] },
        intro: { title: "Intro", screen: "IntroScreen", selected: !!getInputs['generatedIntros'] },
        outline: { title: "Outline", screen: "OutlineScreen", selected: !!(getInputs['selectedOutlines'] || getInputs['generatedOutlines']) }
    }

    const handleChange = (e) => {
        let target = e.target,
            value = target.value,
            screen = target.screen,
            selected = navs[value].selected;

        if (!selected) {
            return false;
        }

        setSidebar({
            component: screen
        })

        screen !== 'OutlineScreen' && setSidebar({
            generatedOutlines: {
                ...sidebar.generatedOutlines,
                open: false
            }
        });
    }

    return (
        <div className="genie-nav-container">
            <Radio.Group onChange={handleChange} value={navigation}>
                {Object.keys(navs).map(key => {
                    let nav = navs[key]
                    return <Radio.Button className={nav.selected ? 'selected' : ''} value={key} screen={nav.screen}>{nav.title}</Radio.Button>
                })}
            </Radio.Group>
        </div>
    )
}
export default GenieMapProps(SidebarNav, ['sidebar', 'setSidebar', 'getInputs']);
