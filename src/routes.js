import React from 'react'
import { Navigate } from 'react-router-dom'
// import MainTable from './components/pages/MainTable'


const MainTable = React.lazy(() => import('./components/pages/MainTable'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const ProtectedRoute = ({ element: Element }) => {
  const isLoggedIn = localStorage.getItem('accessToken')
  return isLoggedIn ? <Element /> : <Navigate to="/login" replace />
}


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: () => <ProtectedRoute element={Dashboard} /> },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: () => <ProtectedRoute element={Cards} />, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: () => <ProtectedRoute element={Accordion} /> },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: () => <ProtectedRoute element={Breadcrumbs} /> },
  { path: '/base/cards', name: 'Cards', element: () => <ProtectedRoute element={Cards} /> },
  { path: '/base/carousels', name: 'Carousel', element: () => <ProtectedRoute element={Carousels} /> },
  { path: '/base/collapses', name: 'Collapse', element: () => <ProtectedRoute element={Collapses} /> },
  { path: '/base/list-groups', name: 'List Groups', element: () => <ProtectedRoute element={ListGroups} /> },
  { path: '/base/navs', name: 'Navs', element: () => <ProtectedRoute element={Navs} /> },
  { path: '/base/paginations', name: 'Paginations', element: () => <ProtectedRoute element={Paginations} /> },
  { path: '/base/placeholders', name: 'Placeholders', element: () => <ProtectedRoute element={Placeholders} /> },
  { path: '/base/popovers', name: 'Popovers', element: () => <ProtectedRoute element={Popovers} /> },
  { path: '/base/progress', name: 'Progress', element: () => <ProtectedRoute element={Progress} /> },
  { path: '/base/spinners', name: 'Spinners', element: () => <ProtectedRoute element={Spinners} /> },
  { path: '/base/tabs', name: 'Tabs', element: () => <ProtectedRoute element={Tabs} /> },
  { path: '/base/tables', name: 'Tables', element: () => <ProtectedRoute element={Tables} /> },
  { path: '/base/tooltips', name: 'Tooltips', element: () => <ProtectedRoute element={Tooltips} /> },
  { path: '/buttons', name: 'Buttons', element: () => <ProtectedRoute element={Buttons} />, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: () => <ProtectedRoute element={Buttons} /> },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: () => <ProtectedRoute element={Dropdowns} /> },
  { path: '/buttons/button-groups', name: 'Button Groups', element: () => <ProtectedRoute element={ButtonGroups} /> },
  { path: '/charts', name: 'Charts', element: () => <ProtectedRoute element={Charts} /> },
  { path: '/forms', name: 'Forms', element: () => <ProtectedRoute element={FormControl} />, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: () => <ProtectedRoute element={FormControl} /> },
  { path: '/forms/select', name: 'Select', element: () => <ProtectedRoute element={Select} /> },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: () => <ProtectedRoute element={ChecksRadios} /> },
  { path: '/forms/range', name: 'Range', element: () => <ProtectedRoute element={Range} /> },
  { path: '/forms/input-group', name: 'Input Group', element: () => <ProtectedRoute element={InputGroup} /> },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: () => <ProtectedRoute element={FloatingLabels} /> },
  { path: '/forms/layout', name: 'Layout', element: () => <ProtectedRoute element={Layout} /> },
  { path: '/forms/validation', name: 'Validation', element: () => <ProtectedRoute element={Validation} /> },
  { path: '/icons', exact: true, name: 'Icons', element: () => <ProtectedRoute element={CoreUIIcons} /> },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: () => <ProtectedRoute element={CoreUIIcons} /> },
  { path: '/icons/flags', name: 'Flags', element: () => <ProtectedRoute element={Flags} /> },
  { path: '/icons/brands', name: 'Brands', element: () => <ProtectedRoute element={Brands} /> },
  { path: '/notifications', name: 'Notifications', element: () => <ProtectedRoute element={Alerts} />, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: () => <ProtectedRoute element={Alerts} /> },
  { path: '/notifications/badges', name: 'Badges', element: () => <ProtectedRoute element={Badges} /> },
  { path: '/notifications/modals', name: 'Modals', element: () => <ProtectedRoute element={Modals} /> },
  { path: '/notifications/toasts', name: 'Toasts', element: () => <ProtectedRoute element={Toasts} /> },
  { path: '/widgets', name: 'Widgets', element: () => <ProtectedRoute element={Widgets} /> },
  { path: '/tables/maintable', name: 'MainTable', element: () => <ProtectedRoute element={MainTable} /> },
]

export default routes
