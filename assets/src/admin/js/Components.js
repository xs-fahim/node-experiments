
import AutocompleteTemplates from './components/AutocompleteTemplates'
import { TemplateListScreen } from './components/EditorScreens/TemplateListScreen'
import { WriteTemplatesScreen } from './components/EditorScreens/WriteTemplatesScreen'
import GenieAiHistory from './components/GenieAiHistory'
import GenieAiLicense from './components/GenieAiLicense'
import GenieAiSettings from './components/GenieAiSettings'
import GenieGetHelp from './components/GenieGetHelp'
import HeaderToolbar from './components/HeaderToolbar'
import GenieSidebar from './components/Sidebar'
import WriteForMe from './components/WriteForMe'

window.getGenie.component = !window.getGenie ?? {};

window.getGenie.component = {
    AutocompleteTemplates: AutocompleteTemplates,
    HeaderToolbar
}