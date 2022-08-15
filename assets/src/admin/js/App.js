import GenieSidebar from './components/Sidebar';
import WriteForMe from './components/WriteForMe';
import { HashRouter, Route, Switch } from 'react-router-dom';
import AutocompleteTemplates from './components/AutocompleteTemplates';
import GenieGetHelp from './components/GenieGetHelp';
import GenieAiLicense from './components/GenieAiLicense';
import GenieAiHistory from './components/GenieAiHistory'
import { ConfigProvider } from 'antd';
import GenieAiSettings from './components/GenieAiSettings';

const App = () => {
    return(
        <ConfigProvider  getPopupContainer={node => document.querySelector('.getgenie-main-container') || document.body}> {/** getPopupContainer: All popup related markup were render in the body instead in our wrapper, that's why used this. */}
            {/** This Component will work when we type \ (Backslash) in the paragraph editor */ }
            <AutocompleteTemplates />

            {/** This is for Sidebar */}
            <GenieSidebar />
            
            {/** This route is for wp dashboard menu */}
            <HashRouter hashType="noslash">
                <Switch>
                    <Route key={1} exact path='/write-for-me' component={ WriteForMe } />
                    <Route key={2} exact path='/history' component={ GenieAiHistory }/>
                    <Route key={3} exact path='/license' component={ GenieAiLicense }/>
                    <Route key={4} exact path='/settings' component={ GenieAiSettings }/>
                    <Route key={5} exact path='/help' component={ GenieGetHelp }/>
                </Switch>
            </HashRouter>
        </ConfigProvider>
    )
}



export default App;